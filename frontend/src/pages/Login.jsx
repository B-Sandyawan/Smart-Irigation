import React, { useState } from 'react';

// ==========================================
// ICONS
// ==========================================
const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round"/>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="11" width="14" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikon mata dicoret (Hide)
const HideIcon = ({ onClick }) => (
  <svg onClick={onClick} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A5A5A5" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer hover:stroke-gray-700 transition-colors">
    <path d="M3 12C3 12 6.5 6 12 6C17.5 6 21 12 21 12C21 12 17.5 18 12 18C6.5 18 3 12 3 12Z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 3L21 21" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Ikon mata terbuka (Show)
const ShowIcon = ({ onClick }) => (
  <svg onClick={onClick} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A5A5A5" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer hover:stroke-gray-700 transition-colors">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// ==========================================
// MAIN COMPONENT
// ==========================================
const Login = () => {
  // State untuk Toggle Animasi Kartu (Masuk vs Daftar)
  const [isLogin, setIsLogin] = useState(true);
  
  // State untuk visibilitas password (Ikon Mata)
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);

  return (
    // h-screen & overflow-hidden memastikan halaman pas satu layar penuh tanpa scroll
    <div className="h-screen w-full flex flex-col items-center justify-center font-sans bg-[#FFFAF9] overflow-hidden">
      
      {/* CARD CONTAINER
        Menggunakan proporsi responsif dan mengatur perspective untuk efek 3D flip 
      */}
      <div className="relative w-full max-w-[800px] h-[75vh] min-h-[500px] max-h-[700px] [perspective:1500px] px-4 md:px-0">
        
        {/* INNER FLIP WRAPPER */}
        {/* class rotateY membalik kartu jika state isLogin bernilai false (masuk ke halaman daftar) */}
        <div className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${!isLogin ? '[transform:rotateY(180deg)]' : ''}`}>
          
          {/* ============================================================
              SISI DEPAN: FORM "MASUK"
              ============================================================ */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
            
            {/* Background SVG - Menarik dari folder public */}
            <img src="/card-shadow.svg" alt="shadow" className="absolute inset-0 w-full h-full object-fill opacity-80 translate-y-1 translate-x-1" />
            <img src="/card-bg.svg" alt="bg" className="absolute inset-0 w-full h-full object-fill relative z-0" />
            
            <div className="relative z-10 w-full h-full flex flex-col justify-between px-[10%] py-[8%]">
              
              {/* Judul: Masuk */}
              <div className="mt-[5%]">
                <h1 className="text-[32px] md:text-[40px] text-[#2C2C2C] font-normal m-0 inline-block relative">
                  Masuk
                  <div className="absolute -bottom-2 left-0 w-full h-[3px] bg-[#2C2C2C] rounded-full"></div>
                </h1>
              </div>

              {/* Form Input Masuk */}
              <div className="flex flex-col gap-6 md:gap-8 w-full max-w-[650px] mx-auto mt-auto mb-[15%]">
                <div className="bg-[#FFFAF9] border border-[#2C2C2C] rounded-[16px] px-4 py-3 flex items-center gap-3 transition-shadow focus-within:shadow-md">
                  <MessageIcon />
                  <input 
                    type="email" 
                    placeholder="Masukkan email" 
                    className="w-full bg-transparent outline-none text-[#2C2C2C] text-[15px]"
                  />
                </div>

                <div className="bg-[#FFFAF9] border border-[#2C2C2C] rounded-[16px] px-4 py-3 flex items-center gap-3 transition-shadow focus-within:shadow-md">
                  <LockIcon />
                  <input 
                    type={showLoginPass ? "text" : "password"} 
                    placeholder="Masukkan kata sandi" 
                    className="w-full bg-transparent outline-none text-[#2C2C2C] text-[15px]"
                  />
                  {/* Ikon Mata Interaktif */}
                  {showLoginPass 
                    ? <ShowIcon onClick={() => setShowLoginPass(false)} /> 
                    : <HideIcon onClick={() => setShowLoginPass(true)} />
                  }
                </div>
              </div>

              {/* Tombol Masuk */}
              <div className="absolute bottom-[5%] md:bottom-[7%] left-1/2 transform -translate-x-1/2 w-[70%] max-w-[550px]">
                {/* Efek hover (dabbab) & klik scale 95% agar terasa nyata */}
                <button className="w-full h-[54px] md:h-[60px] bg-[#E8CFC1] border border-[#2C2C2C] rounded-[20px] text-[#2C2C2C] text-[16px] md:text-[18px] font-medium hover:bg-[#dabbab] hover:shadow-md active:scale-95 transition-all duration-200">
                  Masuk
                </button>
              </div>
            </div>
          </div>


          {/* ============================================================
              SISI BELAKANG: FORM "DAFTAR"
              ============================================================ */}
          {/* rotateY(180deg) memastikan ini ada di belakang kartu pertama */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
            
            {/* Background SVG di sisi belakang */}
            {/* Catatan: Di-mirror secara horizontal (-scale-x-100) supaya bentuk lengkungan kartu tidak terbalik saat dilipet ke belakang */}
            <img src="/card-shadow.svg" alt="shadow" className="absolute inset-0 w-full h-full object-fill opacity-80 translate-y-1 translate-x-1 -scale-x-100" />
            <img src="/card-bg.svg" alt="bg" className="absolute inset-0 w-full h-full object-fill relative z-0 -scale-x-100" />
            
            <div className="relative z-10 w-full h-full flex flex-col justify-between px-[10%] py-[8%]">
              
              {/* Judul: Daftar (Rata Kanan) */}
              <div className="mt-[5%] flex justify-end">
                <h1 className="text-[32px] md:text-[40px] text-[#2C2C2C] font-normal m-0 inline-block relative">
                  Daftar
                  <div className="absolute -bottom-2 right-0 w-full h-[3px] bg-[#2C2C2C] rounded-full"></div>
                </h1>
              </div>

              {/* Form Input Daftar */}
              <div className="flex flex-col gap-4 md:gap-5 w-full max-w-[650px] mx-auto mt-auto mb-[15%]">
                <div className="bg-[#FFFAF9] border border-[#2C2C2C] rounded-[16px] px-4 py-3 flex items-center gap-3 transition-shadow focus-within:shadow-md">
                  <UserIcon />
                  <input 
                    type="text" 
                    placeholder="Masukkan nama" 
                    className="w-full bg-transparent outline-none text-[#2C2C2C] text-[15px]"
                  />
                </div>

                <div className="bg-[#FFFAF9] border border-[#2C2C2C] rounded-[16px] px-4 py-3 flex items-center gap-3 transition-shadow focus-within:shadow-md">
                  <MessageIcon />
                  <input 
                    type="email" 
                    placeholder="Masukkan email" 
                    className="w-full bg-transparent outline-none text-[#2C2C2C] text-[15px]"
                  />
                </div>

                <div className="bg-[#FFFAF9] border border-[#2C2C2C] rounded-[16px] px-4 py-3 flex items-center gap-3 transition-shadow focus-within:shadow-md">
                  <LockIcon />
                  <input 
                    type={showRegPass ? "text" : "password"} 
                    placeholder="Masukkan kata sandi" 
                    className="w-full bg-transparent outline-none text-[#2C2C2C] text-[15px]"
                  />
                  {showRegPass 
                    ? <ShowIcon onClick={() => setShowRegPass(false)} /> 
                    : <HideIcon onClick={() => setShowRegPass(true)} />
                  }
                </div>
              </div>

              {/* Tombol Daftar */}
              <div className="absolute bottom-[5%] md:bottom-[7%] left-1/2 transform -translate-x-1/2 w-[70%] max-w-[550px]">
                <button className="w-full h-[54px] md:h-[60px] bg-[#E8CFC1] border border-[#2C2C2C] rounded-[20px] text-[#2C2C2C] text-[16px] md:text-[18px] font-medium hover:bg-[#dabbab] hover:shadow-md active:scale-95 transition-all duration-200">
                  Daftar
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================
          TEKS TOGGLE (Belum/Sudah punya akun?) - Di luar kartu
          ============================================================ */}
      <div className="flex items-center gap-3 mt-4 md:mt-6 z-10">
        <span className="text-[13px] md:text-[14px] text-[#2C2C2C] transition-opacity duration-300">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
        </span>
        {/* Tombol Trigger untuk memutar kartu */}
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="px-5 py-1.5 bg-white border border-[#2C2C2C] rounded-full text-[13px] md:text-[14px] font-medium text-[#2C2C2C] hover:bg-gray-100 hover:shadow-sm active:scale-90 transition-all duration-200 cursor-pointer"
        >
          {isLogin ? 'Daftar' : 'Masuk'}
        </button>
      </div>

    </div>
  );
};

export default Login;