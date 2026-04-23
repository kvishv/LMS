import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { FiPlus, FiBook, FiDollarSign } from 'react-icons/fi';

const Courses = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCourse, setNewCourse] = useState({
        title: '', description: '', category: '', price: 0, maxStudents: 50, duration: 10
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/courses', newCourse);
            setCourses([...courses, data]);
            setShowCreateModal(false);
            toast.success('Course created successfully');
        } catch (error) {
             toast.error(error.response?.data?.message || 'Failed to create course');
        }
    };

    // Very simplified enrollment logic for testing directly without payment gateway
    const handleFreeEnroll = async (courseId) => {
         try {
             await api.post(`/courses/${courseId}/enroll`);
             toast.success('Successfully enrolled!');
             fetchCourses(); // refresh counts
         } catch (error) {
             toast.error(error.response?.data?.message || 'Enrollment failed');
         }
    };

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Browse all available courses.
                    </p>
                </div>
                {user.role === 'Admin' && (
                    <div className="mt-4 sm:mt-0">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
                        >
                            <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                            Create Course
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                 <div className="flex justify-center p-10 text-gray-500">Loading courses...</div>
            ) : courses.length === 0 ? (
                 <div className="bg-white rounded-lg shadow-sm p-10 text-center text-gray-500 border border-gray-200">
                     <p>No courses available at the moment.</p>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => {
                        const isEnrolled = user.enrolledCourses?.includes(course._id);
                        const isFull = course.enrolledStudents >= course.maxStudents;
                        
                        return (
                            <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition">
                                <div className="h-48 bg-gray-200 flex items-center justify-center relative bg-gradient-to-br from-blue-50 to-blue-100">
                                   <FiBook className="text-gray-400 text-5xl" />
                                   <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm border border-gray-100">
                                        {course.category}
                                   </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{course.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                                    
                                    <div className="mt-auto space-y-3">
                                         <div className="flex justify-between items-center text-sm text-gray-500">
                                              <span className="flex items-center"><FiDollarSign className="mr-1"/> ₹{course.price}</span>
                                              <span>{course.enrolledStudents} / {course.maxStudents} Students</span>
                                         </div>
                                         <div className="pt-4 border-t border-gray-100">
                                             {isEnrolled ? (
                                                  <button className="w-full text-center px-4 py-2 border border-blue-600 text-blue-600 bg-blue-50 rounded-md font-medium text-sm transition text-opacity-100 hover:bg-blue-100">
                                                       Continue Learning
                                                  </button>
                                             ) : isFull ? (
                                                  <button disabled className="w-full text-center px-4 py-2 bg-gray-300 text-gray-500 rounded-md font-medium text-sm cursor-not-allowed">
                                                       Course Full
                                                  </button>
                                             ) : (
                                                  <button 
                                                      onClick={() => handleFreeEnroll(course._id)}
                                                      className="w-full text-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium text-sm transition"
                                                  >
                                                       Enroll Now
                                                  </button>
                                             )}
                                         </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Simple Create Modal for Admins */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Course</h2>
                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" required value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea required value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <input type="text" required value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
                                    <input type="number" required value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Max Students</label>
                                    <input type="number" required value={newCourse.maxStudents} onChange={e => setNewCourse({...newCourse, maxStudents: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Duration (hrs)</label>
                                    <input type="number" required value={newCourse.duration} onChange={e => setNewCourse({...newCourse, duration: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Cancel</button>
                                <button type="submit" className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Courses;
