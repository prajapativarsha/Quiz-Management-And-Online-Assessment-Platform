const bcrypt = require('bcrypt');
const prisma = require('../config/prisma.js');
const { registerSchema, loginSchema } = require('../validators/auth.validator.js');
const { generateToken } = require('../utils/jwt');


// REGISTER
const register = async (req, res) => {
  try {     
    const validatedData = registerSchema.parse(req.body); 
    const { name, email, password } = validatedData;
   
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        role: 'STUDENT', // Default role
      },
    });

   
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);

    // Option A: Send token in response body
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });


  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGOUT
const logout = async (req, res) => {
  return res.status(200).json({ message: 'Logout successful' });
};

module.exports = { register, login, logout };
