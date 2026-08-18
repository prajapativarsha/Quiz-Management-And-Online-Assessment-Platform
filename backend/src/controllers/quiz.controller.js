const prisma = require("../config/prisma.js");


// Create a New Quiz (Admin Only)
exports.createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      category_id,
      difficulty,
      duration_minutes,
      passing_score,
      max_attempts,
      thumbnail_url,
    } = req.body;

    
    const newQuiz = await prisma.quizzes.create({
      data: {
        title,
        description,
        category_id: Number(category_id),
        difficulty,
        duration_minutes: parseInt(duration_minutes),
        passing_score: parseInt(passing_score),
        max_attempts: parseInt(max_attempts) || 1,
        thumbnail_url,
        status: "DRAFT", // Default status as per blueprint
        created_by: req.user.id, 
      },
   
    });

    res
      .status(201)
      .json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};


// Get All Quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    // If the user is a student, only show PUBLISHED quizzes.
    // If Admin, show all.
    const isAdmin = req.user && req.user.role === "ADMIN";
    const filter = isAdmin ? {} : { status: "PUBLISHED" };

    const quizzes = await prisma.quizzes.findMany({
      where: filter,
      include: {
        categories: { select: { name: true } }, // Includes the category name
      },
      orderBy: { created_at: "desc" },
    });

    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};


//Single Quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quizzes.findUnique({
      where: { id: parseInt(id) },
      include: {
        categories: { select: { name: true } },
        questions: {
          include: { 
            options: true 
          }
        }
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};


// Update an Existing Quiz (Admin Only)
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    delete updateData.categories;
    delete updateData.questions; // Fixes the nested array error
    delete updateData.id;        // Removes the primary key from the update payload
    delete updateData.created_at; // Prevents the string-to-Date type error
    delete updateData.created_by; // (Optional) Usually we don't change the creator on update

    // Convert string IDs/numbers to integers if they exist in the payload
    if (updateData.category_id)
      updateData.category_id = parseInt(updateData.category_id);
    if (updateData.duration_minutes)
      updateData.duration_minutes = parseInt(updateData.duration_minutes);
    if (updateData.passing_score)
      updateData.passing_score = parseInt(updateData.passing_score);
    if (updateData.max_attempts)
      updateData.max_attempts = parseInt(updateData.max_attempts);

    const updatedQuiz = await prisma.quizzes.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        updated_at: new Date(),
      },
    });

    res
      .status(200)
      .json({ message: "Quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ error: "Failed to update quiz" });
  }
};


//Delete a Quiz (Admin Only)
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.quizzes.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
};


// Update Quiz Status (Publish/Unpublish)
exports.updateQuizStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expecting 'DRAFT', 'PUBLISHED', or 'UNPUBLISHED'

    const validStatuses = ["DRAFT", "PUBLISHED", "UNPUBLISHED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedQuiz = await prisma.quizzes.update({
      where: { id: parseInt(id) },
      data: {
        status,
        updated_at: new Date(),
      },
    });

    res
      .status(200)
      .json({ message: `Quiz status updated to ${status}`, quiz: updatedQuiz });
  } catch (error) {
    console.error("Error updating quiz status:", error);
    res.status(500).json({ error: "Failed to update quiz status" });
  }
};
