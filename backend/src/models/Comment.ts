import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    user: mongoose.Types.ObjectId;
    prompt: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
}

const CommentSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prompt: {
        type: Schema.Types.ObjectId,
        ref: 'Prompt',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model<IComment>('Comment', CommentSchema);
