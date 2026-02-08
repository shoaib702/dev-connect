import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { likePost, commentOnPost, updatePost, deletePost } from '../api/postApi';

const PostCard = ({ post, onUpdate }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [localPost, setLocalPost] = useState(post);

    const isOwnPost = user?._id === localPost.user?._id;
    const isLiked = localPost.likes?.some((like) => like._id === user?._id);

    const handleLike = async () => {
        try {
            const updatedPost = await likePost(localPost._id);
            setLocalPost(updatedPost);
            if (onUpdate) onUpdate(updatedPost);
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const updatedPost = await commentOnPost(localPost._id, commentText);
            setLocalPost(updatedPost);
            setCommentText('');
            if (onUpdate) onUpdate(updatedPost);
        } catch (error) {
            console.error('Failed to comment:', error);
        }
    };

    const handleEdit = async () => {
        try {
            const updatedPost = await updatePost(localPost._id, { content: editContent });
            setLocalPost(updatedPost);
            setIsEditing(false);
            setShowMenu(false);
            if (onUpdate) onUpdate(updatedPost);
        } catch (error) {
            console.error('Failed to update post:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await deletePost(localPost._id);
            if (onUpdate) onUpdate({ ...localPost, deleted: true });
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    if (localPost.deleted) return null;

    return (
        <div className="post-card" id={`post-${localPost._id}`}>
            {/* Post Header */}
            <div className="post-header">
                <img
                    src={localPost.user?.profilePic || 'https://via.placeholder.com/48'}
                    alt={localPost.user?.name}
                    className="post-avatar"
                    onClick={() => navigate(`/profile/${localPost.user?._id}`)}
                />
                <div className="post-author">
                    <div
                        className="post-author-name"
                        onClick={() => navigate(`/profile/${localPost.user?._id}`)}
                    >
                        {localPost.user?.name}
                    </div>
                    <div className="post-timestamp">{formatTime(localPost.createdAt)}</div>
                </div>

                {isOwnPost && (
                    <div className="post-menu">
                        <button className="post-menu-btn" onClick={() => setShowMenu(!showMenu)}>
                            ⋮
                        </button>
                        {showMenu && (
                            <div className="post-menu-dropdown">
                                <div className="post-menu-item" onClick={() => { setIsEditing(true); setShowMenu(false); }}>
                                    ✏️ Edit
                                </div>
                                <div className="post-menu-item danger" onClick={handleDelete}>
                                    🗑️ Delete
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Post Content */}
            {isEditing ? (
                <div className="edit-post-form">
                    <textarea
                        className="edit-post-textarea"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="What's on your mind?"
                    />
                    <div className="edit-post-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={handleEdit}>
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="post-content">{localPost.content}</div>
            )}

            {/* Post Actions */}
            <div className="post-actions">
                <button
                    className={`post-action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    <span className="post-action-icon">{isLiked ? '❤️' : '🤍'}</span>
                    <span>{localPost.likes?.length || 0}</span>
                </button>

                <button
                    className="post-action-btn"
                    onClick={() => setShowComments(!showComments)}
                >
                    <span className="post-action-icon">💬</span>
                    <span>{localPost.comments?.length || 0}</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="comments-section">
                    <div className="comments-header">
                        Comments ({localPost.comments?.length || 0})
                    </div>

                    {/* Comment Form */}
                    <form className="comment-form" onSubmit={handleComment}>
                        <input
                            type="text"
                            className="comment-input"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary btn-sm">
                            Post
                        </button>
                    </form>

                    {/* Comments List */}
                    <div className="comments-list">
                        {localPost.comments?.map((comment) => (
                            <div key={comment._id} className="comment">
                                <img
                                    src={comment.user?.profilePic || 'https://via.placeholder.com/32'}
                                    alt={comment.user?.name}
                                    className="comment-avatar"
                                    onClick={() => navigate(`/profile/${comment.user?._id}`)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <div className="comment-content">
                                    <div
                                        className="comment-author"
                                        onClick={() => navigate(`/profile/${comment.user?._id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {comment.user?.name}
                                    </div>
                                    <div className="comment-text">{comment.text}</div>
                                    <div className="comment-timestamp">{formatTime(comment.createdAt)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
