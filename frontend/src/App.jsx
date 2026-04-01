import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';

// Placeholder for Dashboard
const Dashboard = () => (
  <div>
    <h1 className="text-[40px] font-[700] text-[#2D3B2E] font-sans leading-[1.485em] mb-[34px]">Dashboard</h1>
    <div className="w-full min-h-[500px] border-2 border-dashed border-[#A5A5A5] rounded-[24px] flex items-center justify-center">
      <span className="text-[#A5A5A5] font-sans text-xl">Konten Dashboard</span>
    </div>
  </div>
);

// Placeholder for Plants
const Plants = () => (
  <div>
    <h1 className="text-[40px] font-[700] text-[#2D3B2E] font-sans leading-[1.485em] mb-[34px]">Pantau Tanaman</h1>
    <div className="w-full min-h-[500px] border-2 border-dashed border-[#A5A5A5] rounded-[24px] flex items-center justify-center">
      <span className="text-[#A5A5A5] font-sans text-xl">Konten Pantau Tanaman</span>
    </div>
  </div>
);

// Placeholder for Profile
const Profile = () => (
  <div>
    <h1 className="text-[40px] font-[700] text-[#2D3B2E] font-sans leading-[1.485em] mb-[34px]">Profil</h1>
    <div className="w-full min-h-[500px] border-2 border-dashed border-[#A5A5A5] rounded-[24px] flex items-center justify-center">
      <span className="text-[#A5A5A5] font-sans text-xl">Konten Profil</span>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="plants" element={<Plants />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
