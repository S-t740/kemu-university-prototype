/**
 * Simple authentication middleware
 * Accepts either:
 * - x-demo-token: demo-token (for prototype)
 * - Authorization: Bearer <jwt-token> (for production)
 */
export const authenticate = async (req, res, next) => {
  const demoToken = req.headers['x-demo-token'];
  const authHeader = req.headers.authorization;

  // Check for demo token (prototype mode)
  if (demoToken === 'demo-token') {
    req.user = { role: 'admin' };
    return next();
  }

  // Check for JWT token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    // Check if it's the demo token sent via Authorization header
    if (token === 'demo-token') {
      req.user = { role: 'admin' };
      return next();
    }

    // Otherwise verify as JWT
    try {
      const jwt = (await import('jsonwebtoken')).default;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kemu-secret-key');
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  return res.status(401).json({ message: 'Authentication required' });
};

export default authenticate;

