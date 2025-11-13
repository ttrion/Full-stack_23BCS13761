IF OBJECT_ID('student_results', 'U') IS NOT NULL DROP TABLE student_results;
IF OBJECT_ID('timetables', 'U') IS NOT NULL DROP TABLE timetables;
IF OBJECT_ID('announcements', 'U') IS NOT NULL DROP TABLE announcements;
IF OBJECT_ID('student_profiles', 'U') IS NOT NULL DROP TABLE student_profiles;
IF OBJECT_ID('users', 'U') IS NOT NULL DROP TABLE users;

CREATE TABLE users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password NVARCHAR(MAX) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin')),
    created_at DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE student_profiles (
    profile_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id),
    full_name NVARCHAR(255) NOT NULL,
    enrollment_id VARCHAR(50) UNIQUE NOT NULL,
    email NVARCHAR(255) UNIQUE,
    gpa DECIMAL(3, 2) DEFAULT 0.00
);

CREATE TABLE announcements (
    item_id INT PRIMARY KEY IDENTITY(1,1),
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('announcement', 'notice')),
    title NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    published_date DATETIME2 DEFAULT GETDATE(),
    last_modified_by INT REFERENCES users(user_id)
);

CREATE TABLE timetables (
    schedule_id INT PRIMARY KEY IDENTITY(1,1),
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    subject NVARCHAR(100) NOT NULL,
    class_room VARCHAR(50),
    class_type VARCHAR(50) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    UNIQUE (day_of_week, start_time, subject, semester)
);

CREATE TABLE student_results (
    result_id INT PRIMARY KEY IDENTITY(1,1),
    student_id INT NOT NULL REFERENCES users(user_id),
    subject NVARCHAR(100) NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    grade VARCHAR(5),
    semester VARCHAR(50) NOT NULL,
    UNIQUE (student_id, subject, semester)
);

INSERT INTO users (username, hashed_password, role) VALUES
    ('admin_user', 'hashed_admin_password', 'admin'),
    ('student_user', 'hashed_student_password', 'student');

INSERT INTO student_profiles (user_id, full_name, enrollment_id, email, gpa) VALUES
    ((SELECT user_id FROM users WHERE username = 'student_user'), 'Jane Doe', 'S1001', 'jane.doe@portal.edu', 3.85);

INSERT INTO timetables (day_of_week, start_time, end_time, subject, class_room, class_type, semester) VALUES
    ('MONDAY', '09:00:00', '10:00:00', 'Calculus I', 'A101', 'Lecture', '2024-25-Spring'),
    ('MONDAY', '10:00:00', '12:00:00', 'Data Structures Lab', 'B205', 'Lab', '2024-25-Spring'),
    ('WEDNESDAY', '11:00:00', '12:00:00', 'Physics II', 'A101', 'Lecture', '2024-25-Spring'),
    ('THURSDAY', '14:00:00', '16:00:00', 'Software Engineering', 'C301', 'Seminar', '2024-25-Spring'),
    ('FRIDAY', '09:00:00', '10:00:00', 'Ethics in Tech', 'A202', 'Lecture', '2024-25-Spring');

INSERT INTO announcements (item_type, title, content) VALUES
    ('announcement', 'Mid-Term Exams', 'Mid-term exams start next week. Check syllabus on the portal homepage.'),
    ('notice', 'New Submission Policy', 'A formal notice regarding late submission penalties has been uploaded to the student handbook section.');

INSERT INTO student_results (student_id, subject, score, grade, semester) VALUES
    ((SELECT user_id FROM users WHERE username = 'student_user'), 'Calculus I', 92.5, 'A', '2024-25-Spring'),
    ((SELECT user_id FROM users WHERE username = 'student_user'), 'Physics II', 88.0, 'B+', '2024-25-Spring');