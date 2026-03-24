import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    type: 'like' | 'comment' | 'follow' | 'message';
    fromUser: mongoose.Types.ObjectId;
    promptId?: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['like', 'comment', 'follow', 'message'],
        required: true
    },
    fromUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    promptId: {
        type: Schema.Types.ObjectId,
        ref: 'Prompt'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
