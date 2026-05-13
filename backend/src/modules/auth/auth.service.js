//
const bcrypt = require('bcryptjs');//HASHES PASSWORD
const jwt = require('jsonwebtoken');
const authModel = require('./auth.model');
const broker = require('../../events/broker');


const register = async (name, email, password, role) => {

  // STEP 1: Check if email already exists
  const existingUser = await authModel.findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // STEP 2: Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // STEP 3: Save user to database
  const user = await authModel.createUser(
    name,
    email,
    hashedPassword,
    role
  );

  // STEP 4: Generate JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // STEP 5: Publish event to RabbitMQ
  await broker.publishEvent('user.registered', {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  // STEP 6: Return user and token
  return { user, token };
};

const login = async (email, password) => {

  // STEP 1: Find user by email
  const user = await authModel.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // STEP 2: Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // STEP 3: Generate JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // STEP 4: Return user and token
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

module.exports = { register, login };