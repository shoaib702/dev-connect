import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import FollowersModal from '../components/FollowersModal';
import { getUserById, followUser } from '../api/userApi';
import { getUserPosts } from '../api/postApi';

const PublicProfile = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(false);
    const postsRef = useRef(null);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [id]);

    const loadProfile = async () => {
        try {
            const userData = await getUserById(id);
            setUser(userData);

            // Check if current user is following this user
            setFollowing(userData.followers?.some((f) => f._id === currentUser?._id) || false);

            // Load user's posts
            const userPosts = await getUserPosts(id);
            setPosts(userPosts);
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        try {
            await followUser(id);
            setFollowing(!following);
            // Reload profile to update follower count
            const userData = await getUserById(id);
            setUser(userData);
        } catch (error) {
            console.error('Failed to follow/unfollow:', error);
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

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <Loader size="large" />
                </div>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="page-container">
                    <div className="feed-empty">
                        <div className="feed-empty-icon">😞</div>
                        <div className="feed-empty-text">User not found</div>
                    </div>
                </div>
            </>
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

                            {/* Follow Button */}
                            {currentUser?._id !== id && (
                                <div className="profile-actions">
                                    <button
                                        className={`btn ${following ? 'btn-secondary' : 'btn-primary'}`}
                                        onClick={handleFollow}
                                    >
                                        {following ? '✓ Following' : '+ Follow'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Posts */}
                    <div className="profile-posts" ref={postsRef}>
                        <h2 className="profile-posts-title">{user.name}'s Posts</h2>
                        {posts.length === 0 ? (
                            <div className="feed-empty">
                                <div className="feed-empty-icon">📝</div>
                                <div className="feed-empty-text">No posts yet</div>
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

export default PublicProfile;
