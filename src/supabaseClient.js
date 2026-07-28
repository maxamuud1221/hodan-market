import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://isbjdvstappgdbnxboin.supabase.co'
const supabaseKey = 'sb_publishable_jzUYPL6QhqKJs8iGX4oGzw_Q0YEj4Ya'

export const supabase = createClient(supabaseUrl, supabaseKey)
