const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

const isStudent = (req, res, next) => {
  if (req.user?.role !== 'STUDENT') {
    return res.status(403).json({ message: 'Access denied: Students only' });
  }
  next();
};

module.exports = { isAdmin, isStudent };
