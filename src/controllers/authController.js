const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
};

exports.register = async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  try {
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already used" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.customer.create({
      data: { name, email, password: hashedPassword, address, phone },
    });

    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.customer.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
