import { supabase } from '../config/supabase.js'

export const UsersService = {
  async list() {
    const { data, error } = await supabase.from('users').select('id,email,full_name,role')
    if (error) throw new Error(error.message)
    return data
  },
  async create({ email, full_name, role, password_hash }) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, full_name, role, password_hash }])
      .select('id,email,full_name,role')
    if (error) throw new Error(error.message)
    return data
  },
  async setRole(id, role) {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select('id,email,full_name,role')
      .single()
    if (error) throw new Error(error.message)
    return data
  }
}
