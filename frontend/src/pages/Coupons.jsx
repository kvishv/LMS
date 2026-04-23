import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTag, FiTrash2 } from 'react-icons/fi';

const Coupons = () => {
    const { user } = useContext(AuthContext);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // Form state
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState('');
    const [usageLimit, setUsageLimit] = useState(100);
    const [perUserLimit, setPerUserLimit] = useState(1);
    const [expiresAt, setExpiresAt] = useState('');

    useEffect(() => {
        if (user && user.role === 'Admin') {
            fetchCoupons();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchCoupons = async () => {
        try {
            // Need Admin to view list, or a user variant. We'll show all for admin
            const { data } = await api.get('/coupons');
            setCoupons(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/coupons', {
                code, discountType, discountValue, usageLimit, perUserLimit, expiresAt
            });
            setCoupons([...coupons, data]);
            setShowCreateModal(false);
            toast.success('Coupon created successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create coupon');
        }
    };

    const handleDelete = async (id) => {
         if(window.confirm('Delete this coupon?')) {
              try {
                  await api.delete(`/coupons/${id}`);
                  setCoupons(coupons.filter(c => c._id !== id));
                  toast.success('Coupon deleted');
              } catch(error) {
                  toast.error(error.response?.data?.message || 'Delete failed');
              }
         }
    };

    const handleSimulateApply = async () => {
         // This is a test method simulating a user applying a coupon directly on this page
         const userCode = window.prompt("Enter coupon code:");
         if(!userCode) return;
         
         try {
             const { data } = await api.post('/coupons/validate', { code: userCode });
             toast.success(`Coupon Valid! Disount: ${data.discountValue} ${data.discountType}`);
             
             // Automatically apply it
             await api.post('/coupons/apply', { couponId: data.couponId, discountApplied: data.discountValue });
             toast.success('Coupon used and tracked!');
             fetchCoupons();
         } catch(error) {
             toast.error(error.response?.data?.message || 'Invalid coupon');
         }
    }

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage discount codes and promotional offers.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 space-x-3 flex">
                    <button
                        onClick={handleSimulateApply}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                    >
                        Test Validation
                    </button>
                    {user.role === 'Admin' && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
                        >
                            <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                            Create Coupon
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Limit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                                {user.role === 'Admin' && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td></tr>
                            ) : coupons.length > 0 ? (
                                coupons.map((coupon) => (
                                    <tr key={coupon._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FiTag className="text-gray-400 mr-2" />
                                                <span className="text-sm font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{coupon.code}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {coupon.usageHistory.length} / {coupon.usageLimit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(coupon.expiresAt).toLocaleDateString()}
                                            {new Date() > new Date(coupon.expiresAt) && <span className="ml-2 text-xs text-red-500 font-bold bg-red-50 px-1 rounded">EXPIRED</span>}
                                        </td>
                                        {user.role === 'Admin' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                 <button onClick={() => handleDelete(coupon._id)} className="text-red-600 hover:text-red-900">
                                                     <FiTrash2 className="inline" /> Delete
                                                 </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                  <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No coupons available</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Coupon</h2>
                        <form onSubmit={handleCreateCoupon} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Code (ALL CAPS)</label>
                                <input type="text" required value={code} onChange={e => setCode(e.target.value.toUpperCase())} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select value={discountType} onChange={e => setDiscountType(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2">
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Value</label>
                                    <input type="number" required value={discountValue} onChange={e => setDiscountValue(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Total Usage Limit</label>
                                    <input type="number" required value={usageLimit} onChange={e => setUsageLimit(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Per User Limit</label>
                                    <input type="number" required value={perUserLimit} onChange={e => setPerUserLimit(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                <input type="date" required value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2" />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
