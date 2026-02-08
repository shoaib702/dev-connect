import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../api/notificationApi';
import { useSocket } from '../context/SocketContext';

const Notifications = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Load unread count on mount
    useEffect(() => {
        loadUnreadCount();
        const interval = setInterval(loadUnreadCount, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    // Listen for real-time notifications
    useEffect(() => {
        if (socket) {
            socket.on('newNotification', (notification) => {
                console.log('New notification received:', notification);
                // Add new notification to the list
                setNotifications(prev => [notification, ...prev]);
                // Increment unread count
                setUnreadCount(prev => prev + 1);
            });

            return () => {
                socket.off('newNotification');
            };
        }
    }, [socket]);

    // Load notifications when dropdown opens
    useEffect(() => {
        if (showDropdown && notifications.length === 0) {
            loadNotifications();
        }
    }, [showDropdown]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadUnreadCount = async () => {
        try {
            const data = await getUnreadCount();
            setUnreadCount(data.count || 0);
        } catch (error) {
            console.error('Failed to load unread count:', error);
        }
    };

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            // Mark as read
            if (!notification.isRead) {
                await markAsRead(notification._id);
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(notifications.map(n =>
                    n._id === notification._id ? { ...n, isRead: true } : n
                ));
            }

            // Navigate based on notification type
            if (notification.type === 'follow') {
                // Navigate to the follower's profile
                navigate(`/profile/${notification.fromUser._id}`);
            } else if (notification.post) {
                // Navigate to feed with post ID to scroll to it
                navigate(`/feed#${notification.post._id}`);
            }

            setShowDropdown(false);
        } catch (error) {
            console.error('Failed to handle notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setUnreadCount(0);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const getNotificationText = (notification) => {
        const userName = notification.fromUser?.name || 'Someone';
        switch (notification.type) {
            case 'like':
                return `${userName} liked your post`;
            case 'comment':
                return `${userName} commented on your post`;
            case 'follow':
                return `${userName} started following you`;
            default:
                return 'New notification';
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return '❤️';
            case 'comment':
                return '💬';
            case 'follow':
                return '👤';
            default:
                return '🔔';
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

    return (
        <div className="notifications-container" ref={dropdownRef}>
            <button
                className="notifications-bell"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="Notifications"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="notifications-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>

            {showDropdown && (
                <div className="notifications-dropdown">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                className="btn-mark-all-read"
                                onClick={handleMarkAllAsRead}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notifications-list">
                        {loading ? (
                            <div className="notifications-loading">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="notifications-empty">
                                <div className="notifications-empty-icon">🔔</div>
                                <div className="notifications-empty-text">No notifications yet</div>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-icon">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="notification-avatar">
                                        <img
                                            src={notification.fromUser?.profilePic || 'https://via.placeholder.com/40'}
                                            alt={notification.fromUser?.name}
                                        />
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-text">
                                            {getNotificationText(notification)}
                                        </div>
                                        {notification.post?.content && (
                                            <div className="notification-post-preview">
                                                "{notification.post.content.substring(0, 50)}..."
                                            </div>
                                        )}
                                        <div className="notification-time">
                                            {formatTime(notification.createdAt)}
                                        </div>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="notification-unread-dot"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
