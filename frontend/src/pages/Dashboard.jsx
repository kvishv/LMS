import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiBookOpen, FiClock, FiActivity } from 'react-icons/fi';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    
    // Fetch a user's enrolled courses to show quick progress
    useEffect(() => {
         const fetchMyCourses = async () => {
             try {
                 // For now, grabbing all courses and filtering
                 // In a fully built app, you'd have a specific /api/users/me/courses endpoint
                 const res = await api.get('/courses');
                 const allCourses = res.data;
                 const myEnrolled = allCourses.filter(c => user.enrolledCourses?.includes(c._id));
                 setCourses(myEnrolled);
             } catch (error) {
                 console.error(error);
             }
         }
         fetchMyCourses();
    }, [user]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.fullName}! 👋</h1>
                <p className="mt-2 text-sm text-gray-600">Here's an overview of your learning progress.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center hover:shadow-md transition">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">
                        <FiBookOpen />
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Enrolled Courses</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{user.enrolledCourses?.length || 0}</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center hover:shadow-md transition">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-4">
                        <FiActivity />
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Completed Lessons</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {user.courseProgress?.reduce((acc, curr) => acc + curr.completedLessons, 0) || 0}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center hover:shadow-md transition">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-4">
                        <FiClock />
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Current Role</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{user.role}</p>
                </div>
            </div>

            {/* Quick Access/Currently Learning */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Currently Learning</h2>
                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {courses.map(course => {
                            const progress = user.courseProgress?.find(p => p.course === course._id)?.percentComplete || 0;
                            return (
                                <div key={course._id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex">
                                    <div className="flex-1">
                                        <span className="text-xs font-semibold tracking-wide uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mb-2">
                                            {course.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1 font-medium">
                                                <span>Progress</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                        <p>You haven't enrolled in any courses yet.</p>
                        <button className="mt-4 bg-blue-50 text-blue-600 font-medium px-4 py-2 rounded-md hover:bg-blue-100 transition">
                            Browse Courses
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
