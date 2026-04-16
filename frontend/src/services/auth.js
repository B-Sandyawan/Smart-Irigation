import { supabase } from '../lib/supabaseClient';

const AUTH_ERROR_MESSAGES = {
  'Invalid login credentials': 'Email atau kata sandi salah.',
  'Email not confirmed': 'Email belum diverifikasi. Silakan cek inbox Anda.',
  'User already registered': 'Email sudah terdaftar. Silakan login.',
};

const formatAuthError = (error) => {
  const message = error?.message || 'Terjadi kesalahan pada sistem.';
  return AUTH_ERROR_MESSAGES[message] || message;
};

export const authService = {
  formatAuthError,

  // Register user baru.
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

  // Login menggunakan email + password.
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Ambil profil user yang sedang aktif.
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single(); 
      
    if (error) throw error;
    return data;
  },

  // Logout user saat ini.
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};