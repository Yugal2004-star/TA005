import { supabase } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'No token provided.' });

  const token = header.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user)
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });

  req.user = user;
  next();
};
