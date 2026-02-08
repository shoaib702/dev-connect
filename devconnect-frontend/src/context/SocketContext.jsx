import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    // Return null if not wrapped in provider (allows component to work without socket)
    return context ?? null;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Connect to socket server
            const newSocket = io('http://localhost:5000', {
                auth: {
                    token: localStorage.getItem('token')
                }
            });

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                // Register user for notifications
                newSocket.emit('addUser', user._id);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
