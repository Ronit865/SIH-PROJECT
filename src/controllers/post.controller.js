import asyncHandler from '../utils/asyncHandler.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { uploadOnCloudinary, deleteFromCloudinary, extractPublicId } from '../utils/cloudinary.js';
import { containsInappropriateContent } from '../utils/contentFilter.js';

// Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { content, category } = req.body;

  if (!content || !content.trim()) {
    throw new ApiError(400, "Post content is required");
  }

  // Check for inappropriate content
  if (containsInappropriateContent(content)) {
    throw new ApiError(400, "Your post contains inappropriate content. Please remove offensive language and try again.");
  }

  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  // Handle image uploads if present
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadedImage = await uploadOnCloudinary(file.path);
      if (uploadedImage) {
        imageUrls.push(uploadedImage.url);
      }
    }
  }

  const post = await Post.create({
    content,
    category,
    author: req.user._id,
    images: imageUrls
  });

  const populatedPost = await Post.findById(post._id)
    .populate('author', 'name avatar email graduationYear currentPosition company');

  return res
    .status(201)
    .json(new ApiResponse(201, populatedPost, "Post created successfully"));
});

// Get all posts with pagination and filters
const getAllPosts = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    category, 
    sortBy = 'createdAt', 
    order = 'desc',
    search 
  } = req.query;

  const skip = (page - 1) * limit;
  
  // Build query
  let query = { isActive: true };
  
  if (category && category !== 'all') {
    query.category = category;
  }

  if (search) {
    query.content = { $regex: search, $options: 'i' };
  }

  // Build sort
  let sortOption = {};
  if (sortBy === 'hot') {
    // Sort by net votes and recency
    sortOption = { upvotes: -1, createdAt: -1 };
  } else if (sortBy === 'new') {
    sortOption = { createdAt: -1 };
  } else if (sortBy === 'top') {
    sortOption = { upvotes: -1 };
  } else {
    sortOption[sortBy] = order === 'desc' ? -1 : 1;
  }

  // Pinned posts should always be first
  const pinnedPosts = await Post.find({ ...query, isPinned: true })
    .populate('author', 'name avatar email graduationYear currentPosition company')
    .sort(sortOption)
    .limit(parseInt(limit));

  const regularPosts = await Post.find({ ...query, isPinned: false })
    .populate('author', 'name avatar email graduationYear currentPosition company')
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit) - pinnedPosts.length);

  const posts = [...pinnedPosts, ...regularPosts];
  const totalPosts = await Post.countDocuments(query);

  return res
    .status(200)
    .json(new ApiResponse(200, {
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasMore: skip + posts.length < totalPosts
      }
    }, "Posts fetched successfully"));
});

// Get a single post by ID
const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId)
    .populate('author', 'name avatar email graduationYear currentPosition company');

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});

// Update post
const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content, category } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if user is the author
  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this post");
  }

  if (content) post.content = content;
  if (category) post.category = category;

  await post.save();

  const updatedPost = await Post.findById(postId)
    .populate('author', 'name avatar email graduationYear currentPosition company');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

// Delete post (soft delete)
const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if user is the author or admin
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  // Check if post is within 24 hours (admins can delete anytime)
  if (req.user.role !== 'admin') {
    const postAge = Date.now() - new Date(post.createdAt).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (postAge > twentyFourHours) {
      throw new ApiError(403, "Posts can only be deleted within 24 hours of posting");
    }
  }

  post.isActive = false;
  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

// Upvote a post
const upvotePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Check if user already upvoted
  const hasUpvoted = post.upvotedBy.includes(userId);
  const hasDownvoted = post.downvotedBy.includes(userId);

  if (hasUpvoted) {
    // Remove upvote
    post.upvotedBy = post.upvotedBy.filter(id => id.toString() !== userId.toString());
    post.upvotes = Math.max(0, post.upvotes - 1);
  } else {
    // Add upvote
    post.upvotedBy.push(userId);
    post.upvotes += 1;

    // Remove downvote if exists
    if (hasDownvoted) {
      post.downvotedBy = post.downvotedBy.filter(id => id.toString() !== userId.toString());
      post.downvotes = Math.max(0, post.downvotes - 1);
    }
  }

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      hasUpvoted: !hasUpvoted,
      hasDownvoted: false
    }, hasUpvoted ? "Upvote removed" : "Post upvoted"));
});

// Downvote a post
const downvotePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const hasUpvoted = post.upvotedBy.includes(userId);
  const hasDownvoted = post.downvotedBy.includes(userId);

  if (hasDownvoted) {
    // Remove downvote
    post.downvotedBy = post.downvotedBy.filter(id => id.toString() !== userId.toString());
    post.downvotes = Math.max(0, post.downvotes - 1);
  } else {
    // Add downvote
    post.downvotedBy.push(userId);
    post.downvotes += 1;

    // Remove upvote if exists
    if (hasUpvoted) {
      post.upvotedBy = post.upvotedBy.filter(id => id.toString() !== userId.toString());
      post.upvotes = Math.max(0, post.upvotes - 1);
    }
  }

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      hasUpvoted: false,
      hasDownvoted: !hasDownvoted
    }, hasDownvoted ? "Downvote removed" : "Post downvoted"));
});

// Save/Bookmark a post
const toggleSavePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const hasSaved = post.savedBy.includes(userId);

  if (hasSaved) {
    post.savedBy = post.savedBy.filter(id => id.toString() !== userId.toString());
  } else {
    post.savedBy.push(userId);
  }

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {
      isSaved: !hasSaved
    }, hasSaved ? "Post unsaved" : "Post saved"));
});

// Get saved posts by user
const getSavedPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const posts = await Post.find({
    savedBy: req.user._id,
    isActive: true
  })
    .populate('author', 'name avatar email graduationYear currentPosition company')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalPosts = await Post.countDocuments({
    savedBy: req.user._id,
    isActive: true
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasMore: skip + posts.length < totalPosts
      }
    }, "Saved posts fetched successfully"));
});

// Get posts by specific user
const getUserPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const posts = await Post.find({
    author: userId,
    isActive: true
  })
    .populate('author', 'name avatar email graduationYear currentPosition company')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalPosts = await Post.countDocuments({
    author: userId,
    isActive: true
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasMore: skip + posts.length < totalPosts
      }
    }, "User posts fetched successfully"));
});

// Get communication statistics
const getCommunicationStats = asyncHandler(async (req, res) => {
  const totalPosts = await Post.countDocuments({ isActive: true });
  const totalComments = await Comment.countDocuments({ isActive: true });
  
  // Get active users (users who posted in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const activeUsers = await Post.distinct('author', {
    createdAt: { $gte: thirtyDaysAgo },
    isActive: true
  });

  // Calculate total upvotes across all posts
  const upvotesResult = await Post.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, totalUpvotes: { $sum: '$upvotes' } } }
  ]);

  const totalUpvotes = upvotesResult.length > 0 ? upvotesResult[0].totalUpvotes : 0;

  return res
    .status(200)
    .json(new ApiResponse(200, {
      totalPosts,
      activeUsers: activeUsers.length,
      comments: totalComments,
      upvotes: totalUpvotes
    }, "Communication stats fetched successfully"));
});

// Pin/Unpin a post (admin only)
const togglePinPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (req.user.role !== 'admin') {
    throw new ApiError(403, "Only admins can pin posts");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  post.isPinned = !post.isPinned;
  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, post, post.isPinned ? "Post pinned" : "Post unpinned"));
});

export {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  toggleSavePost,
  getSavedPosts,
  getUserPosts,
  getCommunicationStats,
  togglePinPost
};
