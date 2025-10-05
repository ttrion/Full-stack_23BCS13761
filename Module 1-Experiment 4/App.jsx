import React, { useState, useEffect, useCallback, useContext } from 'react';

const AuthContext = React.createContext(null);

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

            if (uid === 'admin' && password === 'pass') {
                const mockUser = {
                    id: uid, 
                    firstName: 'Admin', 
                    lastName: 'User', 
                    role: 'admin'
                };
                setUser(mockUser);
                setIsAuthenticated(true);
                return { success: true };
            } else if (uid === 'student' && password === 'pass') {
                const mockUser = {
                    id: uid, 
                    firstName: 'Tanay Manish', 
                    lastName: 'Nesari', 
                    role: 'student'
                };
                setUser(mockUser);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, message: 'Invalid credentials.' };
            }
        } catch (error) {
            return { success: false, message: 'Server error during login.' };
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
            
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Failed to change password.' };
        }
    }, []);

    return { isAuthenticated, user, loading, login, logout, updateProfile, changePassword };
};

const useAuthContext = () => useContext(AuthContext);

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
        <div className="auth-container">
            <h2>Portal Login</h2>
            <p>Try 'admin/pass' or 'student/pass'</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="UID"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging In...' : 'Login'}
                </button>
                <p className="forgot-password">
                    <a href="#reset">Forgot Password?</a> 
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
            setPasswordMessage('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setPasswordMessage(result.message);
        }
        setIsChangingPass(false);
    };

    if (!user) return <p>User data not available.</p>;

    return (
        <div className="profile-container">
            <button onClick={() => toggleView('dashboard')} className="back-button">← Back to Dashboard</button>
            <h2>User Profile</h2>
            
            <div className="profile-info">
                <p><strong>UID:</strong> {user.id}</p>
                <p><strong>Role:</strong> {user.role.toUpperCase()}</p>
                
                {isEditing ? (
                    <div>
                        <label>First Name:</label>
                        <input value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} />
                        <label>Last Name:</label>
                        <input value={newLastName} onChange={(e) => setNewLastName(e.target.value)} />
                        <button onClick={handleUpdate} disabled={isUpdating}>
                            {isUpdating ? 'Saving...' : 'Save Details'}
                        </button>
                        <button onClick={() => setIsEditing(false)} disabled={isUpdating}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                        <button onClick={() => setIsEditing(true)}>Edit Details</button>
                    </div>
                )}
                {profileMessage && <p className="message">{profileMessage}</p>}
            </div>

            <div className="password-change">
                <h3>Change Password</h3>
                <form onSubmit={handleChangePassword}>
                    <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                    <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    {passwordMessage && <p className="message">{passwordMessage}</p>}
                    <button type="submit" disabled={isChangingPass}>
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
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Welcome back, {userName}! 👋</h2>
                <div className="user-actions">
                    <button onClick={() => toggleView('profile')} className="profile-link">
                        My Profile
                    </button>
                    <button onClick={logout} className="logout-button">
                        Logout
                    </button>
                </div>
            </header>

            <div className="module-grid">
                
                <div className="module-card results-module">
                    <h3>🏆 Results Management</h3>
                    <p>Access your semester-wise results and academic performance records here.</p>
                    <button onClick={() => alert('Module 2 coming soon!')}>View Results</button>
                </div>

                <div className="module-card announcements-module">
                    <h3>📢 Announcements & Notices</h3>
                    <p>View institution-wide academic updates and urgent feeds.</p>
                    <p className="placeholder-text">Notices Feed will appear here.</p>
                </div>

                <div className="module-card timetable-module">
                    <h3>📅 Timetable & Scheduling</h3>
                    <p>Display of structured class and exam schedules.</p>
                    <p className="placeholder-text">Class/Exam Timetable will load here.</p>
                </div>

                {user?.role === 'admin' && (
                    <div className="module-card admin-module special-access">
                        <h3>🔑 Administration Panel (Module 5)</h3>
                        <p>Elevated access for results upload/edit and timetable management.</p>
                        <button onClick={() => alert('Module 5 - Admin tools coming soon!')}>Go to Admin</button>
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
        return <div className="loading-screen">Loading authentication status...</div>;
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
        <div className="module-1-app">
            <header>
                <h1>Student Academic Portal</h1>
            </header>
            <main>
                {mainContent}
            </main>
        </div>
    );
};

export default () => (
    <AuthContext.Provider value={useAuth()}>
        <Module1AuthAndProfile />
    </AuthContext.Provider>
);