import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import FollowersModal from '../components/FollowersModal';
import { getMyPosts } from '../api/postApi';

const MyProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const postsRef = useRef(null);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    useEffect(() => {
        loadUserPosts();
    }, [user]);

    const loadUserPosts = async () => {
        try {
            const userPosts = await getMyPosts();
            setPosts(userPosts);
        } catch (error) {
            console.error('Failed to load posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostUpdate = (updatedPost) => {
        if (updatedPost.deleted) {
            setPosts(posts.filter((p) => p._id !== updatedPost._id));
        } else {
            setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
        }
    };

    const scrollToPosts = () => {
        postsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Loader size="large" />
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="page-container">
                <div className="profile-container">
                    {/* Profile Header */}
                    <div className="profile-header">
                        <div className="profile-info">
                            <div className="profile-avatar-container">
                                <img
                                    src={user.profilePic || 'https://via.placeholder.com/120'}
                                    alt={user.name}
                                    className="profile-avatar"
                                />
                            </div>

                            <h1 className="profile-name">{user.name}</h1>
                            <p className="profile-bio">{user.bio || 'No bio yet'}</p>

                            {/* Skills */}
                            {user.skills && user.skills.length > 0 && (
                                <div className="profile-skills">
                                    {user.skills.map((skill, index) => (
                                        <span key={index} className="skill-badge">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="profile-stats">
                                <div className="profile-stat" onClick={scrollToPosts} style={{ cursor: 'pointer' }}>
                                    <span className="profile-stat-value">{posts.length}</span>
                                    <span className="profile-stat-label">Posts</span>
                                </div>
                                <div className="profile-stat" onClick={() => setShowFollowersModal(true)} style={{ cursor: 'pointer' }}>
                                    <span className="profile-stat-value">{user.followers?.length || 0}</span>
                                    <span className="profile-stat-label">Followers</span>
                                </div>
                                <div className="profile-stat" onClick={() => setShowFollowingModal(true)} style={{ cursor: 'pointer' }}>
                                    <span className="profile-stat-value">{user.following?.length || 0}</span>
                                    <span className="profile-stat-label">Following</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="profile-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/edit-profile')}
                                >
                                    ✏️ Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* User Posts */}
                    <div className="profile-posts" ref={postsRef}>
                        <h2 className="profile-posts-title">My Posts</h2>
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                                <Loader size="large" />
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="feed-empty">
                                <div className="feed-empty-icon">📝</div>
                                <div className="feed-empty-text">No posts yet</div>
                                <p>Share your first post on the feed!</p>
                            </div>
                        ) : (
                            <div className="profile-posts-list">
                                {posts.map((post) => (
                                    <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <FollowersModal
                isOpen={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                users={user?.followers || []}
                title="Followers"
            />
            <FollowersModal
                isOpen={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
                users={user?.following || []}
                title="Following"
            />
        </>
    );
};

export default MyProfile;
