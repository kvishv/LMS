import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex-shrink-0">
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        LMS<span className="text-gray-800">Pro</span>
                    </Link>
                </div>
                
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <div className="flex items-center text-gray-700">
                                <FiUser className="mr-2" />
                                <span className="font-medium">{user.fullName}</span>
                                {user.role === 'Admin' && (
                                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Admin</span>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-gray-500 hover:text-red-500 transition"
                            >
                                <FiLogOut className="mr-1" /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
                            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
