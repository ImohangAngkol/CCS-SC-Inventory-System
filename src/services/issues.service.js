import { supabase } from '../config/supabase.js'

export const IssuesService = {
  async report(userId, { itemId, description, severity }) {
    const { data, error } = await supabase
      .from('issues')
      .insert([{
        reporter_id: userId,
        item_id: itemId,
        description,
        severity,
        status: 'open',
        created_at: new Date().toISOString()
      }])
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data
  }
}
