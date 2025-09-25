import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import ApiError from './ApiError.js';

const uploadOnCloudinary = async (filePath) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        if (!filePath) {
            return null;
        }

        // Simplified upload without folder
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto'
        });

        console.log('File uploaded to Cloudinary:', response.url);

        // Delete the file from local storage after upload
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return response;
    } catch (err) {
        // Clean up local file if upload fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        console.error('Cloudinary upload error:', err);

        throw new ApiError(500, err.message || 'Failed to upload file to Cloudinary');
    }
}

const deleteFromCloudinary = async (publicId, resourceType) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {

        if (!publicId) {
            return null;
        }

        const result = await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: resourceType
            }
        );

        return result;
    } catch (err) {
        console.error('Cloudinary deletion error:', err);
        throw new ApiError(500, err.message || 'Failed to delete file from Cloudinary');
    }
}

const getResourceType = (url) => {
    if (!url) return 'image';

    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

    const extension = url.toLowerCase().substring(url.lastIndexOf('.'));

    if (videoExtensions.some(ext => extension.includes(ext))) {
        return 'video';
    } else if (imageExtensions.some(ext => extension.includes(ext))) {
        return 'image';
    }

    return 'raw'; // fallback for other file types
}

const extractPublicId = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary,
    extractPublicId,
    getResourceType
};