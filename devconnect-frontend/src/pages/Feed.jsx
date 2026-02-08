import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import { getPosts, createPost } from '../api/postApi';

const Feed = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadPosts();
    }, []);

    // Scroll to specific post if hash is present
    useEffect(() => {
        if (location.hash && posts.length > 0) {
            const postId = location.hash.substring(1); // Remove # from hash
            const postElement = document.getElementById(`post-${postId}`);
            if (postElement) {
                setTimeout(() => {
                    postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Add highlight effect
                    postElement.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.5)';
                    setTimeout(() => {
                        postElement.style.boxShadow = '';
                    }, 2000);
                }, 300);
            }
        }
    }, [location.hash, posts]);

    const loadPosts = async () => {
        try {
            const postsData = await getPosts();
            setPosts(postsData);
        } catch (error) {
            console.error('Failed to load posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        setCreating(true);
        try {
            const newPost = await createPost({ content: newPostContent });
            setPosts([newPost, ...posts]);
            setNewPostContent('');
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Failed to create post. Please try again.');
        } finally {
            setCreating(false);
        }
    };

    const handlePostUpdate = (updatedPost) => {
        if (updatedPost.deleted) {
            setPosts(posts.filter((p) => p._id !== updatedPost._id));
        } else {
            setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
        }
    };

    return (
        <>
            <Navbar />
            <div className="page-container">
                <div className="feed-container">
                    {/* Create Post Card */}
                    <div className="create-post-card">
                        <div className="create-post-header">
                            <img
                                src={user?.profilePic || 'https://via.placeholder.com/48'}
                                alt={user?.name}
                                className="create-post-avatar"
                            />
                            <h3>What's on your mind, {user?.name?.split(' ')[0]}?</h3>
                        </div>
                        <form onSubmit={handleCreatePost}>
                            <textarea
                                className="create-post-textarea"
                                placeholder="Share your thoughts..."
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                disabled={creating}
                            />
                            <div className="create-post-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={creating || !newPostContent.trim()}
                                >
                                    {creating ? (
                                        <>
                                            <Loader size="small" />
                                            <span>Posting...</span>
                                        </>
                                    ) : (
                                        'Post'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Posts Feed */}
                    {loading ? (
                        <div className="feed-loading">
                            <Loader size="large" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="feed-empty">
                            <div className="feed-empty-icon">📝</div>
                            <div className="feed-empty-text">No posts yet</div>
                            <p>Be the first to share something!</p>
                        </div>
                    ) : (
                        <div className="posts-feed">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Feed;
