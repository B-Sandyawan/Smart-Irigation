import React from 'react';

const ProfileForm = ({
  formData,
  isUpdating,
  successMessage,
  onchange,
  onUpdateProfile,
  onLogout,
}) => {
  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm w-full h-full flex flex-col font-sans">
      
      <form onSubmit={onUpdateProfile} className="w-full flex flex-col flex-1">
        <h2 className="text-[#444] text-[22px] font-bold mb-6 tracking-tight border-b border-gray-100 pb-4">
          Profil Pengguna
        </h2>

        {successMessage && (
          <div className="w-full mb-6 p-3 bg-[#C3DBC9] rounded-xl text-[#385B38] text-[14px] font-bold text-center">
            ✓ {successMessage}
          </div>
        )}

        <div className="space-y-5 mb-8 w-full">
          
          <div className="flex flex-col gap-2">
            <label className="text-[#444] font-bold text-[14px]">
              Nama Lengkap <span className="text-[#D9534F]">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={onchange}
              required={true}
              className="w-full h-[46px] px-4 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl text-[#444] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#4B9567] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#444] font-bold text-[14px]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onchange}
              readOnly={true}
              className="w-full h-[46px] px-4 bg-[#F2F2F2] border border-[#E5E5E5] rounded-xl text-[#999] text-[14px] font-medium cursor-not-allowed focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#444] font-bold text-[14px]">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onchange}
              readOnly={true}
              className="w-full h-[46px] px-4 bg-[#F2F2F2] border border-[#E5E5E5] rounded-xl text-[#999] text-[14px] font-medium tracking-widest cursor-not-allowed focus:outline-none"
            />
          </div>

        </div>

        {/* Buttons Section */}
        <div className="space-y-3 mt-auto w-full pt-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="
              w-full h-[46px] px-6
              bg-[#4B9567] hover:bg-[#385B38] active:scale-[0.99]
              text-white text-[15px] font-bold
              rounded-xl
              transition-all duration-300
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="
              w-full flex items-center justify-center gap-2
              h-[46px] px-6
              bg-[#FCEBEA] hover:bg-[#F8D7D6] active:scale-[0.99]
              text-[#D9534F] text-[15px] font-bold
              rounded-xl
              transition-all duration-300
            "
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
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