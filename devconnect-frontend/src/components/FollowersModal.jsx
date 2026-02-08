import { useNavigate } from 'react-router-dom';

const FollowersModal = ({ isOpen, onClose, users, title }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {users && users.length > 0 ? (
                        <div className="users-list">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    className="user-item"
                                    onClick={() => handleUserClick(user._id)}
                                >
                                    <img
                                        src={user.profilePic || 'https://via.placeholder.com/48'}
                                        alt={user.name}
                                        className="user-item-avatar"
                                    />
                                    <div className="user-item-info">
                                        <div className="user-item-name">{user.name}</div>
                                        {user.bio && (
                                            <div className="user-item-bio">{user.bio}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="modal-empty">
                            <p>No {title.toLowerCase()} yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowersModal;
