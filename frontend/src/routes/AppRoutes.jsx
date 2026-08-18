import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

import Register from '../pages/auth/Register.jsx';
import Login from '../pages/auth/Login.jsx';

import AdminLayout from "../layouts/AdminLayout.jsx";
import Dashboard from "../pages/admin/Dashboard.jsx";
import UserManagement from "../pages/admin/UserManagement.jsx";
import AdminAnalytics from "../pages/admin/AdminAnalytics.jsx";

import QuizList from "../pages/admin/QuizList.jsx";
import QuizForm from "../pages/admin/QuizForm.jsx";
import QuizFormWrapper from "../pages/admin/QuizFormWrapper.jsx"

import CategoryManagement from "../pages/admin/CategoryManagement.jsx";
import CategoryForm from "../pages/admin/CategoryForm.jsx";
import CategoryFormWrapper from '../pages/admin/CategoryFormWrapper.jsx';

import QuestionManagement from "../pages/admin/QuestionManagement.jsx";

import QuizDetails from "../pages/student/QuizDetails.jsx";
import QuizDiscovery from "../pages/student/QuizDiscovery.jsx";
import ActiveQuiz from "../pages/student/ActiveQuiz.jsx";
import AttemptHistory from "../pages/student/AttemptHistory.jsx";
import ResultDetails from "../pages/student/ResultDetails.jsx";
import StudentDashboard from "../pages/student/StudentDashboard.jsx";
import StudentLayout from "../layouts/StudentLayout.jsx";

import Leaderboard from "../pages/student/Leaderboard.jsx"

const AppRoutes = () => {
  return (
    <Routes>
      {/**Public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />


      {/**Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminLayout />
        </ProtectedRoute>}
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="analytics" element = {<AdminAnalytics />}/>

        <Route path="quizzes" element={<QuizList />} />
        <Route path="quizzes/create" element={<QuizForm />} />
        <Route path="quizzes/edit/:id" element={<QuizFormWrapper />} /> 

        <Route path="categories" element = {<CategoryManagement/>}/>
         <Route path="categories/create" element = {<CategoryForm/>}/>
        <Route path="categories/edit/:id" element={<CategoryFormWrapper />} />

        <Route path="questions" element = {<QuestionManagement/>}/>
        <Route path="quizzes/:quizId/questions" element={<QuestionManagement />} />
       </Route>


        {/**Student routes */}
      <Route path="/student" element={ <ProtectedRoute allowedRoles={['STUDENT']}>
          <StudentLayout />
        </ProtectedRoute>}      
     >
     <Route path="quizzes/:id" element={<QuizDetails />} />
     <Route path="quizzes" element={<QuizDiscovery />} />
     <Route path="quizzes/:id/attempt/:attemptId" element={<ActiveQuiz />} />
     <Route path="history" element={<AttemptHistory />} />
     <Route path="results/:id" element={<ResultDetails />} />
     <Route path="dashboard" element={<StudentDashboard />} />
     </Route>

     <Route path="/leaderboard" element={<Leaderboard/> } />
     
    <Route path="/unauthorized" element={<h1>403 - Access Denied</h1>} />
    </Routes>

  );
};

export default AppRoutes;