import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; 
import { authService } from '../services/auth'; 
import ProfileForm from './Profile/ProfileForm';
import PlantInfoCard from './Profile/PlantInfoCard';
import AchievementList from './Profile/AchievementList';

const Profile = () => {
  const navigate = useNavigate();

  
  const dummyData = {
    plantImageUrl: "/src/assets/kangkung.png", 
    plantName: "Kangkung",
    plantSubtitle: "Tanaman dalam kebunku",
    plantDescription: "Kangkung adalah tanaman sayuran hijau yang tumbuh cepat dan banyak ditemukan di daerah berair.",
    achievements: [
      {
        id: 1, icon: '🔥', title: 'Achievement Unlocked', description: '100 Days Streak of farming!',
        titleColor: '#FF9500', borderColor: '#FF9500',
      },
      {
        id: 2, icon: '🕐', title: 'Achievement Unlocked', description: 'Always Watering On Time!',
        titleColor: '#0095FF', borderColor: '#0095FF',
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
  const [successMessage, setSuccessMessage] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Ambil data profil dari Supabase saat komponen di-load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          // Ambil dari authService (tabel profiles)
          const profile = await authService.getProfile(user.id);
          
          setFormData({
            full_name: profile.full_name || '',
            email: user.email,
            password: '', // Kosongkan demi keamanan, ubah jika ada fitur update password spesifik
          });
        } else {
          navigate('/login'); // Lempar ke login jika tidak ada session
        }
      } catch (error) {
        console.error('Gagal mengambil data profil:', error.message);
      }
    };

    fetchUserProfile();
  }, [navigate]);

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

  // Update profil ke Supabase
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMessage('');

    try {
      if (!userId) return;

      // Update data di tabel profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: formData.full_name })
        .eq('id', userId);

      if (profileError) throw profileError;

      setSuccessMessage('Profil berhasil diperbarui!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saat update profil:', error.message);
      alert('Gagal update profil: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm('Apakah Anda yakin ingin logout?');
    
    if (confirmed) {
      try {
        await authService.logout();
        navigate('/login');
      } catch (error) {
        console.error('Error logout:', error.message);
        alert('Gagal logout!');
      }
    }
  };

  return (
    <section className="flex h-screen flex-col bg-[#9BC19B] overflow-hidden font-sans">
      
      <div className={`shrink-0 z-20 px-4 pt-6 pb-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isScrolled ? 'shadow-md bg-[#9BC19B]/95 backdrop-blur-sm border-b border-white/10' : ''
      }`}>
        <div className="mx-auto w-full max-w-[980px]">
          <h1 className="text-[26px] font-bold text-white tracking-wide drop-shadow-sm">
            Profil
          </h1>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto px-4 pb-12 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        onScroll={handleScroll}
      >
        <div className="mx-auto flex h-full w-full max-w-[980px] flex-col pt-2 gap-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
            
            <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
              <PlantInfoCard 
                imageUrl={dummyData.plantImageUrl}
                plantName={dummyData.plantName}
                plantSubtitle={dummyData.plantSubtitle}
                plantDescription={dummyData.plantDescription}
              />
              <AchievementList achievements={dummyData.achievements} />
            </div>

            <div className="col-span-12 md:col-span-8">
              <ProfileForm
                formData={formData}
                isUpdating={isUpdating}
                successMessage={successMessage}
                onchange={handleChange}
                onUpdateProfile={handleUpdateProfile}
                onLogout={handleLogout}
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Profile;