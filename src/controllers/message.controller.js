import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { Notification } from "../models/notification.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get or create conversation
export const getOrCreateConversation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;

  if (!participantId) {
    throw new ApiError(400, "Participant ID is required");
  }

  if (participantId === req.user._id.toString()) {
    throw new ApiError(400, "Cannot create conversation with yourself");
  }

  // Find existing conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, participantId] }
  }).populate('participants', 'name avatar email currentPosition graduationYear');

  // Create new conversation if doesn't exist
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, participantId]
    });

    conversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name avatar email currentPosition graduationYear');
  }

  res.status(200).json(
    new ApiResponse(200, conversation, "Conversation retrieved successfully")
  );
});

// Get all conversations for user
export const getUserConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id
  })
    .populate('participants', 'name avatar email currentPosition graduationYear')
    .populate({
      path: 'lastMessage',
      select: 'content createdAt sender read'
    })
    .sort({ lastMessageTime: -1 });

  // Transform to show the other participant
  const transformedConversations = conversations.map(conv => {
    const otherParticipant = conv.participants.find(
      p => p._id.toString() !== req.user._id.toString()
    );

    return {
      _id: conv._id,
      participant: otherParticipant,
      lastMessage: conv.lastMessage,
      lastMessageTime: conv.lastMessageTime,
      createdAt: conv.createdAt
    };
  });

  res.status(200).json(
    new ApiResponse(200, transformedConversations, "Conversations retrieved successfully")
  );
});

// Send message
export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, content } = req.body;

  if (!conversationId || !content || !content.trim()) {
    throw new ApiError(400, "Conversation ID and message content are required");
  }

  // Verify conversation exists and user is participant
  const conversation = await Conversation.findById(conversationId);
  
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    p => p.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    throw new ApiError(403, "You are not a participant in this conversation");
  }

  // Create message
  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    content: content.trim()
  });

  // Update conversation
  conversation.lastMessage = message._id;
  conversation.lastMessageTime = message.createdAt;
  await conversation.save();

  // Get the recipient (other participant)
  const recipient = conversation.participants.find(
    p => p.toString() !== req.user._id.toString()
  );

  // Create notification for recipient
  if (recipient) {
    await Notification.create({
      recipient: recipient,
      sender: req.user._id,
      type: 'message',
      title: 'New Message',
      message: `${req.user.name} sent you a message`
    });
  }

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name avatar email');

  res.status(201).json(
    new ApiResponse(201, populatedMessage, "Message sent successfully")
  );
});

// Get messages for conversation
export const getConversationMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  // Verify conversation exists and user is participant
  const conversation = await Conversation.findById(conversationId);
  
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    p => p.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    throw new ApiError(403, "You are not a participant in this conversation");
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({
    conversation: conversationId
  })
    .populate('sender', 'name avatar email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalMessages = await Message.countDocuments({
    conversation: conversationId
  });

  // Mark messages as read
  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: req.user._id },
      read: false
    },
    {
      read: true,
      readAt: new Date()
    }
  );

  res.status(200).json(
    new ApiResponse(200, {
      messages: messages.reverse(),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
        hasMore: skip + messages.length < totalMessages
      }
    }, "Messages retrieved successfully")
  );
});

// Mark messages as read
export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  // Verify conversation exists and user is participant
  const conversation = await Conversation.findById(conversationId);
  
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    p => p.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    throw new ApiError(403, "You are not a participant in this conversation");
  }

  // Mark all unread messages as read
  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: req.user._id },
      read: false
    },
    {
      read: true,
      readAt: new Date()
    }
  );

  res.status(200).json(
    new ApiResponse(200, {}, "Messages marked as read")
  );
});

// Get unread message count
export const getUnreadCount = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id
  });

  const conversationIds = conversations.map(c => c._id);

  const unreadCount = await Message.countDocuments({
    conversation: { $in: conversationIds },
    sender: { $ne: req.user._id },
    read: false
  });

  res.status(200).json(
    new ApiResponse(200, { unreadCount }, "Unread count retrieved successfully")
  );
});
