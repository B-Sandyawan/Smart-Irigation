import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

const MessageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round"/>
  </svg>
);

const LockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="11" width="14" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HideIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A5A5A5" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12C3 12 6.5 6 12 6C17.5 6 21 12 21 12C21 12 17.5 18 12 18C6.5 18 3 12 3 12Z" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 3L21 21" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Login = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans relative overflow-hidden bg-[#FFF8F8]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D1FBEC] to-[#57C3BF]"></div>
      
      {/* Card Container Layout matching Figma exact pixels */}
      <div className="relative w-[980px] h-[692px] bg-[#F5E9DB] border border-[#2C2C2C] rounded-[24px] box-border shadow-sm z-10 flex-shrink-0">
        
        {/* Title Group */}
        <div className="absolute left-[45px] top-[130px] w-[137px] h-[53px]">
          <h1 className="text-[40px] leading-[1.275em] text-[#2C2C2C] font-normal m-0 p-0 absolute top-0 left-0">Masuk</h1>
          <div className="w-[128px] h-[3px] bg-[#2C2C2C] rounded-[24px] absolute top-[50px] left-0"></div>
        </div>

        {/* Inputs */}
        <div className="absolute top-[313px] left-[113px] flex flex-col gap-[51px] w-[760px]">
          <Input 
            icon={<MessageIcon />} 
            type="email" 
            placeholder="Masukkan email" 
            containerStyle="w-[760px] h-[64px]"
            bg="bg-[#FFFAF9]"
          />
          
          <Input 
            icon={<LockIcon />} 
            rightIcon={<HideIcon />}
            type="password" 
            placeholder="Masukkan kata sandi" 
            containerStyle="w-[756px] h-[64px] ml-[4px]" 
            bg="bg-[#FFFCFB]"
          />
        </div>

        {/* Submit Button */}
        <Button className="absolute top-[607px] left-[113px] w-[754px] h-[60px]">
          Masuk
        </Button>
      </div>

      {/* Subtext Below Card */}
      <div className="relative z-10 flex flex-row items-center gap-[10px] mt-[24px]">
        <span className="text-[14px] leading-[1.275em] text-[#2C2C2C] font-normal">Sudah punya akun?</span>
        <button className="flex items-center justify-center w-[71.81px] h-[30px] bg-[#FAFFFE] border-[0.5px] border-[#2C2C2C] rounded-[8px] hover:bg-gray-100 transition-colors cursor-pointer">
          <span className="text-[14px] leading-[1.275em] text-[#2C2C2C] font-normal">Daftar</span>
        </button>
      </div>

    </div>
  );
};

export default Login;
