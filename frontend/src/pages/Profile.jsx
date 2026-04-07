import React, { useState } from 'react';

const Profile = () => {
  const [formData, setFormData] = useState({
    full_name: 'Siaramyuk',
    email: 'siramyuk@gmail.com',
    password: 'yuksiram!',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsUpdating(true);

    // Simulasi loading 1 detik
    setTimeout(() => {
      setIsUpdating(false);
      alert('Profil berhasil diperbarui! (Simulasi)');
    }, 1000);
  };

  const handleLogout = () => {
    alert("Simulasi Logout berhasil");
  };

  return (
    <div className="w-full min-h-screen bg-[#9BC19B] pt-6 pb-6 px-6 md:px-8 lg:px-10 font-sans relative flex flex-col">
      {/* Header Title */}
      <div className="w-full max-w-4xl mx-auto flex-shrink-0">
        <h1 className="text-[rgba(45,59,46,1)] text-[28px] md:text-[36px] font-bold mb-4 tracking-tight pl-2">
          Profil
        </h1>
      </div>

      {/* Main White Card - Dibuat compact agar pas 1 layar dan tidak terpotong */}
      <div className="bg-[#FFFFFF] rounded-[32px] md:rounded-[40px] p-6 md:p-8 shadow-sm w-full max-w-4xl mx-auto flex flex-col justify-center relative z-10 flex-grow">
        
        <form onSubmit={handleUpdateProfile} className="w-full flex flex-col items-center">
          
          <div className="w-full max-w-xl">
            {/* Inputs Section */}
            <div className="space-y-4 mb-6 w-full">
              {/* Nama Lengkap */}
              <div className="flex flex-col gap-1.5">
                <label className="text-black font-medium text-[15px] pl-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full h-[48px] px-5 bg-[rgba(236,219,201,1)] border border-[#2C2C2C] rounded-[12px] text-black text-[15px] focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-black font-medium text-[15px] pl-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full h-[48px] px-5 bg-[rgba(236,219,201,1)] border border-[#2C2C2C] rounded-[12px] text-black text-[15px] outline-none cursor-not-allowed opacity-90"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-black font-medium text-[15px] pl-1">Password</label>
                <input
                  type="password" 
                  name="password"
                  value={formData.password}
                  readOnly
                  className="w-full h-[48px] px-5 bg-[rgba(236,219,201,1)] border border-[#2C2C2C] rounded-[12px] text-black text-[15px] outline-none cursor-not-allowed opacity-90 tracking-widest"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full h-[48px] px-10 bg-[rgba(155,193,155,1)] hover:opacity-90 text-black text-[15px] font-bold rounded-[12px] transition-all duration-300 border border-[#2C2C2C]"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>

            {/* Horizontal Divider */}
            <hr className="w-full border-t border-[#A5A5A5] opacity-50 my-5 md:my-6" />

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 h-[48px] px-8 bg-[rgba(223,159,136,1)] hover:opacity-90 text-black text-[15px] font-bold rounded-[12px] transition-all duration-300 border border-[#2C2C2C]"
            >
              Keluar / Logout
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black shrink-0">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;