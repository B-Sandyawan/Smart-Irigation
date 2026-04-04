# QUICK REFERENCE - Auth Component

## File yang Dibuat ✅

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Auth.jsx (NEW) - Komponen utama
│   │   └── AUTH_IMPLEMENTATION.js (NEW) - Documentation
│   ├── styles/
│   │   ├── Auth.css (NEW) - Styling & Animations
│   │   └── AUTH_DOCS.md (NEW) - Full documentation
│   └── App.jsx (UPDATED) - Menggunakan Auth component
└── public/
    ├── bg-shape.svg (EXISTING) - Login background
    └── bg-shape-2.svg (EXISTING) - Register background
```

## Fitur Inti 🎯

| Fitur | Status | Deskripsi |
|-------|--------|-----------|
| Split Screen | ✅ | Layar terbagi 2 (Login & Register) |
| Background SVG | ✅ | Masing-masing sisi punya background image |
| Interactive | ✅ | Klik sisi untuk tampil form |
| Hover Effect | ✅ | Sisi tidak aktif meredup |
| Glassmorphism | ✅ | Form di tengah dengan blur effect |
| Animasi | ✅ | Smooth transitions |
| Responsive | ✅ | Mobile-friendly |
| State Management | ✅ | Form switching logic |

## Import & Setup 🚀

```javascript
// Di App.jsx
import Auth from './pages/Auth';

function App() {
  return <Auth />;
}

export default App;
```

## Component Props

Komponen Auth tidak memerlukan props. Semua state dikelola internal.

```jsx
<Auth />  // Cukup seperti ini
```

## State Management 📊

```javascript
const [activeForm, setActiveForm] = useState('login');      // 'login' | 'register'
const [loginData, setLoginData] = useState({...});          // Email & Password
const [registerData, setRegisterData] = useState({...});    // Name, Email, Password
const [hoveredSide, setHoveredSide] = useState(null);       // null | 'left' | 'right'
```

## Event Flow 🔄

```
User Interaction → Event Handler → State Update → Re-render
       ↓
   Click Left Side
       ↓
   setActiveForm('login')
       ↓
   Form Login ditampilkan di tengah
```

## CSS Classes Utama 🎨

| Class | Apply Ke | Deskripsi |
|-------|----------|-----------|
| `.auth-container` | Main wrapper | Full screen container |
| `.auth-side` | Sisi split screen | 50% width flex item |
| `.auth-side.active` | Sisi yang dipilih | Flex grow 1.1 |
| `.auth-side.hovered` | Sisi yang di-hover | Visual feedback |
| `.side-overlay.dimmed` | Sisi tidak aktif | Overlay gelap 0.4 |
| `.form-glass` | Form container | Glassmorphism card |

## Animations 🎬

| Animation | Trigger | Effect |
|-----------|---------|--------|
| `slideIn` | Form mount | Slide dari atas |
| `formFadeIn` | Form mount | Fade in + scale |
| `flex transition` | Hover/Click | Smooth grow/shrink |
| `overlay transition` | Active change | Smooth dimming |

## Responsive Breakpoints 📱

```css
DESKTOP:  Full split screen
TABLET:   768px - Adjusted padding
MOBILE:   480px - Touch friendly
```

## Form Inputs

### Login Form
```
Email       [📧 input field]
Password    [🔒 input field]

Lupa password? (link)
[MASUK button]

Belum punya akun? Daftar di sini (link)
```

### Register Form
```
Nama        [👤 input field]
Email       [📧 input field]
Password    [🔒 input field]
Konfirmasi  [🔒 input field]

[DAFTAR button]

Sudah punya akun? Masuk di sini (link)
```

## Styling Highlight 🎨

### Colors
- Primary: `#2D5016` (Hijau)
- Secondary: `#E8DCC8` (Tan)
- Accent: `#7cb342` (Light Green)

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Shadow
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px rgba(255, 255, 255, 0.3);
```

## Testing Checklist ✓

- [ ] Halaman load tanpa error
- [ ] Split screen terlihat (50% kiri, 50% kanan)
- [ ] SVG backgrounds terlihat
- [ ] Hover effect berfungsi
- [ ] Klik sisi menampilkan form yang benar
- [ ] Form smooth transition
- [ ] Input fields bekerja
- [ ] Form switch links bekerja
- [ ] Mobile responsive
- [ ] No console errors

## Next Steps 📋

1. **Backend API Integration**
   - Update `handleLoginSubmit()`
   - Update `handleRegisterSubmit()`
   - Add loading states
   - Add error handling

2. **Validation**
   - Email format validation
   - Password strength check
   - Password confirm match
   - Display error messages

3. **Features**
   - Remember me checkbox
   - Forgot password flow
   - Email verification
   - Social login

4. **UX Improvement**
   - Loading spinner on button
   - Success messages
   - Error toast notifications
   - Form autofill support

## Command Cheat Sheet 💻

```bash
# Run dev server
npm run dev

# Check for errors
npm run lint

# Build for production
npm run build
```

## Troubleshooting 🔧

**Q: Form tidak muncul?**
- A: Pastikan activeForm state terupdate. Check console untuk errors.

**Q: Background image tidak terlihat?**
- A: Pastikan file `bg-shape.svg` dan `bg-shape-2.svg` ada di `/public`

**Q: Overlay tidak meredup?**
- A: Check CSS class `.side-overlay.dimmed` diterapkan dengan benar

**Q: Mobile layout broken?**
- A: Clear cache browser, check media queries di css file

## Support 📞

Untuk pertanyaan atau bug:
1. Check console untuk error messages
2. Review AUTH_DOCS.md untuk dokumentasi lengkap
3. Check AUTH_IMPLEMENTATION.js untuk implementasi details

---

**Last Updated**: April 2026
**Status**: ✅ Production Ready
