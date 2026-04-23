import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId) => {
         try {
              const { data } = await api.put(`/users/${userId}/role`);
              setUsers(users.map(u => u._id === userId ? data : u));
              toast.success('User role updated');
         } catch(error) {
              toast.error(error.response?.data?.message || 'Failed to update role');
         }
    }

    const handleStatusChange = async (userId) => {
         try {
             const { data } = await api.put(`/users/${userId}/status`);
             setUsers(users.map(u => u._id === userId ? data : u));
             toast.success('User status updated');
         } catch (error) {
             toast.error(error.response?.data?.message || 'Failed to update status');
         }
    };

    const handleDelete = async (userId) => {
        if(window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${userId}`);
                setUsers(users.filter(u => u._id !== userId));
                toast.success('User deleted successfully');
            } catch (error) {
                 toast.error(error.response?.data?.message || 'Failed to delete user');
            }
        }
    }

    const filteredUsers = users.filter(user => 
         user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        View and manage all users in the system.
                    </p>
                </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                     <div className="relative w-72">
                         <input 
                             type="text" 
                             placeholder="Search users..." 
                             className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-700" 
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                         />
                     </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td></tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center">
                                                    {user.fullName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button 
                                                onClick={() => handleRoleChange(user._id)}
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full hover:bg-opacity-80 transition cursor-pointer ${
                                                user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {user.role}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                             <button 
                                                onClick={() => handleStatusChange(user._id)}
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full hover:bg-opacity-80 transition cursor-pointer ${
                                                user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.status}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                             <button
                                                onClick={() => handleDelete(user._id)} 
                                                className="text-red-600 hover:text-red-900 transition font-medium"
                                             >
                                                 Delete
                                             </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                  <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No users found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
