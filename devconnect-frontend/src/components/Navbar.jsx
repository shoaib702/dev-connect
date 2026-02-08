import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { searchUsers } from '../api/userApi';
import Notifications from './Notifications';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search users as user types
    useEffect(() => {
        const searchTimeout = setTimeout(async () => {
            if (searchQuery.trim().length > 0) {
                try {
                    const results = await searchUsers(searchQuery);
                    setSearchResults(results);
                    setShowSearchResults(true);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                }
            } else {
                setSearchResults([]);
                setShowSearchResults(false);
            }
        }, 300); // Debounce search

        return () => clearTimeout(searchTimeout);
    }, [searchQuery]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearchResultClick = (userId) => {
        navigate(`/profile/${userId}`);
        setSearchQuery('');
        setShowSearchResults(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo/Brand */}
                <Link to="/feed" className="navbar-brand">
                    DevConnect
                </Link>

                {/* Search Bar */}
                <div className="navbar-search" ref={searchRef}>
                    <span className="navbar-search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery && setShowSearchResults(true)}
                    />

                    {/* Search Results Dropdown */}
                    {showSearchResults && (
                        <div className="search-results">
                            {searchResults.length > 0 ? (
                                searchResults.map((result) => (
                                    <div
                                        key={result._id}
                                        className="search-result-item"
                                        onClick={() => handleSearchResultClick(result._id)}
                                    >
                                        <img
                                            src={result.profilePic || 'https://via.placeholder.com/40'}
                                            alt={result.name}
                                            className="search-result-avatar"
                                        />
                                        <div className="search-result-info">
                                            <div className="search-result-name">{result.name}</div>
                                            <div className="search-result-bio">
                                                {result.bio || 'No bio available'}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="search-no-results">No users found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <div className="navbar-menu">
                    <Link to="/feed" className="navbar-link">
                        Feed
                    </Link>
                    <Link to="/my-profile" className="navbar-link">
                        My Profile
                    </Link>
                </div>

                {/* Notifications */}
                <Notifications />

                {/* User Avatar & Dropdown */}
                <div className="navbar-user" ref={dropdownRef}>
                    <img
                        src={user?.profilePic || 'https://via.placeholder.com/40'}
                        alt={user?.name || 'User'}
                        className="navbar-avatar"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />

                    <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                        <div className="dropdown-item" onClick={() => navigate('/my-profile')}>
                            👤 My Profile
                        </div>
                        <div className="dropdown-item" onClick={() => navigate('/edit-profile')}>
                            ✏️ Edit Profile
                        </div>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-item" onClick={handleLogout}>
                            🚪 Logout
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
