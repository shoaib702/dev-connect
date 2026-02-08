import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { updateProfile, uploadProfilePic } from '../api/userApi';

const EditProfile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        skills: user?.skills?.join(', ') || '',
    });
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(user?.profilePic || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Upload profile picture if changed
            if (profilePicFile) {
                await uploadProfilePic(profilePicFile);
            }

            // Update profile data
            const skillsArray = formData.skills
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s);

            const updatedData = await updateProfile({
                name: formData.name,
                bio: formData.bio,
                skills: skillsArray,
            });

            updateUser(updatedData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/my-profile');
            }, 1500);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="page-container">
                <div className="profile-container">
                    <div className="edit-profile-card">
                        <h2 className="edit-profile-title">Edit Profile</h2>

                        {/* Avatar Upload Section */}
                        <div className="edit-avatar-section">
                            <img
                                src={profilePicPreview || 'https://via.placeholder.com/120'}
                                alt="Profile Preview"
                                className="edit-avatar-preview"
                            />
                            <label htmlFor="profile-pic" className="btn btn-secondary edit-avatar-btn">
                                📸 Change Photo
                            </label>
                            <input
                                type="file"
                                id="profile-pic"
                                accept="image/*"
                                onChange={handleProfilePicChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* Edit Form */}
                        <form className="edit-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="bio" className="form-label">
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    className="form-input"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="skills" className="form-label">
                                    Skills
                                </label>
                                <input
                                    type="text"
                                    id="skills"
                                    name="skills"
                                    className="form-input"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="e.g. React, Node.js, Python"
                                />
                                <div className="skills-input-helper">
                                    Separate skills with commas
                                </div>
                            </div>

                            {error && <div className="form-error">{error}</div>}
                            {success && (
                                <div className="form-success">
                                    Profile updated successfully! Redirecting...
                                </div>
                            )}

                            <div className="edit-form-actions">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => navigate('/my-profile')}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading || success}
                                >
                                    {loading ? (
                                        <>
                                            <Loader size="small" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
