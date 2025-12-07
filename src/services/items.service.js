import { supabase } from '../config/supabase.js'

export const ItemsService = {
  async list() {
    const { data, error } = await supabase.from('items').select('*')
    if (error) throw new Error(error.message)
    return data
  },
  async create(payload) {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('items')
      .insert([{ ...payload, available_quantity: payload.total_quantity, created_at: now }])
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data
  },
  async remove(id) {
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },
  async updateQty(id, delta) {
    const { data: item, error: err1 } = await supabase.from('items').select('*').eq('id', id).single()
    if (err1 || !item) throw new Error('Item not found')
    const newAvail = Math.max(0, item.available_quantity + delta)
    const { error: err2 } = await supabase.from('items').update({ available_quantity: newAvail }).eq('id', id)
    if (err2) throw new Error(err2.message)
    return newAvail
  }
}
