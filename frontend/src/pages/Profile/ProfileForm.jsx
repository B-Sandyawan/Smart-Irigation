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
    <div className="flex h-full w-full flex-col rounded-[18px] border border-[#5D5A56] bg-[#F3F0EC] p-6 shadow-[0_3px_8px_rgba(0,0,0,0.22)] sm:p-8 font-sans">
      
      <form onSubmit={onUpdateProfile} className="w-full flex flex-col flex-1">
        <h2 className="mb-7 text-center text-[24px] font-bold tracking-tight text-[#334139]">
          Profil Pengguna
        </h2>

        {successMessage && (
          <div className="mx-auto mb-6 w-full max-w-[330px] rounded-[12px] bg-[#C3DBC9] p-3 text-center text-[14px] font-bold text-[#385B38]">
            ✓ {successMessage}
          </div>
        )}

        <div className="mx-auto mb-8 w-full max-w-[330px] space-y-4">
          
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#272727]">Nama Lengkap</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={onchange}
              required={true}
              className="h-[34px] w-full rounded-[12px] border border-[#7A7672] bg-[#E8D9C5] px-3 text-[13px] font-medium text-[#222] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#272727]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly={true}
              className="h-[34px] w-full rounded-[12px] border border-[#7A7672] bg-[#E8D9C5] px-3 text-[13px] font-medium text-[#7A7A7A] focus:outline-none cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#272727]">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              readOnly={true}
              className="h-[34px] w-full rounded-[12px] border border-[#7A7672] bg-[#E8D9C5] px-3 text-[13px] font-medium text-[#7A7A7A] focus:outline-none cursor-not-allowed"
            />
          </div>

        </div>

        <div className="mx-auto mt-auto w-full max-w-[330px] pt-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="h-[36px] w-full rounded-[12px] border border-[#5F6A5D] bg-[#94C094] px-6 text-[16px] font-bold text-[#121212] transition-colors hover:bg-[#88B788] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>

          <div className="my-8 h-px w-full bg-[#ACA59D]" />

          <button
            type="button"
            onClick={onLogout}
            className="flex h-[68px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#7F6054] bg-[#D79A83] px-6 text-[16px] font-bold text-[#141414] transition-colors hover:bg-[#CC907A]"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
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