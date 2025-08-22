import { createClient } from '@supabase/supabase-js';

const supabaseURL = 'https://ocxghxvpoazkuyphtlkm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jeGdoeHZwb2F6a3V5cGh0bGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1ODQ0NjAsImV4cCI6MjA2NTE2MDQ2MH0.bz8VdaZzT2_XJVIZh91gOySncUJEoel8btAYjra-2OA';

export const supabase = createClient(supabaseURL, supabaseAnonKey);



