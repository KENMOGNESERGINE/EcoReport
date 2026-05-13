//Handles HTTP Requests 
const authService = require('./auth.service');
const register = async (req, res) => {
  try {

    // STEP 1: Get data from request body
    const { name, email, password, role } = req.body;

    // STEP 2: Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    // STEP 3: Call service
    const result = await authService.register(
      name,
      email,
      password,
      role || 'citizen'
    );

    // STEP 4: Send success response
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {

    // STEP 1: Get data from request body
    const { email, password } = req.body;

    // STEP 2: Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // STEP 3: Call service
    const result = await authService.login(
      email,
      password
    );

    // STEP 4: Send success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { register, login };