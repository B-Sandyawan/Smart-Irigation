import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth'; 


const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] shrink-0">
    <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] shrink-0">
    <rect x="5" y="11" width="14" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] shrink-0">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HideIcon = ({ onClick }) => (
  <svg onClick={onClick} viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer hover:stroke-gray-600 transition-colors w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] shrink-0">
    <path d="M3 12C3 12 6.5 6 12 6C17.5 6 21 12 21 12C21 12 17.5 18 12 18C6.5 18 3 12 3 12Z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 3L21 21" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShowIcon = ({ onClick }) => (
  <svg onClick={onClick} viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer hover:stroke-gray-600 transition-colors w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] shrink-0">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectAfterLogin = location.state?.from?.pathname || '/';
  
  // UI States
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Auth & Notification States
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type) => {
    setNotif({ show: true, message, type });
    setTimeout(() => {
      setNotif({ show: false, message: '', type: '' });
    }, 3500);
  };

  const toggleCard = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setFullName('');
    setNotif({ show: false, message: '', type: '' });
  };

  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setNotif({ show: false, message: '', type: '' });
    setLoading(true);

    try {
      if (isLogin) {
        await authService.login(email, password);
        navigate(redirectAfterLogin, { replace: true }); 
      } else {
        const result = await authService.register(email, password, fullName);

        if (result?.session) {
          showNotification('Registrasi berhasil! Anda langsung masuk.', 'success');
          navigate('/', { replace: true });
        } else {
          showNotification('Registrasi berhasil! Cek email verifikasi lalu masuk.', 'success');
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setFullName('');
        }
      }
    } catch (error) {
      showNotification(authService.formatAuthError(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans bg-[#FFFAF9] overflow-hidden px-4">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      
      {notif.show && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[340px] bg-[#FFFAF9] border-[2px] border-[#2C2C2C] rounded-[16px] p-4 shadow-[4px_4px_0px_#2C2C2C] sm:shadow-[6px_6px_0px_#2C2C2C] flex items-center gap-4 transition-all duration-300 animate-bounce`}>
          <div className={`w-10 h-10 rounded-full border-[1.5px] border-[#2C2C2C] flex items-center justify-center shrink-0 ${notif.type === 'error' ? 'bg-[#FFF0F0]' : 'bg-[#F0FFF4]'}`}>
            {notif.type === 'error' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B9567" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[#2C2C2C] font-bold text-[14px] sm:text-[15px]">
              {notif.type === 'error' ? 'Pemberitahuan' : 'Berhasil'}
            </span>
            <span className="text-[#2C2C2C] text-[12px] sm:text-[13px] leading-tight mt-0.5">
              {notif.message}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center w-full max-w-[650px]">
        <div 
          className="relative w-full aspect-[1.1] sm:aspect-[1.35] cursor-pointer"
          onClick={toggleCard}
        >
          <img 
            src="/card-shadow.svg" 
            alt="Shadow Card" 
            className={`absolute inset-0 w-full h-full object-fill z-0 transition-transform duration-700 ease-in-out ${!isLogin ? 'scale-x-[-1]' : 'scale-x-100'}`} 
          />
          <img 
            src="/bg-shape.svg" 
            alt="Main Card" 
            className={`absolute inset-0 w-full h-full object-fill z-10 transition-transform duration-700 ease-in-out ${!isLogin ? 'scale-x-[-1]' : 'scale-x-100'}`} 
          />

          <div className="absolute inset-0 z-20 pointer-events-none">
            
            {/* HEADER */}
            <div className="absolute top-[12%] sm:top-[16%] left-[10%] right-[10%] h-[35px] sm:h-[50px]">
              <h1 
                onClick={(e) => { e.stopPropagation(); toggleCard(); }}
                className={`absolute top-0 text-[22px] sm:text-[32px] text-[#2C2C2C] font-normal border-b-[1.5px] sm:border-b-[2px] border-[#2C2C2C] pb-0.5 sm:pb-1 pointer-events-auto cursor-pointer transition-all duration-500 ease-in-out ${isLogin ? 'left-0 opacity-100' : 'left-[-20px] opacity-0 pointer-events-none'}`}
              >
                Masuk
              </h1>
              <h1 
                onClick={(e) => { e.stopPropagation(); toggleCard(); }}
                className={`absolute top-0 text-[22px] sm:text-[32px] text-[#2C2C2C] font-normal border-b-[1.5px] sm:border-b-[2px] border-[#2C2C2C] pb-0.5 sm:pb-1 pointer-events-auto cursor-pointer transition-all duration-500 ease-in-out ${!isLogin ? 'right-0 opacity-100' : 'right-[-20px] opacity-0 pointer-events-none'}`}
              >
                Daftar
              </h1>
            </div>

            {/* FORM AREA */}
            <div className="absolute top-[34%] sm:top-[36%] bottom-[10%] sm:bottom-[12%] left-[10%] right-[10%]">
              
              {/* Wrapper Form Masuk */}
              <form onSubmit={handleSubmit} className={`absolute inset-0 flex flex-col h-full transition-all duration-500 ease-in-out ${isLogin ? 'opacity-100 translate-y-0 pointer-events-auto z-10' : 'opacity-0 translate-y-[20px] pointer-events-none z-0'}`}>
                <div className="flex flex-col gap-2.5 sm:gap-4">
                  <div onClick={handleFormClick} className="h-[34px] sm:h-[48px] bg-[#FFFAF9] border border-[#2C2C2C] rounded-[8px] sm:rounded-[12px] px-3 sm:px-4 flex items-center gap-2.5 sm:gap-4 cursor-text hover:shadow-sm focus-within:shadow-md transition-shadow">
                    <MessageIcon />
                    <input 
                      type="email" 
                      placeholder="Masukkan email" 
                      value={isLogin ? email : ''}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-full bg-transparent outline-none text-[#2C2C2C] text-[12px] sm:text-[15px] placeholder:text-[12px] sm:placeholder:text-[15px]"
                    />
                  </div>

                  <div onClick={handleFormClick} className="h-[34px] sm:h-[48px] bg-[#FFFAF9] border border-[#2C2C2C] rounded-[8px] sm:rounded-[12px] px-3 sm:px-4 flex items-center gap-2.5 sm:gap-4 cursor-text hover:shadow-sm focus-within:shadow-md transition-shadow">
                    <LockIcon />
                    <input 
                      type={showLoginPass ? "text" : "password"} 
                      placeholder="Masukkan kata sandi" 
                      value={isLogin ? password : ''}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-full bg-transparent outline-none text-[#2C2C2C] text-[12px] sm:text-[15px] placeholder:text-[12px] sm:placeholder:text-[15px]"
                    />
                    {showLoginPass 
                      ? <ShowIcon onClick={() => setShowLoginPass(false)} /> 
                      : <HideIcon onClick={() => setShowLoginPass(true)} />
                    }
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  onClick={handleFormClick} 
                  className="w-full h-[36px] sm:h-[50px] bg-[#EEDACF] border border-[#2C2C2C] rounded-[10px] sm:rounded-[16px] text-[#2C2C2C] text-[13px] sm:text-[16px] font-normal hover:bg-[#e4ceb9] active:scale-[0.98] transition-all duration-200 mt-auto disabled:opacity-50"
                >
                  {loading ? 'Memproses...' : 'Masuk'}
                </button>
              </form>

              {/* Wrapper Form Daftar */}
              <form onSubmit={handleSubmit} className={`absolute inset-0 flex flex-col h-full transition-all duration-500 ease-in-out ${!isLogin ? 'opacity-100 translate-y-0 pointer-events-auto z-10' : 'opacity-0 translate-y-[20px] pointer-events-none z-0'}`}>
                <div className="flex flex-col gap-1.5 sm:gap-3">
                  <div onClick={handleFormClick} className="h-[34px] sm:h-[48px] bg-[#FFFAF9] border border-[#2C2C2C] rounded-[8px] sm:rounded-[12px] px-3 sm:px-4 flex items-center gap-2.5 sm:gap-4 cursor-text hover:shadow-sm focus-within:shadow-md transition-shadow">
                    <UserIcon />
                    <input 
                      type="text" 
                      placeholder="Masukkan nama" 
                      value={!isLogin ? fullName : ''}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full h-full bg-transparent outline-none text-[#2C2C2C] text-[12px] sm:text-[15px] placeholder:text-[12px] sm:placeholder:text-[15px]"
                    />
                  </div>

                  <div onClick={handleFormClick} className="h-[34px] sm:h-[48px] bg-[#FFFAF9] border border-[#2C2C2C] rounded-[8px] sm:rounded-[12px] px-3 sm:px-4 flex items-center gap-2.5 sm:gap-4 cursor-text hover:shadow-sm focus-within:shadow-md transition-shadow">
                    <MessageIcon />
                    <input 
                      type="email" 
                      placeholder="Masukkan email" 
                      value={!isLogin ? email : ''}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-full bg-transparent outline-none text-[#2C2C2C] text-[12px] sm:text-[15px] placeholder:text-[12px] sm:placeholder:text-[15px]"
                    />
                  </div>

                  <div onClick={handleFormClick} className="h-[34px] sm:h-[48px] bg-[#FFFAF9] border border-[#2C2C2C] rounded-[8px] sm:rounded-[12px] px-3 sm:px-4 flex items-center gap-2.5 sm:gap-4 cursor-text hover:shadow-sm focus-within:shadow-md transition-shadow">
                    <LockIcon />
                    <input 
                      type={showRegPass ? "text" : "password"} 
                      placeholder="Masukkan kata sandi" 
                      value={!isLogin ? password : ''}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-full bg-transparent outline-none text-[#2C2C2C] text-[12px] sm:text-[15px] placeholder:text-[12px] sm:placeholder:text-[15px]"
                    />
                    {showRegPass 
                      ? <ShowIcon onClick={() => setShowRegPass(false)} /> 
                      : <HideIcon onClick={() => setShowRegPass(true)} />
                    }
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  onClick={handleFormClick} 
                  className="w-full h-[36px] sm:h-[50px] bg-[#EEDACF] border border-[#2C2C2C] rounded-[10px] sm:rounded-[16px] text-[#2C2C2C] text-[13px] sm:text-[16px] font-normal hover:bg-[#e4ceb9] active:scale-[0.98] transition-all duration-200 mt-auto disabled:opacity-50"
                >
                  {loading ? 'Memproses...' : 'Daftar'}
                </button>
              </form>

            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-8 flex items-center gap-3 sm:gap-4 z-20">
          <span className="text-[12px] sm:text-[14px] text-[#2C2C2C] font-normal transition-opacity duration-300">
            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
          </span>
          <button 
            onClick={toggleCard}
            className="text-[12px] sm:text-[14px] text-[#2C2C2C] font-normal border border-[#2C2C2C] rounded-full px-5 sm:px-6 py-1 sm:py-1.5 bg-transparent hover:bg-[#2C2C2C] hover:text-[#FFFAF9] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            {isLogin ? 'Daftar' : 'Masuk'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;