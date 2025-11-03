import React, { useState, useEffect, useCallback, useContext } from 'react';

const API_BASE_URL = 'http://localhost:8080/api'; 

const AuthContext = React.createContext(null);
const useAuthContext = () => useContext(AuthContext);

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsAuthenticated(false);
            setLoading(false);
        }, 500);
    }, []);

    const login = useCallback(async (uid, password) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            let mockUser = null;
            if (uid === 'admin' && password === 'pass') {
                mockUser = { id: uid, firstName: 'Portal', lastName: 'Admin', role: 'admin' };
            } else if (uid === 'student' && password === 'pass') {
                mockUser = { id: uid, firstName: 'Tanay', lastName: 'Student', role: 'student' };
            } 
            
            if (mockUser) {
                setUser(mockUser);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, message: 'Invalid credentials.' };
            }
        } catch (error) {
            return { success: false, message: 'Login failed due to network or server error.' };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const updateProfile = useCallback(async (newDetails) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            setUser(prev => ({ ...prev, ...newDetails }));
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Failed to update profile.' };
        }
    }, []);

    const changePassword = useCallback(async (oldPassword, newPassword) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            return { success: true, message: 'Password changed successfully.' };
        } catch (error) {
            return { success: false, message: 'Failed to change password.' };
        }
    }, []);

    return { isAuthenticated, user, loading, login, logout, updateProfile, changePassword };
};

