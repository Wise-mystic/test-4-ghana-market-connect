import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for a user
 * @param {Object} user - The user object
 * @returns {string} The generated JWT token
 */
export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role,
      phone: user.phone
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object} The decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
}; 