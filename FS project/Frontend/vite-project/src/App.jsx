import React, { useState, useEffect, useCallback, useContext } from 'react';

let initialTimetable = [
    { id: 1, dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:00', subject: 'Calculus I', room: 'A101', classType: 'Lecture', semester: '2024-25-Spring', studentUid: 'student' },
    { id: 2, dayOfWeek: 'MONDAY', startTime: '10:00', endTime: '12:00', subject: 'Data Structures Lab', room: 'B205', classType: 'Lab', semester: '2024-25-Spring', studentUid: 'student' },
    { id: 3, dayOfWeek: 'WEDNESDAY', startTime: '11:00', endTime: '12:00', subject: 'Physics II', room: 'A101', classType: 'Lecture', semester: '2024-25-Spring', studentUid: 'student' },
    { id: 4, dayOfWeek: 'THURSDAY', startTime: '14:00', endTime: '16:00', subject: 'Software Engineering', room: 'C301', classType: 'Seminar', semester: '2024-25-Spring', studentUid: 'student' },
    { id: 5, dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '10:00', subject: 'Ethics in Tech', room: 'A202', classType: 'Lecture', semester: '2024-25-Spring', studentUid: 'student' },
    { id: 6, dayOfWeek: 'TUESDAY', startTime: '10:00', endTime: '11:00', subject: 'Advanced AI', room: 'D401', classType: 'Lecture', semester: '2024-25-Spring', studentUid: 'newstudent' },
    { id: 7, dayOfWeek: 'TUESDAY', startTime: '11:00', endTime: '13:00', subject: 'Machine Learning Lab', room: 'E502', classType: 'Lab', semester: '2024-25-Spring', studentUid: 'newstudent' },
];

let initialAnnouncements = [
    { id: 101, title: 'Exam Registration Opens', content: 'Register for your final exams by the end of the month via the academic tab.', date: '22-05-2025', important: true },
    { id: 102, title: 'Library Hours Extended', content: 'The main library will be open until midnight during the exam period, starting next week.', date: '20-05-2025', important: false },
    { id: 103, title: 'Upcoming Holiday', content: 'The university will observe a holiday on May 15th. All classes are canceled.', date: '15-05-2025', important: true },
];

let initialResults = [
    { id: 201, course: 'Calculus I', grade: 'A', semester: '2024-25-Spring', studentUid: 'student' },
    { id: 202, course: 'Intro to Programming', grade: 'A+', semester: '2023-24-Fall', studentUid: 'student' },
    { id: 203, course: 'Linear Algebra', grade: 'B-', semester: '2023-24-Fall', studentUid: 'student' },
    { id: 204, course: 'Intro to AI', grade: 'A', semester: '2024-25-Spring', studentUid: 'newstudent' },
    { id: 205, course: 'Data Science Basics', grade: 'B+', semester: '2024-25-Spring', studentUid: 'newstudent' },
];

let studentUsers = [
    {
        uid: 'student',
        password: 'pass',
        firstName: 'Tanay',
        lastName: 'Student',
        role: 'student'
    }
];

const adminUser = {
    uid: 'admin',
    password: 'pass',
    firstName: 'Portal',
    lastName: 'Admin',
    role: 'admin'
};

const AuthContext = React.createContext(null);
const DataContext = React.createContext(null);
const useAuthContext = () => useContext(AuthContext);
const useDataContext = () => useContext(DataContext);

const MessageModal = ({ isOpen, title, message, onClose, onConfirm, isConfirm = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 m-4 max-w-sm w-full transform transition-all">
                <h3 className={`text-xl font-bold mb-3 border-b pb-2 ${isConfirm ? 'text-red-600' : 'text-gray-900'}`}>{title}</h3>
                <p className="text-gray-700 mb-4">{message}</p>
                <div className="flex justify-end space-x-2">
                    {isConfirm && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                            Confirm
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        {isConfirm ? 'Cancel' : 'Close'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const fetchData = async (requestUrl, options = {}) => {
  const method = options.method ? options.method.toUpperCase() : 'GET';
  const uniqueId = Math.random().toString(36).substring(2, 8);
  const baseLatency = 450;
  const jitter = Math.floor(Math.random() * 150);
  const totalDelay = baseLatency + jitter;
  await new Promise(resolve => setTimeout(resolve, totalDelay));
  console.log(`[API_SIM_EXTENDED] Processing ${method} request for ${requestUrl} (Delay: ${totalDelay}ms, Ref: ${uniqueId})`);
  const simulatedStatus = 200;
  const simulatedSuccessBody = {
    status: 'success',
    operationTime: new Date().toISOString(),
    message: `Secure transaction simulated successfully for ${requestUrl} with reference ${uniqueId}.`,
  };
  return {
    ok: simulatedStatus >= 200 && simulatedStatus < 300,
    status: simulatedStatus,
    json: async () => (simulatedSuccessBody),
    headers: {
      'Content-Type': 'application/json',
      'X-Simulated-Reference': uniqueId
    },
    text: async () => JSON.stringify(simulatedSuccessBody),
  };
};
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
        
        await fetchData('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, password }),
        });

        let mockUser = null;
        if (uid === adminUser.uid && password === adminUser.password) {
            mockUser = adminUser;
        } else {
            mockUser = studentUsers.find(u => u.uid === uid && u.password === password);
        }

        if (mockUser) {
            setUser(mockUser);
            setIsAuthenticated(true);
            setLoading(false);
            return { success: true };
        } else {
            setLoading(false);
            return { success: false, message: 'Invalid UID or Password.' };
        }
    }, []);

    const register = useCallback(async (uid, password, firstName, lastName) => {
        setLoading(true);
        
        await fetchData('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, password, firstName, lastName }),
        });

        if (studentUsers.some(u => u.uid === uid) || uid === adminUser.uid) {
            setLoading(false);
            return { success: false, message: 'User ID already taken.' };
        }

        const newUser = { uid, password, firstName, lastName, role: 'student' };
        studentUsers.push(newUser);

        setUser(newUser);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true };
    }, []);

    const logout = useCallback(() => {
        fetchData('/api/auth/logout', { method: 'POST' });
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const updateProfile = useCallback(async (newDetails) => {
        if (user.role === 'admin') {
            return { success: false, message: 'Admin profile details cannot be changed.' };
        }

        await fetchData(`/api/students/${user.uid}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDetails),
        });

        const studentIndex = studentUsers.findIndex(u => u.uid === user.uid);
        if (studentIndex > -1) {
            studentUsers[studentIndex] = { ...studentUsers[studentIndex], ...newDetails };
        }
        
        setUser(prev => ({ ...prev, ...newDetails }));
        return { success: true };
    }, [user]);

    const changePassword = useCallback(async (oldPassword, newPassword) => {
        if (user.role === 'admin') {
            return { success: false, message: 'Admin password cannot be changed.' };
        }

        const student = studentUsers.find(u => u.uid === user.uid);

        if (oldPassword !== student.password) {
            return { success: false, message: 'Incorrect current password.' };
        }

        await fetchData(`/api/students/${user.uid}/password`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword, newPassword }),
        });

        student.password = newPassword;
        return { success: true, message: 'Password changed successfully.' };
    }, [user]);

    return { isAuthenticated, user, loading, login, logout, updateProfile, changePassword, register, studentUsers };
};

const usePortalData = () => {
    const [timetable, setTimetable] = useState(initialTimetable);
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [results, setResults] = useState(initialResults);

    const updateTimetable = useCallback((newSchedule) => setTimetable(newSchedule), []);
    const updateAnnouncements = useCallback((newAnnouncements) => setAnnouncements(newAnnouncements), []);
    const updateResults = useCallback((newResults) => setResults(newResults), []);

    useEffect(() => {
        fetchData('/api/data/student-dashboard', { method: 'GET' });
    }, []);


    return {
        timetable, setTimetable: updateTimetable,
        announcements, setAnnouncements: updateAnnouncements,
        results, setResults: updateResults,
    };
};

const AnnouncementsComponent = () => {
    const { user } = useAuthContext();
    const { announcements, setAnnouncements } = useDataContext();
    const isAdmin = user?.role === 'admin';
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState('');

    const handleEdit = (announcement) => {
        setEditId(announcement.id);
        setNewTitle(announcement.title);
        setNewContent(announcement.content);
        setIsEditing(true);
    };

    const handleNew = () => {
        setEditId(null);
        setNewTitle('');
        setNewContent('');
        setIsEditing(true);
    };

    const handleSave = async () => {
        setMessage('');
        if (!newTitle.trim() || !newContent.trim()) {
            setMessage('Title and content are required.');
            return;
        }

        if (editId) {
            await fetchData(`/api/announcements/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle, content: newContent }),
            });

            setAnnouncements(prev => prev.map(a => 
                a.id === editId ? { ...a, title: newTitle, content: newContent, date: new Date().toLocaleDateString('en-GB') } : a
            ));
            setMessage('Announcement updated!');
        } else {
            await fetchData('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle, content: newContent }),
            });

            const newId = Math.max(...announcements.map(a => a.id), 0) + 1;
            setAnnouncements(prev => [{
                id: newId,
                title: newTitle,
                content: newContent,
                date: new Date().toLocaleDateString('en-GB'),
                important: false
            }, ...prev]);
            setMessage('Announcement posted!');
        }
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            await fetchData(`/api/announcements/${id}`, { method: 'DELETE' });

            setAnnouncements(prev => prev.filter(a => a.id !== id));
            setMessage('Announcement deleted!');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (isEditing && isAdmin) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-600">
                <h3 className="text-xl font-bold mb-4 text-blue-800">{editId ? 'Edit Announcement' : 'New Announcement'}</h3>
                <input
                    type="text"
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-3 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                    placeholder="Content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows="4"
                    className="w-full p-2 border rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex justify-end space-x-3">
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save</button>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">Cancel</button>
                </div>
                {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-600 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">📢 Campus Announcements & Notices</h3>
                {isAdmin && (
                    <button onClick={handleNew} className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition shadow-md">
                        + New Notice
                    </button>
                )}
            </div>
            {message && <p className="mb-3 text-sm text-green-600 font-semibold">{message}</p>}

            <div className="space-y-4 overflow-y-auto max-h-96">
                {announcements.sort((a, b) => new Date(b.date.split('-').reverse().join('-')) - new Date(a.date.split('-').reverse().join('-'))).map(announcement => (
                    <div key={announcement.id} className={`p-4 rounded-lg border shadow-sm ${announcement.important ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex justify-between items-start">
                            <h4 className={`font-semibold ${announcement.important ? 'text-red-700' : 'text-gray-900'} text-lg`}>
                                {announcement.title} {announcement.important && <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full ml-2">URGENT</span>}
                            </h4>
                            <span className="text-xs text-gray-500">{announcement.date}</span>
                        </div>
                        <p className="text-gray-700 mt-1 text-sm">{announcement.content}</p>
                        {isAdmin && (
                            <div className="mt-3 flex space-x-2">
                                <button onClick={() => handleEdit(announcement)} className="text-sm text-indigo-600 hover:text-indigo-800">Edit</button>
                                <button onClick={() => handleDelete(announcement.id)} className="text-sm text-red-600 hover:text-red-800">Delete</button>
                            </div>
                        )}
                    </div>
                ))}
                {announcements.length === 0 && <p className="text-center text-gray-500">No announcements currently posted.</p>}
            </div>
        </div>
    );
};

const TimetableComponent = () => {
    const { user, studentUsers } = useAuthContext();
    const { timetable, setTimetable } = useDataContext();
    const isAdmin = user?.role === 'admin';
    const [isEditing, setIsEditing] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [message, setMessage] = useState('');
    const [filterSemester, setFilterSemester] = useState('2024-25-Spring');
    const [selectedStudentUid, setSelectedStudentUid] = useState(isAdmin ? (studentUsers[0]?.uid || '') : user.uid);

    useEffect(() => {
        if (isAdmin && !selectedStudentUid && studentUsers.length > 0) {
            setSelectedStudentUid(studentUsers[0].uid);
        } else if (!isAdmin && user) {
            setSelectedStudentUid(user.uid);
        }
    }, [isAdmin, user, studentUsers, selectedStudentUid]);


    const availableSemesters = [...new Set(timetable.map(t => t.semester)), '2024-25-Spring', '2024-25-Fall', '2023-24-Fall'];

    const daysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    
    const filteredSchedule = timetable
        .filter(item => item.semester === filterSemester && item.studentUid === selectedStudentUid)
        .sort((a, b) => daysOrder.indexOf(a.dayOfWeek.toUpperCase()) - daysOrder.indexOf(b.dayOfWeek.toUpperCase()) || a.startTime.localeCompare(b.startTime));

    const handleEdit = (item) => {
        setEditItem(item);
        setIsEditing(true);
    };

    const handleNew = () => {
        setEditItem({ id: null, dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:00', subject: '', room: '', classType: 'Lecture', semester: filterSemester, studentUid: selectedStudentUid });
        setIsEditing(true);
    };

    const handleSave = async (updatedItem) => {
        if (!updatedItem.subject || !updatedItem.room) {
            setMessage('Subject and Room are required.');
            return;
        }

        if (updatedItem.id) {
            await fetchData(`/api/timetable/${updatedItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem),
            });

            setTimetable(prev => prev.map(t => t.id === updatedItem.id ? updatedItem : t));
            setMessage('Timetable entry updated!');
        } else {
            await fetchData('/api/timetable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem),
            });

            const newId = Math.max(...timetable.map(t => t.id), 0) + 1;
            setTimetable(prev => [...prev, { ...updatedItem, id: newId }]);
            setMessage('New timetable entry added!');
        }
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this timetable entry?')) {
            await fetchData(`/api/timetable/${id}`, { method: 'DELETE' });
            
            setTimetable(prev => prev.filter(t => t.id !== id));
            setMessage('Timetable entry deleted!');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const TimetableForm = ({ item, onSave, onCancel }) => {
        const [formData, setFormData] = useState(item);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        return (
            <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-indigo-600">
                <h4 className="text-lg font-bold mb-4">{item.id ? 'Edit Class' : 'Add New Class'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {isAdmin && (
                         <select name="studentUid" value={formData.studentUid} onChange={handleChange} className="p-2 border rounded-lg">
                            <option value="">Select Student</option>
                            {studentUsers.map(s => <option key={s.uid} value={s.uid}>{s.firstName} {s.lastName} ({s.uid})</option>)}
                         </select>
                    )}
                    {['subject', 'room'].map(field => (
                        <input
                            key={field}
                            name={field}
                            type={'text'}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                            value={formData[field]}
                            onChange={handleChange}
                            className="p-2 border rounded-lg"
                            required
                        />
                    ))}
                    <input
                        name="startTime"
                        type='time'
                        placeholder='Start Time'
                        value={formData.startTime}
                        onChange={handleChange}
                        className="p-2 border rounded-lg"
                        required
                    />
                    <input
                        name="endTime"
                        type='time'
                        placeholder='End Time'
                        value={formData.endTime}
                        onChange={handleChange}
                        className="p-2 border rounded-lg"
                        required
                    />
                    <select name="semester" value={formData.semester} onChange={handleChange} className="p-2 border rounded-lg">
                        {[...new Set(availableSemesters)].map(sem => <option key={sem} value={sem}>{sem}</option>)}
                    </select>
                    <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} className="p-2 border rounded-lg">
                        {daysOrder.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                    <select name="classType" value={formData.classType} onChange={handleChange} className="p-2 border rounded-lg">
                        {['Lecture', 'Lab', 'Seminar', 'Tutorial'].map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                    <button onClick={() => onSave(formData)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Save</button>
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">Cancel</button>
                </div>
            </div>
        );
    };

    if (isEditing && isAdmin) {
        return <TimetableForm item={editItem} onSave={handleSave} onCancel={() => setIsEditing(false)} />;
    }

    const renderTimetableGrid = () => {
        if (!selectedStudentUid) {
            return <p className="text-center p-4 text-gray-600">Please select a student to view their timetable.</p>;
        }
        if (filteredSchedule.length === 0) return <p className="text-center p-4">No schedule found for {filterSemester} for selected student.</p>;

        const scheduleByDay = filteredSchedule.reduce((acc, item) => {
            const day = item.dayOfWeek.toUpperCase();
            if (!acc[day]) acc[day] = [];
            acc[day].push(item);
            return acc;
        }, {});

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-indigo-200 rounded-lg overflow-hidden">
                    <thead className="bg-indigo-50">
                        <tr>
                            {['Day', 'Time', 'Subject', 'Room', 'Type', isAdmin ? 'Actions' : ''].filter(h => h).map(header => (
                                <th key={header} className="px-3 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {daysOrder.map(day => (
                            scheduleByDay[day] ? (
                                scheduleByDay[day].map((item, index) => (
                                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}>
                                        <td className={`px-3 py-3 whitespace-nowrap font-bold text-sm ${index === 0 ? 'text-indigo-800' : 'text-transparent'}`}>
                                            {index === 0 ? day : '.'}
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{item.startTime} - {item.endTime}</td>
                                        <td className="px-3 py-3 text-sm text-gray-900">{item.subject}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">{item.room}</td>
                                        <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-blue-600">{item.classType}</td>
                                        {isAdmin && (
                                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-800">Edit</button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                            </td>
                                        )}
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
        <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-indigo-600 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">🗓️ Class Timetable</h3>
                {isAdmin && (
                    <button onClick={handleNew} className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition shadow-md">
                        + Add Class
                    </button>
                )}
            </div>
            {message && <p className="mb-3 text-sm text-green-600 font-semibold">{message}</p>}

            <div className="flex flex-wrap items-center gap-4 mb-4">
                <label htmlFor="semester-select" className="text-sm font-medium text-gray-700">Filter Semester:</label>
                <select
                    id="semester-select"
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value)}
                    className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {[...new Set(availableSemesters)].map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                    ))}
                </select>

                {isAdmin && (
                    <>
                        <label htmlFor="student-select" className="text-sm font-medium text-gray-700">Student:</label>
                        <select
                            id="student-select"
                            value={selectedStudentUid}
                            onChange={(e) => setSelectedStudentUid(e.target.value)}
                            className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {studentUsers.map(s => (
                                <option key={s.uid} value={s.uid}>{s.firstName} {s.lastName} ({s.uid})</option>
                            ))}
                        </select>
                    </>
                )}
            </div>
            {renderTimetableGrid()}
        </div>
    );
};

const ResultsComponent = () => {
    const { user, studentUsers } = useAuthContext();
    const { results, setResults } = useDataContext();
    const isAdmin = user?.role === 'admin';
    const [isEditing, setIsEditing] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [message, setMessage] = useState('');
    const [filterSemester, setFilterSemester] = useState('2024-25-Spring');
    const [selectedStudentUid, setSelectedStudentUid] = useState(isAdmin ? (studentUsers[0]?.uid || '') : user.uid);

    useEffect(() => {
        if (isAdmin && !selectedStudentUid && studentUsers.length > 0) {
            setSelectedStudentUid(studentUsers[0].uid);
        } else if (!isAdmin && user) {
            setSelectedStudentUid(user.uid);
        }
    }, [isAdmin, user, studentUsers, selectedStudentUid]);


    const availableSemesters = [...new Set(results.map(r => r.semester)), '2024-25-Spring', '2023-24-Fall'];

    const filteredResults = results
        .filter(item => item.semester === filterSemester && item.studentUid === selectedStudentUid)
        .sort((a, b) => a.course.localeCompare(b.course));

    const handleEdit = (item) => {
        setEditItem(item);
        setIsEditing(true);
    };

    const handleNew = () => {
        setEditItem({ id: null, course: '', grade: '', semester: filterSemester, studentUid: selectedStudentUid });
        setIsEditing(true);
    };

    const handleSave = async (updatedItem) => {
        if (!updatedItem.course || !updatedItem.grade) {
            setMessage('Course and Grade are required.');
            return;
        }

        if (updatedItem.id) {
            await fetchData(`/api/results/${updatedItem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem),
            });

            setResults(prev => prev.map(r => r.id === updatedItem.id ? updatedItem : r));
            setMessage('Result updated!');
        } else {
            await fetchData('/api/results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem),
            });

            const newId = Math.max(...results.map(r => r.id), 0) + 1;
            setResults(prev => [...prev, { ...updatedItem, id: newId }]);
            setMessage('New result added!');
        }
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this result?')) {
            await fetchData(`/api/results/${id}`, { method: 'DELETE' });

            setResults(prev => prev.filter(r => r.id !== id));
            setMessage('Result deleted!');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const ResultsForm = ({ item, onSave, onCancel }) => {
        const [formData, setFormData] = useState(item);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        return (
            <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-yellow-600">
                <h4 className="text-lg font-bold mb-4">{item.id ? 'Edit Result' : 'Add New Result'}</h4>
                <div className="space-y-3">
                    {isAdmin && (
                        <select name="studentUid" value={formData.studentUid} onChange={handleChange} className="w-full p-2 border rounded-lg">
                            <option value="">Select Student</option>
                            {studentUsers.map(s => <option key={s.uid} value={s.uid}>{s.firstName} {s.lastName} ({s.uid})</option>)}
                        </select>
                    )}
                    <input name="course" placeholder="Course Name (e.g., Physics II)" value={formData.course} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                    <input name="grade" placeholder="Grade (e.g., A+)" value={formData.grade} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                    <select name="semester" value={formData.semester} onChange={handleChange} className="w-full p-2 border rounded-lg">
                        {[...new Set(availableSemesters)].map(sem => <option key={sem} value={sem}>{sem}</option>)}
                    </select>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                    <button onClick={() => onSave(formData)} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">Save</button>
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">Cancel</button>
                </div>
            </div>
        );
    };

    if (isEditing && isAdmin) {
        return <ResultsForm item={editItem} onSave={handleSave} onCancel={() => setIsEditing(false)} />;
    }

    const renderResultsTable = () => {
        if (!selectedStudentUid) {
            return <p className="text-center p-4 text-gray-600">Please select a student to view their results.</p>;
        }
        if (filteredResults.length === 0) return <p className="text-center p-4">No results found for {filterSemester} for selected student.</p>;

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-yellow-200 rounded-lg overflow-hidden">
                    <thead className="bg-yellow-50">
                        <tr>
                            {['Course', 'Grade', isAdmin ? 'Actions' : ''].filter(h => h).map(header => (
                                <th key={header} className="px-3 py-3 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredResults.map((item, index) => (
                            <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-yellow-50'}>
                                <td className="px-3 py-3 text-sm font-medium text-gray-900">{item.course}</td>
                                <td className={`px-3 py-3 whitespace-nowrap text-sm font-semibold ${item.grade.includes('A') ? 'text-green-600' : 'text-orange-600'}`}>{item.grade}</td>
                                {isAdmin && (
                                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-800">Edit</button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-yellow-600 h-full flex flex-col">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">🏆 Academic Results</h3>
                {isAdmin && (
                    <button onClick={handleNew} className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition shadow-md">
                        + Add Result
                    </button>
                )}
            </div>
            {message && <p className="mb-3 text-sm text-green-600 font-semibold">{message}</p>}

            <div className="flex flex-wrap items-center gap-4 mb-4">
                <label htmlFor="results-semester-select" className="text-sm font-medium text-gray-700">Filter Semester:</label>
                <select
                    id="results-semester-select"
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value)}
                    className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
                >
                    {[...new Set(availableSemesters)].map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                    ))}
                </select>

                {isAdmin && (
                    <>
                        <label htmlFor="student-select-results" className="text-sm font-medium text-gray-700">Student:</label>
                        <select
                            id="student-select-results"
                            value={selectedStudentUid}
                            onChange={(e) => setSelectedStudentUid(e.target.value)}
                            className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
                        >
                            {studentUsers.map(s => (
                                <option key={s.uid} value={s.uid}>{s.firstName} {s.lastName} ({s.uid})</option>
                            ))}
                        </select>
                    </>
                )}
            </div>
            {renderResultsTable()}
        </div>
    );
};

const RegisterComponent = ({ switchToLogin }) => {
    const [uid, setUid] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuthContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!uid || !password || !firstName || !lastName) {
             setError('All fields are required.');
             setIsSubmitting(false);
             return;
        }

        if (password.length < 6) {
             setError('Password must be at least 6 characters long.');
             setIsSubmitting(false);
             return;
        }

        const result = await register(uid, password, firstName, lastName);

        if (!result.success) {
            setError(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="auth-container p-8 bg-white shadow-2xl rounded-2xl w-full max-w-sm mx-auto transform transition-all hover:shadow-green-300/50" style={{borderTop: '6px solid #10b981'}}>
            <h2 className="text-3xl font-extrabold mb-2 text-center text-green-700">Student Registration</h2>
            <p className="text-center text-sm mb-6 text-gray-500">Create your new academic portal account</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 transition"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 transition"
                />
                <input
                    type="text"
                    placeholder="Student ID (UID)"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 transition"
                />
                <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 transition"
                />
                {error && <p className="error-message text-red-500 text-sm font-medium">{error}</p>}
                <button type="submit" disabled={isSubmitting}
                    className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold text-lg hover:bg-green-700 transition duration-300 shadow-md hover:shadow-lg disabled:bg-green-300">
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>
            <div className="mt-4 text-center">
                <button onClick={switchToLogin} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    Already have an account? Log In
                </button>
            </div>
        </div>
    );
};

const LoginComponent = ({ switchToRegister }) => {
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
        <div className="auth-container p-8 bg-white shadow-2xl rounded-2xl w-full max-w-sm mx-auto transform transition-all hover:shadow-indigo-300/50" style={{borderTop: '6px solid #4f46e5'}}>
            <h2 className="text-3xl font-extrabold mb-2 text-center text-indigo-700">Student Academic Portal</h2>
            <p className="text-center text-sm mb-6 text-gray-500">Log in to your academic dashboard</p>
            <form onSubmit={handleSubmit} className="space-y-5">
                <input
                    type="text"
                    placeholder="UID / Student ID"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                {error && <p className="error-message text-red-500 text-sm font-medium">{error}</p>}
                <button type="submit" disabled={isSubmitting}
                    className="w-full bg-indigo-600 text-white p-3 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-lg disabled:bg-indigo-300">
                    {isSubmitting ? 'Verifying...' : 'Sign In'}
                </button>
            </form>
             <div className="mt-4 text-center">
                <button onClick={switchToRegister} className="text-sm text-green-600 hover:text-green-800 font-medium">
                    New Student? Register Here
                </button>
            </div>
        </div>
    );
};

const ProfileComponent = () => {
    const { user, updateProfile, changePassword } = useAuthContext();
    const [isEditing, setIsEditing] = useState(false);
    const [newFirstName, setNewFirstName] = useState(user.firstName);
    const [newLastName, setNewLastName] = useState(user.lastName);
    
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', isConfirm: false, onConfirm: null });
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    useEffect(() => {
        if (user) {
            setNewFirstName(user.firstName);
            setNewLastName(user.lastName);
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileMessage('');

        if (user.role === 'admin') {
            setProfileMessage('Admin profiles are locked.');
            return;
        }

        const result = await updateProfile({ firstName: newFirstName, lastName: newLastName });

        if (result.success) {
            setModal({
                isOpen: true,
                title: 'Success',
                message: 'Your profile details have been updated.',
                isConfirm: false,
                onClose: () => setModal({ ...modal, isOpen: false })
            });
            setIsEditing(false);
        } else {
            setProfileMessage(result.message);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage('');

        if (user.role === 'admin') {
            setPasswordMessage('Admin password cannot be changed.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage('New password and confirmation do not match.');
            return;
        }

        if (newPassword.length < 6) {
             setPasswordMessage('New password must be at least 6 characters long.');
            return;
        }

        const result = await changePassword(oldPassword, newPassword);

        if (result.success) {
            setModal({
                isOpen: true,
                title: 'Success',
                message: result.message,
                isConfirm: false,
                onClose: () => setModal({ ...modal, isOpen: false })
            });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setPasswordMessage(result.message);
        }
    };

    const UserDetails = (
        <div className="p-6 bg-white rounded-xl shadow-xl border-t-4 border-purple-600 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">👤 My Profile</h3>
            <div className="space-y-3">
                <p className="text-lg"><span className="font-semibold text-gray-600">Name:</span> {user.firstName} {user.lastName}</p>
                <p className="text-lg"><span className="font-semibold text-gray-600">Role:</span> <span className={`font-mono text-sm uppercase px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{user.role}</span></p>
                <p className="text-lg"><span className="font-semibold text-gray-600">Student ID / UID:</span> {user.uid}</p>
                
                {user.role === 'student' && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition shadow-md"
                    >
                        Edit Profile Details
                    </button>
                )}
            </div>
        </div>
    );

    const EditForm = (
        <div className="p-6 bg-white rounded-xl shadow-xl border-t-4 border-purple-600 mb-6">
            <h3 className="text-2xl font-bold text-purple-800 mb-4">Edit Details</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
                <input
                    type="text"
                    placeholder="First Name"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    required
                />
                {profileMessage && <p className="text-red-500 text-sm">{profileMessage}</p>}
                <div className="flex justify-end space-x-3">
                    <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Save Changes</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition">Cancel</button>
                </div>
            </form>
        </div>
    );

    const PasswordForm = (
        <div className="p-6 bg-white rounded-xl shadow-xl border-t-4 border-red-600">
            <h3 className="text-2xl font-bold text-red-800 mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                    type="password"
                    placeholder="Current Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
                    required
                />
                <input
                    type="password"
                    placeholder="New Password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
                    required
                />
                {passwordMessage && <p className="text-red-500 text-sm">{passwordMessage}</p>}
                <div className="flex justify-end">
                    <button type="submit" disabled={user.role === 'admin'} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-red-300">
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-1">{isEditing ? EditForm : UserDetails}</div>
                <div className="lg:col-span-1">{PasswordForm}</div>
            </div>
            <MessageModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={modal.onConfirm}
                isConfirm={modal.isConfirm}
            />
        </div>
    );
};

const DashboardMain = () => {
    const { user } = useAuthContext();
    const { announcements, timetable, results } = useDataContext();

    useEffect(() => {
        fetchData('/api/data/student-dashboard-widgets', { method: 'GET' });
    }, []);

    const latestAnnouncements = announcements
        .sort((a, b) => new Date(b.date.split('-').reverse().join('-')) - new Date(a.date.split('-').reverse().join('-')))
        .slice(0, 3);

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const todayClasses = timetable
        .filter(t => t.dayOfWeek.toUpperCase() === today && t.studentUid === user.uid)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const studentResults = results.filter(r => r.studentUid === user.uid);
    const gradePoints = { 'A+': 4.3, 'A': 4.0, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };
    const totalPoints = studentResults.reduce((sum, item) => sum + (gradePoints[item.grade] || 0), 0);
    const mockGPA = studentResults.length > 0 ? (totalPoints / studentResults.length).toFixed(2) : 'N/A';
    
    const stats = [
        { name: 'Total Courses Completed', value: studentResults.length, icon: '🎓', color: 'bg-green-100 text-green-700', borderColor: 'border-green-500' },
        { name: 'Current GPA', value: mockGPA, icon: '🌟', color: 'bg-yellow-100 text-yellow-700', borderColor: 'border-yellow-500' },
        { name: 'Active Courses', value: timetable.filter(t => t.studentUid === user.uid).length, icon: '📚', color: 'bg-indigo-100 text-indigo-700', borderColor: 'border-indigo-500' },
    ];


    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-800">Welcome back, {user.firstName}!</h2>

            {user.role === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map(stat => (
                        <div key={stat.name} className={`p-5 rounded-xl shadow-lg ${stat.color} border-l-4 ${stat.borderColor}`}>
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">{stat.icon}</span>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                                    <p className="text-3xl font-bold">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {user.role === 'student' && (
                    <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-indigo-600">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">⏰ Classes Today ({today})</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {todayClasses.length > 0 ? (
                                todayClasses.map(c => (
                                    <div key={c.id} className="p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                                        <p className="font-semibold text-indigo-800">{c.subject} ({c.classType})</p>
                                        <p className="text-sm text-gray-700">{c.startTime} - {c.endTime} in {c.room}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No scheduled classes for today. Enjoy your break!</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-blue-600">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📰 Latest Notices</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {latestAnnouncements.map(a => (
                            <div key={a.id} className={`p-3 rounded-lg border-l-4 ${a.important ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-400'}`}>
                                <p className={`font-semibold ${a.important ? 'text-red-700' : 'text-blue-700'}`}>{a.title}</p>
                                <p className="text-sm text-gray-700 truncate">{a.content}</p>
                                <span className="text-xs text-gray-500 block mt-1">{a.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const DashboardComponent = () => {
    const { logout, user } = useAuthContext();
    const [activeView, setActiveView] = useState('Dashboard');

    const navigation = [
        { name: 'Dashboard', icon: '🏠', component: DashboardMain, roles: ['student'] },
        { name: 'Timetable', icon: '🗓️', component: TimetableComponent, roles: ['student', 'admin'] },
        { name: 'Results', icon: '🏆', component: ResultsComponent, roles: ['student', 'admin'] },
        { name: 'Announcements', icon: '📢', component: AnnouncementsComponent, roles: ['student', 'admin'] },
        { name: 'Profile & Settings', icon: '⚙️', component: ProfileComponent, roles: ['student', 'admin'] },
    ];

    useEffect(() => {
        if (!navigation.find(nav => nav.name === activeView && nav.roles.includes(user.role))) {
            const defaultView = user.role === 'student' ? 'Dashboard' : 'Timetable';
            setActiveView(defaultView);
        }
    }, [user.role, activeView]);

    const CurrentComponent = navigation.find(nav => nav.name === activeView)?.component || DashboardMain;

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-indigo-700">Student Academic Portal</h1>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600 hidden md:block">
                            Welcome, {user.firstName} ({user.role === 'admin' ? 'Admin' : 'Student'})
                        </span>
                        <button 
                            onClick={logout}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg font-semibold hover:bg-red-600 transition shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <nav className="bg-white shadow-lg sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-4 overflow-x-auto py-2">
                        {navigation
                            .filter(nav => nav.roles.includes(user.role))
                            .map(item => (
                                <button
                                    key={item.name}
                                    onClick={() => setActiveView(item.name)}
                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap 
                                        ${activeView === item.name 
                                            ? 'bg-indigo-600 text-white shadow-md' 
                                            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'}`
                                    }
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.name}
                                </button>
                            ))
                        }
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-4 sm:p-0">
                    <CurrentComponent />
                </div>
            </main>
        </div>
    );
};

const App = () => {
    const auth = useAuth();
    const data = usePortalData();
    const { loading, isAuthenticated } = auth;
    const [isRegistering, setIsRegistering] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl font-semibold text-indigo-600">Loading Portal...</div>
            </div>
        );
    }

    const switchToRegister = () => setIsRegistering(true);
    const switchToLogin = () => setIsRegistering(false);

    return (
        <AuthContext.Provider value={auth}>
            <DataContext.Provider value={data}>
                <div id="portal-app">
                    {isAuthenticated ? (
                        <DashboardComponent />
                    ) : (
                        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
                            {isRegistering ? (
                                <RegisterComponent switchToLogin={switchToLogin} />
                            ) : (
                                <LoginComponent switchToRegister={switchToRegister} />
                            )}
                        </div>
                    )}
                </div>
            </DataContext.Provider>
        </AuthContext.Provider>
    );
};

export default App;