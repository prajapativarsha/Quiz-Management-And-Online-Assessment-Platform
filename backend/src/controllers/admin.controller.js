const prisma = require("../config/prisma");

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalStudents, totalAdmins, totalQuizzes, totalAttempts] =
      await Promise.all([
        prisma.users.count(),
        prisma.users.count({ where: { role: "STUDENT" } }),
        prisma.users.count({ where: { role: "ADMIN" } }),
        prisma.quizzes.count(),
        prisma.attempts.count(),
      ]);

    res.json({
      totalUsers,
      totalStudents,
      totalAdmins,
      totalQuizzes,
      totalAttempts,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = search
    ? { OR: [{ name: { contains: search, mode: "insensitive" } },
             { email: { contains: search, mode: "insensitive" } }] }
    : {};

  const [users, total] = await Promise.all([
    prisma.users.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, created_at: true },
      skip,
      take: Number(limit),
      orderBy: { created_at: "desc" },
    }),
    prisma.users.count({ where }),
  ]);

  res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
};

exports.getUserById = async (req, res) => {
  const user = await prisma.users.findUnique({
    where: { id: Number(req.params.id) },
    select: { id: true, name: true, email: true, role: true, created_at: true },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body; // validated by Zod middleware
  const updated = await prisma.users.update({
    where: { id: Number(req.params.id) },
    data: { role },
  });
  res.json({ message: "Role updated", user: updated });
};

exports.deleteUser = async (req, res) => {
  await prisma.users.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "User deleted" });
};

exports.getPlatformAnalytics = async (req, res) => {
  try {
    // 1. User Statistics
    const totalStudents = await prisma.users.count({
      where: { role: 'STUDENT' }
    });

    // 2. Quiz Statistics
    const totalQuizzes = await prisma.quizzes.count();
    const publishedQuizzes = await prisma.quizzes.count({
      where: { status: 'PUBLISHED' }
    });

    // 3. Attempt & Performance Statistics
    const attemptsAggregation = await prisma.attempts.aggregate({
      _count: { id: true },
      _avg: { percentage: true }
    });

    const totalAttempts = attemptsAggregation._count.id;
    const averageScore = attemptsAggregation._avg.percentage 
      ? parseFloat(attemptsAggregation._avg.percentage).toFixed(1) 
      : 0;

    // 4. Pass/Fail Ratio
    const passedAttempts = await prisma.attempts.count({
      where: { status: 'PASSED' }
    });
    const failedAttempts = await prisma.attempts.count({
      where: { status: 'FAILED' }
    });

    // Send the aggregated payload back to the frontend
    res.status(200).json({
      totalStudents,
      totalQuizzes,
      publishedQuizzes,
      totalAttempts,
      averageScore,
      passedAttempts,
      failedAttempts
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error while fetching analytics.' });
  }
};