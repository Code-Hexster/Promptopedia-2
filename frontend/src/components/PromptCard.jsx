import { Link } from 'react-router-dom';
import { Heart, MessageSquare, ExternalLink, Bookmark } from 'lucide-react';
import { useState, useContext, useEffect } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import './PromptCard.css';

export default function PromptCard({ prompt }) {
    const { user } = useContext(AuthContext);
    const [likes, setLikes] = useState(prompt.likes || []);
    const [isLiked, setIsLiked] = useState(prompt.likes?.includes(user?._id));
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (user && user.savedPrompts && user.savedPrompts.includes(prompt._id)) {
            setIsSaved(true);
        }
    }, [user, prompt._id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleLike = async () => {
        if (!user) return;

        try {
            const response = await axios.put(`/prompts/like/${prompt._id}`);
            setLikes(response.data);
            setIsLiked(response.data.includes(user._id));
        } catch (error) {
            console.error('Error liking prompt:', error);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            await axios.put(`/users/save/${prompt._id}`);
            setIsSaved(!isSaved);
        } catch (error) {
            console.error('Error saving prompt:', error);
        }
    };

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    const fetchComments = async () => {
        if (loadingComments) return;
        setLoadingComments(true);
        try {
            const response = await axios.get(`/comments/${prompt._id}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(`/comments/${prompt._id}`, { text: newComment });
            setComments([response.data, ...comments]); // Add new comment to top
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const toggleComments = () => {
        if (!showComments && comments.length === 0) {
            fetchComments();
        }
        setShowComments(!showComments);
    };

    return (
        <article className="prompt-card">
            <div className="card-header">
                <Link to={`/profile/${prompt.author?._id}`} className="author-info">
                    <div className="author-avatar">
                        {prompt.author?.avatar ? (
                            <img src={prompt.author.avatar} alt={prompt.author.username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            prompt.author?.username?.charAt(0) || 'U'
                        )}
                    </div>
                    <div className="author-details">
                        <span className="author-name">{prompt.author?.username || 'Unknown User'}</span>
                        <span className="post-date">{formatDate(prompt.createdAt)}</span>
                    </div>
                </Link>
                <span className="model-badge">{prompt.modelUsed}</span>
            </div>

            <h3 className="card-title">{prompt.title}</h3>

            <div className="prompt-content">
                {prompt.promptText}
            </div>

            {prompt.outputImage && (
                <div className="output-image-container">
                    <img
                        src={prompt.outputImage}
                        alt={prompt.title}
                        className="output-image"
                        loading="lazy"
                    />
                </div>
            )}

            {prompt.outputText && (
                <div className="output-text-container">
                    <div className="output-text-header">Result:</div>
                    <pre className="output-text-content">
                        {prompt.outputText}
                    </pre>
                </div>
            )}

            {prompt.tags && prompt.tags.length > 0 && (
                <div className="card-tags">
                    {prompt.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                    ))}
                </div>
            )}

            <div className="card-footer">
                <button
                    className={`action-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    <Heart size={18} fill={isLiked ? '#ef4444' : 'none'} color={isLiked ? '#ef4444' : 'currentColor'} />
                    <span>{likes.length}</span>
                </button>
                <button className="action-button" onClick={toggleComments}>
                    <MessageSquare size={18} />
                    <span>{comments.length > 0 ? comments.length : (prompt.comments?.length || 0)}</span>
                </button>
                <button className={`action-button ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
                    <Bookmark size={18} fill={isSaved ? '#f59e0b' : 'none'} color={isSaved ? '#f59e0b' : 'currentColor'} />
                </button>
                {prompt.outputImage && (
                    <a href={prompt.outputImage} target="_blank" rel="noopener noreferrer" className="action-button">
                        <ExternalLink size={18} />
                        <span>View Result</span>
                    </a>
                )}
            </div>

            {showComments && (
                <div className="comments-section">
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <input
                            type="text"
                            className="comment-input"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" className="post-comment-btn" disabled={!newComment.trim()}>Post</button>
                    </form>

                    <div className="comments-list">
                        {comments.map((comment) => (
                            <div key={comment._id} className="comment-item">
                                <div className="comment-avatar">
                                    {comment.user?.username?.charAt(0) || 'U'}
                                </div>
                                <div className="comment-content">
                                    <span className="comment-author">{comment.user?.username || 'Unknown'}</span>
                                    <p className="comment-text">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
