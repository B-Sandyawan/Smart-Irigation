import React, { useState } from 'react';
import ProfileForm from './Profile/ProfileForm';

import PlantInfoCard from './Profile/PlantInfoCard';
import AchievementList from './Profile/AchievementList';
import streakIcon from '../assets/profilIcon/Streak.svg';
import clockIcon from '../assets/profilIcon/clock.svg';


const Profile = () => {
  
  const dummyData = {
   
    plantImageUrl: "/src/assets/kankung.png",
    
    
    namaLengkap: "Siaramyuk",
    email: "siramyuk@gmail.com",
    password: "yuksiram!",
    
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

  
  const [formData, setFormData] = useState({
    full_name: dummyData.namaLengkap,
    email: dummyData.email,
    password: dummyData.password,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  
  const [isScrolled, setIsScrolled] = useState(false);

  
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

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMessage('');

   
    setTimeout(() => {
      setIsUpdating(false);
      setSuccessMessage('Profil berhasil diperbarui!');
      console.log('Updated profile data:', formData);

   
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    const confirmed = window.confirm('Apakah Anda yakin ingin logout?');
    
    if (confirmed) {
      console.log('User logout:', new Date().toISOString());
      alert('Logout berhasil!');
      
    }
  };

  
  return (
    
    <section className="flex h-screen flex-col overflow-hidden bg-[#9BC19B] font-sans">
      
      
      <div className={`shrink-0 z-20 px-3 pt-6 pb-3 sm:px-5 lg:px-6 transition-all duration-300 ${
        isScrolled ? 'shadow-md bg-[#9BC19B]/95 backdrop-blur-sm border-b border-white/10' : ''
      }`}>
       
        <div className="mx-auto w-full max-w-[1020px]">
          <h1 className="text-[42px] font-bold text-white tracking-tight leading-none sm:text-[42px]">
            Profil
          </h1>
        </div>
      </div>

      
      <div 
        className="flex-1 overflow-y-auto px-3 pb-8 sm:px-5 lg:px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        onScroll={handleScroll}
      >
        <div className="mx-auto flex h-full w-full max-w-[1020px] flex-col gap-5 pt-1">
          
          
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
            
            
            <div className="flex flex-col gap-3.5">
              <PlantInfoCard 
                imageUrl={dummyData.plantImageUrl}
                plantName={dummyData.plantName}
                plantSubtitle={dummyData.plantSubtitle}
                plantDescription={dummyData.plantDescription}
              />
              <AchievementList achievements={dummyData.achievements} />
            </div>

            
            <div className="min-h-[505px]">
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