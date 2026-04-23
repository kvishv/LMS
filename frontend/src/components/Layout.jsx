import React from 'react';
import Header from './Header';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { FiHome, FiUsers, FiBook, FiCreditCard, FiTag } from 'react-icons/fi';

const Layout = () => {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
        { path: '/courses', icon: <FiBook />, label: 'Courses' },
        { path: '/payments', icon: <FiCreditCard />, label: 'Payments' },
        { path: '/coupons', icon: <FiTag />, label: 'Coupons' },
        { path: '/users', icon: <FiUsers />, label: 'Users', adminOnly: true },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col">
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    location.pathname.startsWith(item.path)
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
