import mongoose, { Schema, Document } from 'mongoose';

export interface IPrompt extends Document {
    author: mongoose.Types.ObjectId;
    title: string;
    promptText: string;
    modelUsed: string;
    outputImage?: string;
    outputText?: string;
    tags: string[];
    likes: mongoose.Types.ObjectId[];
    comments: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const PromptSchema: Schema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    promptText: {
        type: String,
        required: true,
        trim: true
    },
    modelUsed: {
        type: String,
        required: true,
        trim: true
    },
    outputImage: {
        type: String,
        trim: true
    },
    outputText: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
});


PromptSchema.index({ title: 'text', promptText: 'text', tags: 'text' });

export default mongoose.model<IPrompt>('Prompt', PromptSchema);
