import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import PrivateRoute from './routes/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import MyProfile from './pages/MyProfile';
import PublicProfile from './pages/PublicProfile';
import EditProfile from './pages/EditProfile';

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route
                            path="/feed"
                            element={
                                <PrivateRoute>
                                    <Feed />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/my-profile"
                            element={
                                <PrivateRoute>
                                    <MyProfile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile/:id"
                            element={
                                <PrivateRoute>
                                    <PublicProfile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/edit-profile"
                            element={
                                <PrivateRoute>
                                    <EditProfile />
                                </PrivateRoute>
                            }
                        />

                        {/* Default Redirect */}
                        <Route path="/" element={<Navigate to="/feed" replace />} />
                        <Route path="*" element={<Navigate to="/feed" replace />} />
                    </Routes>
                </BrowserRouter>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;
