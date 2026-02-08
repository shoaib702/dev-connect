import api from './axios';

// 📝 Create new post
export const createPost = async (postData) => {
    try {
        const response = await api.post('/posts', postData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to create post.';
    }
};

// 📰 Get all posts (feed)
export const getPosts = async () => {
    try {
        const response = await api.get('/posts');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch posts.';
    }
};

// 📝 Get posts by specific user
export const getUserPosts = async (userId) => {
    try {
        const response = await api.get(`/posts/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch user posts.';
    }
};

// 📝 Get current user's posts
export const getMyPosts = async () => {
    try {
        const response = await api.get('/posts/my-posts');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch your posts.';
    }
};

// ❤️ Like/Unlike post
export const likePost = async (postId) => {
    try {
        const response = await api.put(`/posts/${postId}/like`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to like post.';
    }
};

// 💬 Comment on post
export const commentOnPost = async (postId, text) => {
    try {
        const response = await api.post(`/posts/${postId}/comment`, { text });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to comment.';
    }
};

// ✏️ Update post
export const updatePost = async (postId, postData) => {
    try {
        const response = await api.put(`/posts/${postId}`, postData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to update post.';
    }
};

// 🗑️ Delete post
export const deletePost = async (postId) => {
    try {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to delete post.';
    }
};
