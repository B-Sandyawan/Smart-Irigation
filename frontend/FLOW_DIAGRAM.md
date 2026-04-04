# 🔄 AUTH COMPONENT - FLOW DIAGRAM & VISUAL GUIDE

## USER INTERACTION FLOW

```
           USER INTERACTION
                  ↓
     ┌────────────┴────────────┐
     ↓                         ↓
  CLICK LEFT              CLICK RIGHT
  (Login Side)            (Register Side)
     ↓                         ↓
  setActiveForm            setActiveForm
  ('login')                ('register')
     ↓                         ↓
  activeForm = 'login'    activeForm = 'register'
     ↓                         ↓
  Show Login Form         Show Register Form
     ↓                         ↓
  User fills form         User fills form
     ↓                         ↓
  Click Submit            Click Submit
     ↓                         ↓
  handleLoginSubmit       handleRegisterSubmit
     ↓                         ↓
  Send to Backend         Send to Backend
```

## VISUAL LAYOUT

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌────────────────────┐         ┌────────────────────┐  │
│  │   LOGIN SIDE       │         │  REGISTER SIDE     │  │
│  │                    │         │                    │  │
│  │  ┌──────────────┐  │         │  ┌──────────────┐  │  │
│  │  │              │  │         │  │              │  │  │
│  │  │  SVG Image   │  │         │  │  SVG Image   │  │  │
│  │  │ (bg-shape)   │  │         │  │(bg-shape-2)  │  │  │
│  │  │              │  │         │  │              │  │  │
│  │  └──────────────┘  │         │  └──────────────┘  │  │
│  │                    │         │                    │  │
│  │  "Masuk"           │         │  "Daftar"          │  │
│  │  Click to login    │         │  Click to register │  │
│  │                    │         │                    │  │
│  └────────────────────┘         └────────────────────┘  │
│                                                         │
│             ┌──────────────────────────┐                │
│             │   GLASSMORPHISM FORM     │                │
│             │                          │                │
│             │  Title                   │                │
│             │  [Email Input]    📧    │                │
│             │  [Password Input] 🔒    │                │
│             │  [Submit Button]         │                │
│             │                          │                │
│             │  or                      │                │
│             │                          │                │
│             │  [Name Input]     👤    │                │
│             │  [Email Input]    📧    │                │
│             │  [Password Input] 🔒    │                │
│             │  [Confirm Pass]   🔒    │                │
│             │  [Submit Button]         │                │
│             │                          │                │
│             └──────────────────────────┘                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## STATE MANAGEMENT DIAGRAM

```
                     AUTH COMPONENT
                          │
                ┌──────────┼──────────┐
                ↓          ↓          ↓
          activeForm  loginData  registerData  hoveredSide
          ┌────────┐ ┌────────┐ ┌────────────┐ ┌────────┐
          │'login' │ │ email  │ │   name     │ │ 'left' │
          │'regist'│ │password│ │   email    │ │'right' │
          └────────┘ └────────┘ │ password   │ │ null   │
                                │ confirm    │ └────────┘
                                └────────────┘
```

## EVENT HANDLERS FLOW

```
                        USER ACTION
                             │
        ┌────────────────────┼────────────────────┐
        ↓                    ↓                    ↓
     CLICK SIDE          INPUT CHANGE           HOVER
        │                    │                    │
        ├─→ onClick          ├─→ onChange        ├─→ onMouseEnter
        │   setActiveForm    │   setLoginData    │   setHoveredSide
        └─────────────────┬──┴──────────┬────────┴────────┬────────
                          ↓             ↓                 ↓
                      RE-RENDER ◄────────────────────────────
                          │
                    UPDATE UI STATE
```

## FORM CONDITIONAL RENDERING

```
activeForm === 'login'
    ↓
    YES → Render Login Form
         ├── Email input
         ├── Password input
         └── Submit button "Masuk"
    ↓
    NO → Render Register Form
         ├── Name input
         ├── Email input
         ├── Password input
         ├── Confirm Password input
         └── Submit button "Daftar"
```

## CSS CLASS HIERARCHY

```
.auth-container (PARENT)
│
├── .auth-side .auth-side-left
│   ├── .side-background
│   │   └── img.bg-image
│   ├── .side-overlay (.dimmed when not active)
│   └── .side-label
│   
├── .auth-side .auth-side-right
│   ├── .side-background
│   │   └── img.bg-image
│   ├── .side-overlay (.dimmed when not active)
│   └── .side-label
│
└── .form-container
    └── .form-glass
        ├── .form-header
        │   ├── h1
        │   └── p
        ├── form
        │   └── .form-group (multiple)
        │       ├── label
        │       └── .input-wrapper
        │           ├── span.input-icon
        │           └── input
        ├── button.btn.btn-submit
        └── .form-switch
```

