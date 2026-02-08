import api from './axios';

// 👤 Get current user profile
export const getMe = async () => {
    try {
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch user profile.';
    }
};

// ✏️ Update user profile
export const updateProfile = async (userData) => {
    try {
        const response = await api.put('/users/update', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to update profile.';
    }
};

// 📸 Upload profile picture
export const uploadProfilePic = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.put('/users/profile-pic', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to upload profile picture.';
    }
};

// 👥 Follow/Unfollow user
export const followUser = async (userId) => {
    try {
        const response = await api.put(`/users/${userId}/follow`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to follow/unfollow user.';
    }
};

// 🔍 Get user by ID
export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch user.';
    }
};

// 🔎 Search users by name
export const searchUsers = async (query) => {
    try {
        const response = await api.get(`/users/search?q=${query}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Search failed.';
    }
};
