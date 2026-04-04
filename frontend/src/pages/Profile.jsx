import React from 'react';

const Profile = () => {
  return (
    <div style={styles.container}>
      {/* --- SIDEBAR KIRI --- */}
      <div style={styles.sidebar}>
        <div style={styles.logoArea}>
          <h2 style={styles.logoText}>Embun Harvest</h2>
        </div>
        
        <nav style={styles.navMenu}>
          <div style={styles.navItem}>🏠 Dashboard</div>
          <div style={styles.navItem}>🌿 Pantau Tanaman</div>
          <div style={styles.navActive}>👤 Profil</div>
        </nav>

        <div style={styles.sidebarFooter}>
          <p style={{fontSize: '12px', color: '#999'}}>v1.0.2 - 2026</p>
        </div>
      </div>

      {/* --- AREA KONTEN UTAMA --- */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>Profil</h1>
        </header>
        
        <div style={styles.contentWrapper}>
          {/* KOTAK PUTIH (KARTU PROFIL) */}
          <div style={styles.profileCard}>
            <div style={styles.formContainer}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nama Lengkap</label>
                <input style={styles.input} type="text" defaultValue="Siramyuk" />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input style={styles.input} type="email" defaultValue="siramyuk@gmail.com" />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input style={styles.input} type="password" defaultValue="********" />
              </div>

              {/* BAGIAN TOMBOL & GARIS */}
              <div style={styles.buttonGroup}>
                <button style={styles.btnSave}>Simpan Perubahan</button>
                
                <div style={styles.divider}></div> 
                
                <button style={styles.btnLogout}>
                  Keluar / Log Out <span style={{marginLeft: '10px'}}>🚪</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#0A1D37', // Background Biru Gelap Luar
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    overflow: 'hidden', // Container utama tetap hidden agar sidebar tidak ikut scroll
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#F9F5F0',
    display: 'flex',
    flexDirection: 'column',
    padding: '30px 20px',
    boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
  },
  logoArea: { marginBottom: '50px', textAlign: 'center' },
  logoText: { color: '#0A1D37', fontSize: '20px', letterSpacing: '1px', fontWeight: 'bold' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 },
  navItem: {
    padding: '12px 20px',
    borderRadius: '12px',
    color: '#555',
    cursor: 'pointer',
  },
  navActive: {
    padding: '12px 20px',
    borderRadius: '25px',
    backgroundColor: '#7FA686',
    color: '#FFF',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#95B391', // Hijau Sage
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto', // BIAR BISA DI-SCROLL
    height: '100vh',
  },
  header: { marginBottom: '20px' },
  pageTitle: { fontSize: '32px', color: '#0A1D37', margin: 0 },
  contentWrapper: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'flex-start', // Mulai dari atas supaya scroll-nya enak
    paddingBottom: '60px', 
  },
  profileCard: {
    backgroundColor: '#FFF',
    width: '100%',
    maxWidth: '850px', // Ukuran manis (tidak terlalu raksasa)
    borderRadius: '45px',
    padding: '50px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    marginTop: '20px',
  },
  formContainer: { 
    width: '100%',
  },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', color: '#666', marginBottom: '8px', fontWeight: '600' },
  input: {
    width: '100%',
    padding: '15px 18px',
    backgroundColor: '#F3EDE4', // Krem Input
    border: '1px solid #E0D5C5',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  buttonGroup: { 
    marginTop: '30px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px' 
  },
  btnSave: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#95B391',
    border: 'none',
    borderRadius: '12px',
    color: '#0A1D37',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s',
  },
  divider: {
    height: '1px',
    backgroundColor: '#EEE',
    margin: '15px 0',
    width: '100%'
  },
  btnLogout: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#E2A389', // Warna Peach/Merah lembut
    border: 'none',
    borderRadius: '12px',
    color: '#FFF',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default Profile;