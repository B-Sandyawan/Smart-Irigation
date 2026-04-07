import React, { useState } from 'react';
import ProfileForm from './Profile/ProfileForm';
import StreakVisualization from './Profile/StreakVisualization';
import PlantInfoCard from './Profile/PlantInfoCard';
import AchievementList from './Profile/AchievementList';

/**
 * Profile Page Component
 * 
 * Halaman untuk menampilkan dan mengedit profil pengguna
 * Layout: Two-column dengan:
 * - Kiri: Visualisasi tanaman kangkung + Streak chart (1/3 width)
 * - Kanan: Form profil pengguna (2/3 width)
 * 
 * Spesifikasi Visual Update (Figma Revision):
 * - Background Halaman: Hijau (#9BC19B)
 * - Form Container: Krem (#FFEDD9)
 * - Input Fields: Krem (#FFEDD9)
 * - Button Simpan: Hijau (#9BC19B)
 * - Button Logout: Terracotta Krem (#DF9F88)
 * - Judul Halaman: Krem Putih (#FEF9F3)
 * 
 * Components:
 * - ProfileForm: Sub-component untuk form
 * - StreakVisualization: Sub-component untuk area kiri (kangkung + streak)
 */
const Profile = () => {
  // ============================================================
  // DUMMY DATA - COMPLETE
  // ============================================================
  const dummyData = {
    // ↓↓↓ MASUKKAN LINK GAMBAR KANGKUNG KAMU DI ANTARA TANDA KUTIP DI BAWAH INI ↓↓↓
    plantImageUrl: "/src/assets/Group 303.png",
    // ↑↑↑ ================================================================= ↑↑↑
    
    namaLengkap: "Siaramyukk",
    email: "siramyuk@gmail.com",
    password: "••••••••",
    
    plantName: "Kangkung",
    plantSubtitle: "Tanaman dalam kebunku",
    plantDescription: "Kangkung adalah tanaman sayuran hijau yang tumbuh cepat dan banyak ditemukan di daerah berair.",
    
    achievements: [
      {
        id: 1,
        icon: '🔥',
        title: 'Achievement Unlocked',
        description: '100 Days Streak of farming!',
        titleColor: '#FF9500',
        borderColor: '#FF9500',
      },
      {
        id: 2,
        icon: '🕐',
        title: 'Achievement Unlocked',
        description: 'Always Watering On Time!',
        titleColor: '#0095FF',
        borderColor: '#0095FF',
      },
    ],
  };

  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const [formData, setFormData] = useState({
    full_name: dummyData.namaLengkap,
    email: dummyData.email,
    password: dummyData.password,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  
  /**
   * Handle input field changes
   * Maintain controlled component state
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle profile update submission
   * Ready untuk integrasi backend/Supabase
   */
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMessage('');

    // Simulasi API call (1 detik)
    setTimeout(() => {
      setIsUpdating(false);
      setSuccessMessage('Profil berhasil diperbarui!');
      console.log('Updated profile data:', formData);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
  };

  /**
   * Handle logout action
   * Ready untuk integrasi backend/Supabase
   */
  const handleLogout = (e) => {
    e.preventDefault();
    const confirmed = window.confirm('Apakah Anda yakin ingin logout?');
    
    if (confirmed) {
      console.log('User logout:', new Date().toISOString());
      alert('Logout berhasil!');
      // TODO: Integrasi dengan auth.signOut() dan redirect ke login
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="w-full min-h-screen bg-[#9BC19B] pt-3 pb-3 px-6 lg:px-8 font-['Montserrat']">
      
      {/* ============================================================
          HEADER SECTION
          ============================================================ */}
      <div className="mb-2">
        <h1 className="text-[#FEF9F3] text-[36px] font-['Montserrat'] font-bold leading-[1.2] tracking-tight">
          Profil
        </h1>
      </div>

      {/* ============================================================
          MAIN CONTENT - TWO COLUMN LAYOUT (ASYMMETRIC GRID)
          ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-7xl items-stretch">
        
        {/* ============================================================
            LEFT COLUMN (1/3) - PLANT INFO + ACHIEVEMENTS
            ============================================================ */}
        <div className="col-span-12 md:col-span-4 max-w-sm flex flex-col gap-3">
          <PlantInfoCard 
            imageUrl={dummyData.plantImageUrl}
            plantName={dummyData.plantName}
            plantSubtitle={dummyData.plantSubtitle}
            plantDescription={dummyData.plantDescription}
          />
          <AchievementList achievements={dummyData.achievements} />
        </div>

        {/* ============================================================
            RIGHT COLUMN (2/3) - PROFILE FORM
            ============================================================ */}
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
  );
};

export default Profile;