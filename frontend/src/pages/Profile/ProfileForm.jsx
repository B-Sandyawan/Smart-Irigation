import React from 'react';

/**
 * ProfileForm Component
 * 
 * Sub-komponen untuk form profil pengguna
 * Menampilkan input fields dan buttons (Simpan, Logout)
 * Tipografi: Montserrat
 */
const ProfileForm = ({
  formData,
  isUpdating,
  successMessage,
  onchange,
  onUpdateProfile,
  onLogout,
}) => {
  return (
    <div className="bg-[#FEF9F3] rounded-2xl p-6 shadow-md w-full h-full flex flex-col font-['Montserrat']">
      
      <form onSubmit={onUpdateProfile} className="w-full flex flex-col flex-1">
        {/* Form Title - CENTER ALIGNED - MONTSERRAT BOLD */}
        <h2 className="text-[#1a1a1a] text-[22px] font-['Montserrat'] font-bold mb-6 text-center">
          Profil Pengguna
        </h2>

        {/* Success Message */}
        {successMessage && (
          <div className="w-full mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-[13px] text-center font-medium">
            ✓ {successMessage}
          </div>
        )}

        {/* Input Fields Section */}
        <div className="space-y-4 mb-6 w-full">
          
          {/* Nama Lengkap Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[#1a1a1a] font-['Montserrat'] font-semibold text-[13px] text-left">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={onchange}
              required={true}
              className="w-full h-10 px-4 bg-[#FFEDD9] border border-[#E8D8CC] rounded-lg text-[#1a1a1a] text-[13px] font-['Montserrat'] focus:outline-none focus:ring-2 focus:ring-[#9BC19B]"
            />
          </div>

          {/* Email Input (Read-only) */}
          <div className="flex flex-col gap-2">
            <label className="text-[#1a1a1a] font-['Montserrat'] font-semibold text-[13px] text-left">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onchange}
              readOnly={true}
              className="w-full h-10 px-4 bg-[#FFEDD9] border border-[#E8D8CC] rounded-lg text-[#1a1a1a] text-[13px] font-['Montserrat'] opacity-75 cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* Password Input (Read-only) */}
          <div className="flex flex-col gap-2">
            <label className="text-[#1a1a1a] font-['Montserrat'] font-semibold text-[13px] text-left">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onchange}
              readOnly={true}
              className="w-full h-10 px-4 bg-[#FFEDD9] border border-[#E8D8CC] rounded-lg text-[#1a1a1a] text-[13px] font-['Montserrat'] tracking-widest opacity-75 cursor-not-allowed focus:outline-none"
            />
          </div>

        </div>

        {/* Buttons Section */}
        <div className="space-y-2 mt-auto w-full">
          {/* Save Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className="
              w-full h-11 px-6
              bg-[#9BC19B] hover:opacity-90 active:opacity-95
              text-white text-[14px] font-['Montserrat'] font-bold leading-relaxed
              rounded-lg
              border border-[#7BA97B]
              transition-all duration-300
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="
              w-full flex items-center justify-center gap-2
              h-11 px-6
              bg-[#DF9F88] hover:opacity-90 active:opacity-95
              text-white text-[14px] font-['Montserrat'] font-bold leading-relaxed
              rounded-lg
              border border-[#D48A74]
              transition-all duration-300
            "
          >
            {/* Logout Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white flex-shrink-0"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Keluar / Logout</span>
          </button>
        </div>
      </form>

    </div>
  );
};

export default ProfileForm;
