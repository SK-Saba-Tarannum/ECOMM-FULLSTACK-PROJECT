import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    console.log('Register endpoint hit');  
    const { name, email, password, role = 'CUSTOMER' } = req.body; // default role

    console.log(name, email);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    });

    console.log(user);
    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    console.log("hitting login");
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};
