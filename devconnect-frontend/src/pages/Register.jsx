import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api/authApi';
import Loader from '../components/Loader';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        bio: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await registerApi(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-logo">DevConnect</h1>
                    <p className="auth-subtitle">Create your account and start connecting</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-input"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio" className="form-label">
                            Bio (Optional)
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            className="form-input"
                            placeholder="Tell us about yourself..."
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    {error && <div className="form-error">{error}</div>}
                    {success && (
                        <div className="form-success">
                            Account created successfully! Redirecting to login...
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary auth-submit"
                        disabled={loading || success}
                    >
                        {loading ? (
                            <div className="auth-loading">
                                <Loader size="small" />
                                <span>Creating account...</span>
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
