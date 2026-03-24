import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  bio?: string;
  avatar?: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  savedPrompts: mongoose.Types.ObjectId[];
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  bio: {
    type: String,
    maxlength: 160,
    default: ''
  },
  avatar: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  savedPrompts: [{
    type: Schema.Types.ObjectId,
    ref: 'Prompt'
  }]
}, {
  timestamps: true
});


UserSchema.pre('save', async function () {
  const user = this as unknown as IUser;
  if (!user.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  if (user.password) {
    user.password = await bcrypt.hash(user.password, salt);
  }
});


UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  const user = this as unknown as IUser;
  return await bcrypt.compare(enteredPassword, user.password || '');
};


UserSchema.index({ username: 'text', email: 'text' });

export default mongoose.model<IUser>('User', UserSchema);