const TimetableComponent = () => {
    const { user } = useAuthContext();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterSemester, setFilterSemester] = useState('2024-25-Spring');
    
    const availableSemesters = ['2024-25-Spring', '2024-25-Fall', '2023-24-Spring'];

    const fetchTimetable = useCallback(async (uid, semester) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/timetables/student/${uid}?semester=${semester}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch schedule: ${response.statusText}`);
            }
            
            const data = await response.json();
            const daysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
            data.sort((a, b) => daysOrder.indexOf(a.dayOfWeek.toUpperCase()) - daysOrder.indexOf(b.dayOfWeek.toUpperCase()) || a.startTime.localeCompare(b.startTime));
            
            setSchedule(data);
        } catch (err) {
            setError('Could not load timetable. Ensure the Spring Boot backend is running and the API is accessible.');
            setSchedule([]);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user?.id && filterSemester) {
            fetchTimetable(user.id, filterSemester);
        }
    }, [user, filterSemester, fetchTimetable]);

    const renderTimetableGrid = () => {
        if (loading) return <p className="text-center p-4">Loading schedule...</p>;
        if (error) return <p className="text-center text-red-500 p-4">{error}</p>;
        if (schedule.length === 0) return <p className="text-center p-4">No schedule found for {filterSemester}.</p>;
        
        const scheduleByDay = schedule.reduce((acc, item) => {
            const day = item.dayOfWeek.toUpperCase();
            if (!acc[day]) acc[day] = [];
            acc[day].push(item);
            return acc;
        }, {});

        const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {days.map(day => (
                            scheduleByDay[day] ? (
                                scheduleByDay[day].map((item, index) => (
                                    <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className={`px-6 py-4 whitespace-nowrap font-bold ${index === 0 ? 'border-r border-gray-200' : 'text-transparent'}`}>
                                            {index === 0 ? day : '.'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.startTime} - {item.endTime}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.subject}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.room}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{item.classType}</td>
                                    </tr>
                                ))
                            ) : null
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Class Timetable</h3>
            
            <div className="mb-4">
                <label htmlFor="semester-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Semester:
                </label>
                <select
                    id="semester-select"
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {availableSemesters.map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                    ))}
                </select>
            </div>

            {renderTimetableGrid()}
        </div>
    );
};


const LoginComponent = () => {
    const [uid, setUid] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuthContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        const result = await login(uid, password); 

        if (!result.success) {
            setError(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="auth-container p-6 bg-white shadow-xl rounded-xl w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Portal Login</h2>
            <p className="text-center text-sm mb-4 text-gray-500">Try 'admin/pass' or 'student/pass'</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="UID"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                {error && <p className="error-message text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={isSubmitting}
                    className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-300">
                    {isSubmitting ? 'Logging In...' : 'Login'}
                </button>
                <p className="forgot-password text-center text-sm">
                    <a href="#reset" className="text-indigo-600 hover:text-indigo-800">Forgot Password?</a> 
                </p>
            </form>
        </div>
    );
};

const ProfileComponent = ({ toggleView }) => {
    const { user, updateProfile, changePassword } = useAuthContext();
    const [isEditing, setIsEditing] = useState(false);
    const [newFirstName, setNewFirstName] = useState(user?.firstName || '');
    const [newLastName, setNewLastName] = useState(user?.lastName || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPass, setIsChangingPass] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');

    const handleUpdate = async () => {
        setProfileMessage('');
        setIsUpdating(true);
        const result = await updateProfile({ firstName: newFirstName, lastName: newLastName });

        if (result.success) {
            setProfileMessage('Profile updated successfully!');
            setIsEditing(false);
        } else {
            setProfileMessage(result.message);
        }
        setIsUpdating(false);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage('');

        if (newPassword !== confirmPassword) {
            setPasswordMessage('New passwords do not match.');
            return;
        }

        setIsChangingPass(true);
        const result = await changePassword(oldPassword, newPassword);

        if (result.success) {
            setPasswordMessage(result.message);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setPasswordMessage(result.message);
        }
        setIsChangingPass(false);
    };

    if (!user) return <p className="text-center p-4">User data not available.</p>;

    return (
        <div className="profile-container p-6 bg-white shadow-xl rounded-xl w-full max-w-2xl mx-auto space-y-6">
            <button onClick={() => toggleView('dashboard')} className="text-indigo-600 hover:text-indigo-800 font-medium">← Back to Dashboard</button>
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">User Profile</h2>
            
            <div className="profile-info space-y-3">
                <p><strong>UID:</strong> {user.id}</p>
                <p><strong>Role:</strong> <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">{user.role.toUpperCase()}</span></p>
                
                {isEditing ? (
                    <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                        <label className="block">First Name: <input value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} className="w-full p-2 border rounded" /></label>
                        <label className="block">Last Name: <input value={newLastName} onChange={(e) => setNewLastName(e.target.value)} className="w-full p-2 border rounded" /></label>
                        <div className="flex space-x-2">
                            <button onClick={handleUpdate} disabled={isUpdating} className="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition">
                                {isUpdating ? 'Saving...' : 'Save Details'}
                            </button>
                            <button onClick={() => setIsEditing(false)} disabled={isUpdating} className="flex-1 bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-500 transition">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-lg"><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Edit Details</button>
                    </div>
                )}
                {profileMessage && <p className={`text-sm ${profileMessage.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>{profileMessage}</p>}
            </div>

            <div className="password-change p-6 border rounded-lg shadow-inner bg-gray-50">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-3">
                    <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="w-full p-2 border rounded" />
                    <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full p-2 border rounded" />
                    <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full p-2 border rounded" />
                    {passwordMessage && <p className={`text-sm ${passwordMessage.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>{passwordMessage}</p>}
                    <button type="submit" disabled={isChangingPass} className="w-full bg-red-600 text-white p-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-red-300">
                        {isChangingPass ? 'Updating...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const DashboardComponent = ({ toggleView }) => {
    const { user, logout } = useAuthContext();
    
    const userName = user?.firstName || user?.id || 'User';

    return (
        <div className="dashboard-container p-6 w-full max-w-6xl mx-auto">
            <header className="dashboard-header flex justify-between items-center pb-4 border-b mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900">Welcome, {userName}!</h2>
                <div className="user-actions flex space-x-3">
                    <button onClick={() => toggleView('profile')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition">
                        My Profile
                    </button>
                    <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md">
                        Logout
                    </button>
                </div>
            </header>

            <div className="module-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="module-card results-module bg-yellow-50 p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">🏆 Results Management (M2)</h3>
                    <p className="text-gray-600 mb-4">Access your academic records and performance history.</p>
                    <button onClick={() => alert('Module 2 API will be called here!')} className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition">View Results</button>
                </div>

                <div className="module-card announcements-module bg-blue-50 p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">📢 Announcements & Notices (M3)</h3>
                    <p className="text-gray-600 mb-4">View urgent campus-wide academic updates.</p>
                    <button onClick={() => alert('Module 3 API will be called here for feed!')} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition">Check Notices</button>
                </div>
                
                <div className="lg:col-span-3">
                    <TimetableComponent />
                </div>
                
                {user?.role === 'admin' && (
                    <div className="module-card admin-module special-access lg:col-span-3 bg-purple-50 p-6 rounded-xl shadow-2xl border-t-8 border-purple-700">
                        <h3 className="text-2xl font-black mb-2 text-purple-800">🔑 Administration Panel (M5)</h3>
                        <p className="text-purple-600 mb-4 font-medium">Elevated access for results upload/edit and timetable management.</p>
                        <button onClick={() => alert('Admin login is successful. This section links to the Spring Boot Admin API endpoints.')} className="px-6 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition shadow-lg">
                            Go to Admin Tools
                        </button>
                    </div>
                )}
                
            </div>
        </div>
    );
};

const Module1AuthAndProfile = () => {
    const { isAuthenticated, loading } = useAuthContext();
    const [currentView, setCurrentView] = useState('dashboard'); 

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-100"><div className="text-xl font-medium text-gray-700">Loading authentication status...</div></div>;
    }

    const handleToggleView = (view) => {
        setCurrentView(view);
    };

    let mainContent;
    if (!isAuthenticated) {
        mainContent = <LoginComponent />;
    } else {
        if (currentView === 'profile') {
            mainContent = <ProfileComponent toggleView={handleToggleView} />;
        } else {
            mainContent = <DashboardComponent toggleView={handleToggleView} />;
        }
    }

    return (
        <div className="module-1-app min-h-screen bg-gray-100 font-sans">
            <header className="bg-white shadow-md">
                <div className="w-full max-w-6xl mx-auto p-4">
                    <h1 className="text-3xl font-bold text-indigo-600">Student Academic Portal</h1>
                </div>
            </header>
            <main className="pt-8 pb-12">
                {mainContent}
            </main>
        </div>
    );
};

export default () => (
    <AuthContext.Provider value={useAuth()}>
        <style>
            {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
            body { font-family: 'Inter', sans-serif; }
            .module-1-app { background-color: #f7f7f7; }
            .auth-container { transition: all 0.3s ease; }
            .module-card { transition: transform 0.2s, box-shadow 0.2s; }
            .module-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); }
            .special-access { background-color: #f3e8ff !important; }
            .timetable-module table { width: 100%; border-collapse: collapse; }
            .timetable-module th, .timetable-module td { border-bottom: 1px solid #e5e7eb; }
            `}
        </style>
        <script src="https://cdn.tailwindcss.com"></script>
        <Module1AuthAndProfile />
    </AuthContext.Provider>
);
