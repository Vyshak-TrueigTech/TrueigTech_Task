import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
      return res.status(403).json({ message: 'Token is required' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
          return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = user; // Attach user info to the request
      next();
  });
};

export default authenticateToken;
