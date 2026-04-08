import React, { useState } from 'react';
import ProfileForm from './Profile/ProfileForm';
// Catatan: Pastikan file/komponen ini benar-benar ada di folder ./Profile/
// Jika StreakVisualization tidak dipakai (karena sudah digabung di file lain), bisa dihapus dari import
import PlantInfoCard from './Profile/PlantInfoCard';
import AchievementList from './Profile/AchievementList';

/**
 * Profile Page Component
 * * Halaman untuk menampilkan dan mengedit profil pengguna
 * Layout: Two-column dengan:
 * - Kiri: Visualisasi tanaman kangkung + Streak chart (1/3 width)
 * - Kanan: Form profil pengguna (2/3 width)
 * * Struktur disesuaikan dengan Dashboard:
 * - Header fixed di atas, konten scrollable di bawahnya.
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
  
  // State untuk melacak scroll agar header bisa memiliki efek bayangan
  const [isScrolled, setIsScrolled] = useState(false);

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  
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
    // Membungkus layar dengan h-screen dan overflow-hidden persis seperti Dashboard
    <section className="flex h-screen flex-col bg-[#9BC19B] overflow-hidden font-sans">
      
      {/* ============================================================
          HEADER SECTION (FIXED AT TOP)
          ============================================================ */}
      <div className={`shrink-0 z-20 px-4 pt-6 pb-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isScrolled ? 'shadow-md bg-[#9BC19B]/95 backdrop-blur-sm border-b border-white/10' : ''
      }`}>
        {/* max-w-[980px] agar sejajar dengan konten dashboard */}
        <div className="mx-auto w-full max-w-[980px]">
          <h1 className="text-[26px] font-bold text-white tracking-wide drop-shadow-sm">
            Profil
          </h1>
        </div>
      </div>

      {/* ============================================================
          SCROLLABLE AREA
          ============================================================ */}
      <div 
        className="flex-1 overflow-y-auto px-4 pb-12 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        onScroll={handleScroll}
      >
        <div className="mx-auto flex h-full w-full max-w-[980px] flex-col pt-2 gap-8">
          
          {/* MAIN CONTENT GRID */}
          {/* Menggunakan items-start agar kolom kiri tidak ikut melar memanjang ke bawah mengikuti form kanan */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
            
            {/* ============================================================
                LEFT COLUMN (1/3) - PLANT INFO + ACHIEVEMENTS
                ============================================================ */}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
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
      </div>

    </section>
  );
};

export default Profile;