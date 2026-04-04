# Komponen Auth - Split Interactive Background

## Deskripsi
Komponen React interaktif untuk halaman autentikasi dengan split screen yang memungkinkan pengguna untuk memilih antara Login atau Register dengan visual yang menarik.

## Fitur Utama

### 1. Split Interactive Background
- **Layar terbagi 2**: Sisi kiri (Masuk) dan sisi kanan (Daftar)
- **Background Image**: Menggunakan SVG dari `public/bg-shape.svg` dan `public/bg-shape-2.svg`
- **Hover Effect**: Sisi yang tidak aktif akan meredup (overlay dark 0.4)
- **Click to Switch**: Klik pada sisi manapun untuk menampilkan form yang sesuai

### 2. Form Management
- **Dynamic Form**: Form berubah sesuai dengan tab yang dipilih (Login/Register)
- **State Management**: Menggunakan React State untuk tracking form data dan active tab
- **Form Validation**: Input field memiliki atribut `required` untuk validasi dasar

### 3. Glassmorphism Design
- **Glass Effect**: Form ditampilkan dengan efek glassmorphism (blur + transparency)
- **Backdrop Filter**: Menggunakan `backdrop-filter: blur(20px)` untuk efek glass
- **Smooth Animations**: Transisi antar form dengan animasi smooth

### 4. Responsive Design
- **Mobile Friendly**: Desain responsif untuk semua ukuran layar
- **Breakpoints**: 
  - Tablet: 768px
  - Mobile: 480px

## Struktur File

```
src/
├── pages/
│   └── Auth.jsx              # Komponen utama
├── styles/
│   └── Auth.css              # Styling dengan glassmorphism
└── App.jsx                   # Updated untuk menggunakan Auth

public/
├── bg-shape.svg              # Background untuk sisi Login
└── bg-shape-2.svg            # Background untuk sisi Register
```

## Penggunaan

### Import Komponen
```jsx
import Auth from './pages/Auth';

function App() {
  return <Auth />;
}
```

## State Management

### Active Form
```javascript
const [activeForm, setActiveForm] = useState('login'); // 'login' | 'register'
```

### Login Data
```javascript
const [loginData, setLoginData] = useState({
  email: '',
  password: ''
});
```

### Register Data
```javascript
const [registerData, setRegisterData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});
```

### Hover State (untuk visual feedback)
```javascript
const [hoveredSide, setHoveredSide] = useState(null);
```

## Event Handlers

### Form Submission
- `handleLoginSubmit()`: Menangani submit form login
- `handleRegisterSubmit()`: Menangani submit form register

### Form Input Changes
- `handleLoginChange()`: Update login form data
- `handleRegisterChange()`: Update register form data

### Interaksi Split Screen
- `onClick`: Klik pada sisi untuk menampilkan form
- `onMouseEnter/onMouseLeave`: Hover effect untuk visual feedback

## Styling CSS

### Variabel Color
```css
--primary-color: #2D5016       /* Warna hijau primer */
--secondary-color: #E8DCC8     /* Warna tan */
--glass-bg: rgba(255,255,255,0.1)
--glass-border: rgba(255,255,255,0.2)
--accent-color: #7cb342        /* Hijau accent */
```

### Efek Kunci
1. **Glassmorphism**: 
   - `backdrop-filter: blur(20px)`
   - `background: rgba(255,255,255,0.15)`

2. **Hover Animation**:
   - Smooth transition pada flex grow/shrink
   - Overlay dimming effect

3. **Form Animations**:
   - Slide In: Form muncul dari atas
   - Fade Scale: Form fade in dengan scale effect

## Integrasi Backend

### TODO: Submit Handlers
Ubah fungsi submit untuk menghubungkan dengan API backend:

```javascript
const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });
    // Handle response
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

## Browser Support
- Modern browsers dengan support untuk:
  - CSS Grid & Flexbox
  - CSS Backdrop Filter
  - ES6 JavaScript

## Performance Notes
- CSS animations untuk smooth performance
- SVG images untuk quality pada semua resolusi
- Glassmorphism effect optimized untuk modern browsers

## Accessibility
- Label HTML untuk setiap input
- Proper form semantics
- Keyboard navigation support (native form behavior)

---

**Dibuat dengan ❤️ untuk Smart Irrigation**
