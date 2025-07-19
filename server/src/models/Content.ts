import mongoose, { Schema, model, Document } from "mongoose";


export interface IContent extends Document {
    title: string;
    link: string;
    tags: mongoose.Types.ObjectId[];
    type: string;
    userId: mongoose.Types.ObjectId;
}

export interface ILink extends Document {
    hash: string;
    userId: mongoose.Types.ObjectId;
}

// Content Schema
const ContentSchema = new Schema<IContent>({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    link: {
        type: String,
        required: [true, "Link is required"],
        trim: true
    },
    tags: [{
        type: Schema.Types.ObjectId, 
        ref: 'Tag'
    }],
    type: {
        type: String,
        enum: ['article', 'video', 'tweet', 'document', 'other'], 
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, "User ID is required"]
    }
}, { 
    timestamps: true 
});

// Link Schema
const LinkSchema = new Schema<ILink>({
    hash: {
        type: String,
        required: [true, "Hash is required"],
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true 
    }
}, { 
    timestamps: true 
});


export const ContentModel = model<IContent>("Content", ContentSchema);
export const LinkModel = model<ILink>("Links", LinkSchema);
