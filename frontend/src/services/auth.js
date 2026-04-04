import { supabase } from '../lib/supabaseClient';

export const authService = {
  // 1. Fungsi Register
  register: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }, 
      },
    });
    if (error) throw error;
    return data;
  },

  // 2. Fungsi Login
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // 3. Fungsi Get Profile
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single(); 
      
    if (error) throw error;
    return data;
  },

  // 4. Fungsi Logout
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};