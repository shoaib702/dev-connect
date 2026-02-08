import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import CSS in proper order
import './styles/variables.css';
import './styles/base.css';
import './styles/buttons.css';
import './styles/navbar.css';
import './styles/notifications.css';
import './styles/auth.css';
import './styles/feed.css';
import './styles/post.css';
import './styles/profile.css';
import './styles/modal.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
