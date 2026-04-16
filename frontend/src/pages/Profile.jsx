import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; 
import { authService } from '../services/auth'; 
import { useAuth } from '../hooks/useAuth';
import ProfileForm from './Profile/ProfileForm';
import PlantInfoCard from './Profile/PlantInfoCard';
import AchievementList from './Profile/AchievementList';
import streakIcon from '../assets/profilIcon/Streak.svg';
import clockIcon from '../assets/profilIcon/clock.svg';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dummyData = {
    plantName: "Kangkung",
    plantSubtitle: "Tanaman dalam kebunku",
    plantDescription: "Kangkung adalah tanaman sayuran hijau yang tumbuh cepat dan banyak ditemukan di daerah berair.",
    achievements: [
      {
        id: 1,
        icon: streakIcon,
        title: 'Achievement Unlocked',
        description: '100 Days Streak of farming!',
        titleColor: '#EA7F1D',
      },
      {
        id: 2,
        icon: clockIcon,
        title: 'Achievement Unlocked',
        description: 'Always Watering On Time!',
        titleColor: '#2293FC',
      },
    ],
  };

  // State Data Form Profile
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '', 
  });

  const [userId, setUserId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Custom Notification & Modal States
  const [notif, setNotif] = useState({ show: false, message: '', type: '' });
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const showNotification = (message, type) => {
    setNotif({ show: true, message, type });
    setTimeout(() => {
      setNotif({ show: false, message: '', type: '' });
    }, 3500);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) return;

        setUserId(user.id);
        const profile = await authService.getProfile(user.id);

        setFormData({
          full_name: profile.full_name || '',
          email: user.email || '',
          password: '', 
        });
      } catch (error) {
        console.error('Gagal mengambil data profil:', error.message);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 5);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setNotif({ show: false, message: '', type: '' });

    try {
      if (!userId) return;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: formData.full_name })
        .eq('id', userId);

      if (profileError) throw profileError;

      showNotification('Profil berhasil diperbarui!', 'success');
    } catch (error) {
      showNotification('Gagal update profil: ' + error.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Trigger Logout Modal
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  // Eksekusi Logout
  const confirmLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch {
      showNotification('Gagal logout sistem!', 'error');
      setShowLogoutModal(false);
    }
  };

  return (
    <section className="relative flex h-screen flex-col overflow-hidden bg-[#9BC19B] font-sans">
      
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2C2C2C]/40 backdrop-blur-sm px-4 transition-opacity duration-300">
          <div className="bg-[#FFFAF9] border-[1.5px] sm:border-[2px] border-[#2C2C2C] rounded-[16px] p-6 w-full max-w-[340px] shadow-[4px_4px_0px_#2C2C2C] sm:shadow-[6px_6px_0px_#2C2C2C] transform transition-transform duration-300">
            
            <div className="mx-auto w-12 h-12 bg-[#FFF0F0] border-[1.5px] border-[#2C2C2C] rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>

            <h3 className="text-[#2C2C2C] text-[18px] sm:text-[20px] font-bold mb-2 text-center">
              Keluar Akun?
            </h3>
            <p className="text-[#2C2C2C] text-[13px] sm:text-[14px] text-center mb-6">
              Apakah kamu yakin ingin keluar dari akun ini? Kamu harus login kembali untuk masuk.
            </p>
            
            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 h-[40px] sm:h-[44px] bg-transparent border-[1.5px] border-[#2C2C2C] rounded-[10px] sm:rounded-[12px] text-[#2C2C2C] text-[13px] sm:text-[14px] font-medium hover:bg-[#EBEBEB] active:scale-95 transition-all duration-200"
              >
                Batal
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 h-[40px] sm:h-[44px] bg-[#EEDACF] border-[1.5px] border-[#2C2C2C] rounded-[10px] sm:rounded-[12px] text-[#2C2C2C] text-[13px] sm:text-[14px] font-medium hover:bg-[#e4ceb9] active:scale-95 transition-all duration-200"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {notif.show && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[340px] bg-[#FFFAF9] border-[2px] border-[#2C2C2C] rounded-[16px] p-4 shadow-[4px_4px_0px_#2C2C2C] sm:shadow-[6px_6px_0px_#2C2C2C] flex items-center gap-4 transition-all duration-300 animate-bounce`}>
          <div className={`w-10 h-10 rounded-full border-[1.5px] border-[#2C2C2C] flex items-center justify-center shrink-0 ${notif.type === 'error' ? 'bg-[#FFF0F0]' : 'bg-[#F0FFF4]'}`}>
            {notif.type === 'error' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B9567" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[#2C2C2C] font-bold text-[14px] sm:text-[15px]">
              {notif.type === 'error' ? 'Pemberitahuan' : 'Berhasil'}
            </span>
            <span className="text-[#2C2C2C] text-[12px] sm:text-[13px] leading-tight mt-0.5">
              {notif.message}
            </span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className={`shrink-0 z-20 px-4 pt-6 pb-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isScrolled ? 'shadow-md bg-[#9BC19B]/95 backdrop-blur-sm border-b border-white/10' : ''
      }`}>
        <div className="mx-auto w-full max-w-[980px]">
          <h1 className="text-[26px] font-bold text-[#FFFAF9] tracking-wide drop-shadow-sm">
            Profil
          </h1>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div 
        className="flex-1 overflow-y-auto px-4 pb-8 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        onScroll={handleScroll}
      >
        <div className="mx-auto flex h-full w-full max-w-[980px] flex-col gap-5 pt-1">
          
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
            
            {/* Card & Achievement */}
            <div className="flex flex-col gap-3.5">
              <PlantInfoCard 
                imageUrl={dummyData.plantImageUrl}
                plantName={dummyData.plantName}
                plantSubtitle={dummyData.plantSubtitle}
                plantDescription={dummyData.plantDescription}
              />
              <AchievementList achievements={dummyData.achievements} />
            </div>

            {/* Form */}
            <div className="min-h-[505px] w-full">
              <ProfileForm
                formData={formData}
                isUpdating={isUpdating}
                successMessage="" 
                onchange={handleChange}
                onUpdateProfile={handleUpdateProfile}
                onLogout={handleLogoutClick} 
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Profile;