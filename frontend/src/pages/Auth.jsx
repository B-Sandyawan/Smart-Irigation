import React, { useState } from 'react';
import '../styles/Auth.css';

const Auth = () => {
  const [activeForm, setActiveForm] = useState('login'); // 'login' atau 'register'
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [hoveredSide, setHoveredSide] = useState(null);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', loginData);
    // Tambahkan logic untuk submit
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log('Register:', registerData);
    // Tambahkan logic untuk submit
  };

  return (
    <div className="auth-container">
      {/* LEFT SIDE - LOGIN */}
      <div
        className={`auth-side auth-side-left ${activeForm === 'login' ? 'active' : ''} ${hoveredSide === 'left' ? 'hovered' : ''}`}
        onClick={() => setActiveForm('login')}
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <div className="side-background">
          <img src="/bg-shape.svg" alt="Login Background" className="bg-image" />
        </div>
        <div className={`side-overlay ${activeForm === 'login' ? '' : 'dimmed'}`}></div>
        <div className="side-label">
          <h2>Masuk</h2>
          <p>Akses akun Anda</p>
        </div>
      </div>

      {/* RIGHT SIDE - REGISTER */}
      <div
        className={`auth-side auth-side-right ${activeForm === 'register' ? 'active' : ''} ${hoveredSide === 'right' ? 'hovered' : ''}`}
        onClick={() => setActiveForm('register')}
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <div className="side-background">
          <img src="/bg-shape-2.svg" alt="Register Background" className="bg-image" />
        </div>
        <div className={`side-overlay ${activeForm === 'register' ? '' : 'dimmed'}`}></div>
        <div className="side-label">
          <h2>Daftar</h2>
          <p>Buat akun baru</p>
        </div>
      </div>

      {/* CENTER FORM */}
      <div className={`form-container form-${activeForm}`}>
        <div className="form-glass">
          {activeForm === 'login' ? (
            <>
              <div className="form-header">
                <h1>Masuk</h1>
                <p>Selamat datang kembali</p>
              </div>
              <form onSubmit={handleLoginSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="login-email">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="login-email"
                      name="email"
                      placeholder="Masukkan email Anda"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Kata Sandi</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type="password"
                      id="login-password"
                      name="password"
                      placeholder="Masukkan kata sandi"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-footer-link">
                  <a href="#forgot">Lupa kata sandi?</a>
                </div>

                <button type="submit" className="btn btn-submit">
                  Masuk
                </button>
              </form>

              <div className="form-switch">
                <p>Belum punya akun? <span onClick={() => setActiveForm('register')} className="switch-link">Daftar di sini</span></p>
              </div>
            </>
          ) : (
            <>
              <div className="form-header">
                <h1>Daftar</h1>
                <p>Buat akun baru Anda</p>
              </div>
              <form onSubmit={handleRegisterSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="register-name">Nama Lengkap</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      id="register-name"
                      name="name"
                      placeholder="Masukkan nama Anda"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-email">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="register-email"
                      name="email"
                      placeholder="Masukkan email Anda"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-password">Kata Sandi</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type="password"
                      id="register-password"
                      name="password"
                      placeholder="Masukkan kata sandi"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-confirm">Konfirmasi Kata Sandi</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type="password"
                      id="register-confirm"
                      name="confirmPassword"
                      placeholder="Konfirmasi kata sandi"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-submit">
                  Daftar
                </button>
              </form>

              <div className="form-switch">
                <p>Sudah punya akun? <span onClick={() => setActiveForm('login')} className="switch-link">Masuk di sini</span></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
