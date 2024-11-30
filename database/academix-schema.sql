DROP SCHEMA IF EXISTS academix;
CREATE SCHEMA academix;
USE academix;

CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL
);

CREATE TABLE Student (
    student_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    roll_no VARCHAR(50) UNIQUE NOT NULL,
    semester INT NOT NULL,
    academic_year DATE NOT NULL,
    current_status ENUM('Active', 'Inactive', 'Graduated', 'Suspended') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Teacher (
    teacher_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Admin (
    admin_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) UNIQUE NOT NULL,
    credit_hours INT NOT NULL,
    announcements TEXT,
    content TEXT,
    description VARCHAR(255)
);

CREATE TABLE Teacher_Courses (
    course_id INT NOT NULL,
    teacher_id INT NOT NULL,
    PRIMARY KEY (course_id, teacher_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Enrollment (
    course_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('Enrolled', 'Completed', 'Withdrawn', 'Failed', 'Incomplete') NOT NULL DEFAULT 'Enrolled',
    grade ENUM('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C', 'D', 'F') DEFAULT NULL,
    PRIMARY KEY (course_id, student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Assignment (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    due_date DATE NOT NULL,
    assign_date DATE NOT NULL,
    file_url VARCHAR(255),
    file_type VARCHAR(50),
    file_phys LONGBLOB,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Submission (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    description VARCHAR(255),
    submitted_at DATE,
    status ENUM('Submitted', 'Late', 'Not Submitted') NOT NULL,
    plagiarism_score DECIMAL(5, 2) DEFAULT 0.00,
    file_url VARCHAR(255),
    file_type VARCHAR(50),
    file_phys LONGBLOB,
    FOREIGN KEY (assignment_id) REFERENCES Assignment(assignment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- have to add url of the moss report
CREATE TABLE MOSS (
    evaluation_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    assignment_id INT NOT NULL,
    checked_at DATE,
    isChecked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES Assignment(assignment_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Grades (
    grade_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    teacher_id INT NOT NULL,
    score DECIMAL(5, 2) NOT NULL,
    feedback VARCHAR(255),
    graded_at DATE NOT NULL,
    FOREIGN KEY (submission_id) REFERENCES Submission(submission_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Chat (
    chat_id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    sender_id INT NOT NULL,
    message VARCHAR(500) NOT NULL,
    sent_at DATETIME,
    video_call_url VARCHAR(255),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- UPDATES IN DATABASE SCHEMA
-- dropping tables, toDOlist, attendance and department
-- fixing chat table by removing an extra (student_id) attribute
-- removed department table, updated tables student(major removed), teacher(department reoved), courses(department removed)
-- changes in submission, assignment, moss(added isChecked boolean) tables
-- ik you said to document all changes in detail but (; dont kill me


-- DROP SCHEMA IF EXISTS academix;
-- CREATE SCHEMA academix;
-- USE academix;

-- CREATE TABLE User (
--     user_id INT PRIMARY KEY AUTO_INCREMENT,
--     username VARCHAR(50) UNIQUE NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL,
--     password VARCHAR(100) NOT NULL,
--     role ENUM('student', 'teacher', 'admin') NOT NULL
-- );

-- CREATE TABLE Department (
--     department_id INT PRIMARY KEY AUTO_INCREMENT,
--     name VARCHAR(100) UNIQUE NOT NULL,
--     department_head INT,
--     FOREIGN KEY (department_head) REFERENCES User(user_id) ON DELETE SET NULL ON UPDATE CASCADE
-- );

-- CREATE TABLE Student (
--     student_id INT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     dob DATE NOT NULL,
--     roll_no VARCHAR(50) UNIQUE NOT NULL,
--     semester INT NOT NULL,
--     major INT NOT NULL,
--     academic_year DATE NOT NULL,
--     current_status ENUM('Active', 'Inactive', 'Graduated', 'Suspended') NOT NULL,
--     FOREIGN KEY (student_id) REFERENCES User(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--     FOREIGN KEY (major) REFERENCES Department(department_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );

-- CREATE TABLE Teacher (
--     teacher_id INT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     department_id INT NOT NULL,
--     FOREIGN KEY (teacher_id) REFERENCES User(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--     FOREIGN KEY (department_id) REFERENCES Department(department_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );

-- CREATE TABLE Admin (
--     admin_id INT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     role VARCHAR(50) NOT NULL,
--     FOREIGN KEY (admin_id) REFERENCES User(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );

-- CREATE TABLE Courses (
--     course_id INT PRIMARY KEY AUTO_INCREMENT,
--     course_name VARCHAR(100) UNIQUE NOT NULL,
--     credit_hours INT NOT NULL,
--     department_id INT,
--     FOREIGN KEY (department_id) REFERENCES Department(department_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );

-- CREATE TABLE Teacher_Courses (
--     course_id INT NOT NULL,
--     teacher_id INT NOT NULL,
--     PRIMARY KEY (course_id, teacher_id),
--     FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--     FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );

-- CREATE TABLE Enrollment (
--     course_id INT NOT NULL,
--     student_id INT NOT NULL,
--     status ENUM('Enrolled', 'Completed', 'Withdrawn', 'Failed', 'Incomplete') NOT NULL DEFAULT 'Enrolled',
--     grade ENUM('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C', 'D', 'F') DEFAULT NULL,
--     PRIMARY KEY (course_id, student_id),
--     FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--     FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );

-- CREATE TABLE Attendance (
--     attendance_id INT PRIMARY KEY AUTO_INCREMENT,
--     course_id INT NOT NULL,
--     student_id INT NOT NULL,
--     day DATE NOT NULL,
--     status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL,
--     FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--     FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );

-- CREATE TABLE Assignment (
--     assignment_id INT PRIMARY KEY AUTO_INCREMENT,
--     course_id INT NOT NULL,
--     title VARCHAR(100) NOT NULL,
--     description VARCHAR(255),
--     due_date DATE NOT NULL,
--     assign_date DATE NOT NULL,
--     FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );

-- CREATE TABLE Submission (
--     submission_id INT PRIMARY KEY AUTO_INCREMENT,
--     assignment_id INT NOT NULL,
--     student_id INT NOT NULL,
--     submitted_at DATE,
--     file_url VARCHAR(255),
--     plagiarism_score DECIMAL(5, 2) DEFAULT 0.00,
--     status ENUM('Submitted', 'Late', 'Not Submitted') NOT NULL,
--     FOREIGN KEY (assignment_id) REFERENCES Assignment(assignment_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--     FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );

-- -- have to add url of the moss report
-- CREATE TABLE MOSS (
--     evaluation_id INT PRIMARY KEY AUTO_INCREMENT,
--     course_id INT NOT NULL,
--     assignment_id INT NOT NULL,
--     checked_at DATE,
--     FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--     FOREIGN KEY (assignment_id) REFERENCES Assignment(assignment_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );

-- CREATE TABLE Grades (
--     grade_id INT PRIMARY KEY AUTO_INCREMENT,
--     submission_id INT NOT NULL,
--     teacher_id INT NOT NULL,
--     score DECIMAL(5, 2) NOT NULL,
--     feedback VARCHAR(255),
--     graded_at DATE NOT NULL,
--     FOREIGN KEY (submission_id) REFERENCES Submission(submission_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--     FOREIGN KEY (teacher_id) REFERENCES Teacher(teacher_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );

-- CREATE TABLE ToDo_List (
--     todo_id INT PRIMARY KEY AUTO_INCREMENT,
--     course_id INT,
--     student_id INT NOT NULL,
--     assignment_id INT,
--     FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--     FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--     FOREIGN KEY (assignment_id) REFERENCES Assignment(assignment_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );

-- CREATE TABLE Chat (
--     chat_id INT PRIMARY KEY AUTO_INCREMENT,
--     course_id INT NOT NULL,
--     sender_id INT NOT NULL,
--     student_id INT NOT NULL,
--     message VARCHAR(500) NOT NULL,
--     sent_at_day DATE NOT NULL,
--     sent_at_time TIME NOT NULL,
--     video_call_url VARCHAR(255),
--     FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--     FOREIGN KEY (sender_id) REFERENCES User(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
--     FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE RESTRICT ON UPDATE CASCADE
-- );
