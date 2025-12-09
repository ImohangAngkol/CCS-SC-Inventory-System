import { supabase } from '../config/supabase.js'
import { ItemsService } from './items.service.js'

export const TransactionsService = {
  async borrow(userId, { itemId, quantity }) {
    const { data: item } = await supabase.from('items').select('*').eq('id', itemId).single()
    if (!item) throw new Error('Item not found')
    if (item.available_quantity < quantity) throw new Error('Insufficient quantity')

    await ItemsService.updateQty(itemId, -quantity)
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        item_id: itemId,
        type: 'borrow',
        quantity,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async reserve(userId, { itemId, quantity, reservedDate }) {
    const { data: item } = await supabase.from('items').select('*').eq('id', itemId).single()
    if (!item) throw new Error('Item not found')

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        item_id: itemId,
        type: 'reserve',
        quantity,
        status: 'pending',
        reserved_date: reservedDate,
        created_at: new Date().toISOString()
      }])
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data
  }
}
