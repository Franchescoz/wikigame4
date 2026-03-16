import { createBrowserClient } from '@supabase/ssr'

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const supabase = createBrowserClient(supabaseURL, supabaseKEY)