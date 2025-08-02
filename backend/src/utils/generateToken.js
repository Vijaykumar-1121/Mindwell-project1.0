const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // Check if the JWT_SECRET is defined
  if (!process.env.JWT_SECRET) {
    console.error('Error: JWT_SECRET is not defined in environment variables.');
    throw new Error('JWT_SECRET is not configured.');
  }

  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Could not generate token.');
  }
};

module.exports = generateToken;