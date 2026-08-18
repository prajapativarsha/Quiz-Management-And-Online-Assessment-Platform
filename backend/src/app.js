const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes.js');
const adminRoutes = require('./routes/admin.routes.js');
const studentRoutes = require('./routes/student.routes.js');
const quizRoutes = require('./routes/quiz.routes.js')
const categoryRoutes = require('./routes/category.routes.js')
const questionRoutes = require('./routes/question.routes.js')
const attemptRoutes = require('./routes/attempt.routes.js');
const leaderboardRoutes = require('./routes/leaderboard.routes.js');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', questionRoutes);
app.use('/api', attemptRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', leaderboardRoutes);


app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;