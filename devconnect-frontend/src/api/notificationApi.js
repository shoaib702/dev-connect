import api from './axios';

// 🔔 Placeholder for notification APIs
// Can be extended in the future

export const getNotifications = async () => {
    try {
        const response = await api.get('/notifications');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch notifications.';
    }
};

export const markAsRead = async (notificationId) => {
    try {
        const response = await api.put(`/notifications/${notificationId}/read`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to mark notification as read.';
    }
};

// 🔔 Get unread notification count
export const getUnreadCount = async () => {
    try {
        const response = await api.get('/notifications/unread/count');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to get unread count.';
    }
};

// 🔔 Mark all notifications as read
export const markAllAsRead = async () => {
    try {
        const response = await api.put('/notifications/read-all');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to mark all as read.';
    }
};
