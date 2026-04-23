import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const { data } = await api.get('/payments');
            setPayments(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
                <p className="mt-2 text-sm text-gray-600">
                    View your past transactions and course purchases.
                </p>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td></tr>
                            ) : payments.length > 0 ? (
                                payments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {payment.course?.title || 'Unknown Course'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            ₹{(payment.amount / 100).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            {payment.razorpayOrderId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                 payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                                                 payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                                 'bg-red-100 text-red-800'
                                             }`}>
                                                 {payment.status === 'COMPLETED' && <FiCheckCircle className="mr-1"/>}
                                                 {payment.status === 'FAILED' && <FiXCircle className="mr-1"/>}
                                                 {payment.status}
                                             </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                  <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No payment history found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
