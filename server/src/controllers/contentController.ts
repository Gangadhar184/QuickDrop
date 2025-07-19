import { Request, Response } from "express";
import { ContentModel } from "../models/Content";

export const postContent = async (req: Request, res: Response) => {
    try {
        const { link, type, title } = req.body;
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        
        const content = new ContentModel({
            link, 
            type, 
            title, 
            userId: req.user._id, 
            tags: []
        });
        
        await content.save();
        
        res.status(201).json({
            success: true,
            message: "Content added successfully",
            data: content
        });
        
    } catch (error: any) {
        console.error("Error creating content:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create content",
            error: error.message
        });
    }
};

export const getContent = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const userId = req.user._id;
        const content = await ContentModel.find({
            userId: userId
        }).populate("userId", "fullName"); 
        
        res.json({
            success: true,
            content
        });
        
    } catch (error: any) {
        console.error("Error fetching content:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch content", 
            error: error.message
        });
    }
};

export const deleteContent = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const contentId = req.params.id || req.body.contentId; 
        
        if (!contentId) {
            return res.status(400).json({
                success: false,
                message: "Content ID is required"
            });
        }

        const deletedContent = await ContentModel.findOneAndDelete({
            _id: contentId, 
            userId: req.user._id 
        });

        if (!deletedContent) {
            return res.status(404).json({
                success: false,
                message: "Content not found or you don't have permission to delete it"
            });
        }

        res.json({
            success: true,
            message: "Content deleted successfully"
        });
        
    } catch (error: any) {
        console.error("Error deleting content:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete content",
            error: error.message
        });
    }
};
