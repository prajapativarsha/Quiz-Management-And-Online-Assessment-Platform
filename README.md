# Quiz Management & Online Assessment Platform
# Overview
The Quiz Management & Online Assessment Platform is a web-based application that allows students or users to participate in online quizzes and assessments. The platform is designed to provide a complete evaluation experience with automatic scoring, timed assessments, and comprehensive performance analytics.  

# User Roles & Features
The application is structured around two primary roles: 

## 🛠️ Admin Role
The Admin has complete control over the platform and manages the assessment content.
Quiz Management: Create, edit, publish, unpublish, and delete quizzes. 
Content Creation: Manage categories and build questions with multiple-choice options, correct answers, and explanations. 
User Management: Search registered students, view their quiz history, and activate/deactivate accounts.
Analytics Dashboard: View platform-wide statistics, including total attempts, average scores, and visual charts for pass/fail ratios.  

## 🎓 Student Role
Students can participate in available quizzes, track their learning, and compete on the leaderboard. 

Quiz Discovery: Browse, search, and filter available published quizzes by category or difficulty.  
Active Testing Interface: Navigate seamlessly between questions, monitor remaining time via a countdown timer, and automatically submit when time expires.  
Detailed Results: Receive immediate feedback showing correct/incorrect answers, earned points, and explanations for each question.  
Student Dashboard: Track historical performance, view average/highest scores, and review previous attempts.  
Leaderboard: View global and category-specific rankings based on highest score, average score, and quizzes completed.  

# Tech Stack
Frontend: React.js, Tailwind CSS, React Router, Axios, Recharts, and React Hook Form.  
Backend: Node.js and Express.js.  
Database: PostgreSQL integrated using the Prisma ORM.  
Security: Role-based authorization and JWT authentication.

# Application Architecture
The project follows a modern JavaScript architecture. 
The React frontend securely communicates via REST APIs with the Node/Express backend, which processes the core logic (such as timer validation and score calculation) to prevent frontend manipulation. All relational data is safely structured and queried within the PostgreSQL database.  