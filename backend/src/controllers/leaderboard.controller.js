const prisma = require("../config/prisma.js")

const getLeaderboard = async (req, res) => {
  try {
    const { category } = req.query;

    // 1. Build the dynamic where clause
    const whereClause = {
      status: { not: 'IN_PROGRESS' },
      users: { role: 'STUDENT' } 
    };


    if (category) {
      whereClause.quizzes = {
        categories: {
          name: category,
        },
      };
    }

    // 2. Perform the Mathematical Aggregation
    const aggregations = await prisma.attempts.groupBy({
      by: ['user_id'],
      where: whereClause,
      _avg: { percentage: true },
      _max: { percentage: true },
      _count: { id: true },
    });

    if (aggregations.length === 0) {
      return res.status(200).json([]);
    }

    // 3. Fetch User Names
    const userIds = aggregations.map((agg) => agg.user_id);
    const users = await prisma.users.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });

    // 4. Map the Data and Sort
    let leaderboard = aggregations.map((agg) => {
      const user = users.find((u) => u.id === agg.user_id);
      return {
        studentName: user ? user.name : 'Unknown Student',
        averageScore: agg._avg.percentage ? parseFloat(agg._avg.percentage).toFixed(1) : 0,
        highestScore: agg._max.percentage ? parseFloat(agg._max.percentage).toFixed(1) : 0,
        quizzesCompleted: agg._count.id,
      };
    });

    // Sort the leaderboard: Primary sort by Highest Score, Secondary sort by Average Score
    leaderboard.sort((a, b) => {
      if (parseFloat(b.highestScore) !== parseFloat(a.highestScore)) {
        return parseFloat(b.highestScore) - parseFloat(a.highestScore);
      }
      return parseFloat(b.averageScore) - parseFloat(a.averageScore);
    });

    // 5. Assign the final Rank numbers
    leaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error generating leaderboard:', error);
    res.status(500).json({ message: 'Server error while generating leaderboard.' });
  }
};

module.exports = { getLeaderboard };