## ANIMATION TIMELINE

```
USER CLICK SISI
    ↓
[0ms] activeForm updates
    ↓
[0ms] React re-renders
    ↓
[0-600ms] slideIn animation
         Form translate dari -45% → -50%
         Opacity 0 → 1
    ↓
[200-800ms] formFadeIn animation (delayed start)
           Form scale 0.95 → 1
           Opacity 0 → 1
    ↓
[800ms] Animation complete
        Form fully visible & interactive
```

## HOVER EFFECT SEQUENCE

```
MOUSE ENTER (inactive side)
    ↓
hoveredSide = 'left' | 'right'
    ↓
.auth-side.hovered class applied
    ↓
CSS transition begins (0.6s)
    ↓
.side-overlay.dimmed triggered
    ↓
Side-label opacity opacity: 0.9 → 1
    ↓
[600ms] Hover effect complete

MOUSE LEAVE
    ↓
hoveredSide = null
    ↓
CSS transition reverses
    ↓
[600ms] Back to original state
```

## RESPONSIVE BREAKPOINTS

```
DESKTOP (> 768px)
    ↓
Full split screen (50% - 50%)
Full form width 420px
Glassmorphism fully visible

TABLET (768px)
    ↓
Split screen adjusted
Form padding reduced
SVG backgrounds scaled

MOBILE (< 480px)
    ↓
Split expand/collapse
Touch-friendly spacing
Form padding minimal
Font sizes reduced
Form width ~100% - 40px margin
```

## FORM SUBMIT FLOW

```
User fills form
         ↓
Click Submit button
         ↓
handleLoginSubmit() | handleRegisterSubmit()
         ↓
e.preventDefault()
         ↓
Validation (optional - current: required attribute)
         ↓
API Call (TODO: integrate backend)
         ↓
Success: Save token + Redirect
Failed: Show error message
```

## COLOR & STYLING HIERARCHY

```
Primary Colors
├── Primary: #2D5016 (Dark Green)
├── Accent: #7cb342 (Light Green)
└── Secondary: #E8DCC8 (Tan)

Text Colors
├── Primary: #1a1a1a (Dark)
└── Secondary: #666 (Gray)

Glass Effect
├── Background: rgba(255,255,255,0.15)
├── Backdrop: blur(20px)
├── Border: rgba(255,255,255,0.2)
└── Shadow: 0 8px 32px rgba(0,0,0,0.1)

Interactive States
├── Hover: backdrop-filter enhanced
├── Focus: outline/border glow
├── Active: button gradient
└── Disabled: opacity reduced
```

## DATA FLOW EXAMPLE

```
User types email in Login form
         ↓
onChange event triggered
         ↓
handleLoginChange() function called
         ↓
setLoginData({
  ...loginData,
  email: "user@example.com"
})
         ↓
Component re-renders
         ↓
Input value updated = "user@example.com"
         ↓
State synchronized with UI
```

## INTEGRATION POINTS

```
Auth Component
    ↓
┌───┴────────────────────────────────┐
↓                                    ↓
Backend API (TODO)            Local Storage (TODO)
├── POST /api/auth/login      ├── token
├── POST /api/auth/register   ├── user profile
├── POST /api/auth/logout     └── preferences
└── GET /api/user

    ↓
Redux Store (optional)
├── auth
├── user
└── ui

    ↓
Routing
├── /dashboard (on success)
├── /auth (on logout)
└── /profile (user page)
```

## BROWSER COMPATIBILITY MATRIX

```
Chrome/Edge      ✅ Full support (Backdrop filter)
Firefox          ✅ Full support (Backdrop filter)
Safari           ✅ Full support (iOS 15.1+)
Mobile Chrome    ✅ Full support
Mobile Safari    ✅ Full support (iOS 15.1+)
IE11             ❌ No backdrop filter support

Feature Support
├── Flexbox       ✅ All modern browsers
├── CSS Grid      ✅ All modern browsers
├── Backdrop Filter ✅ Chrome 76+, Edge 79+, Firefox 103+, Safari 9+
└── ES6 Modules   ✅ All modern browsers
```

---

**Diagram Version**: 1.0
**Last Updated**: April 4, 2026
