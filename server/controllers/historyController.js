import { supabase } from '../config/supabase.js';

export const fetchHistory = async (req, res, next) => {
  try {
    const uid   = req.user.id;
    const page  = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 8, 20);
    const start = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('analyses')
      .select(
        'id,manipulation_score,risk_level,overall_summary,detected_biases,word_count,dominant_technique,intent_assessment,created_at',
        { count: 'exact' }
      )
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .range(start, start + limit - 1);

    if (error) throw new Error(error.message);

    res.json({
      success: true,
      data,
      pagination: { total: count, page, pages: Math.ceil(count / limit) },
    });
  } catch (err) { next(err); }
};

export const fetchOne = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('analyses').select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data)
      return res.status(404).json({ success: false, message: 'Not found.' });

    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const removeOne = async (req, res, next) => {
  try {
    const { error } = await supabase.from('analyses')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw new Error(error.message);
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const fetchStats = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('manipulation_score,risk_level')
      .eq('user_id', req.user.id);

    if (error) throw new Error(error.message);

    const total    = data.length;
    const avg      = total ? Math.round(data.reduce((s, r) => s + r.manipulation_score, 0) / total) : 0;
    const highRisk = data.filter(r => r.manipulation_score >= 70).length;
    const critical = data.filter(r => r.risk_level === 'Critical').length;

    const distribution = ['Low', 'Moderate', 'High', 'Critical'].map(lvl => ({
      level: lvl,
      count: data.filter(r => r.risk_level === lvl).length,
    }));

    res.json({ success: true, data: { total, avg, highRisk, critical, distribution } });
  } catch (err) { next(err); }
};
