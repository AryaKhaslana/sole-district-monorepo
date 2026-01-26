import React from 'react';

export default function HeroSection() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
      
      {/* 1. GAMBAR BACKGROUND */}
      {/* Pastiin lu punya gambar namanya 'hero-bg.jpg' di folder 'public/images/' atau ganti link ini */}
      <img 
        src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop" 
        alt="Hero Background"
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
      />
      
      {/* 2. OVERLAY HITAM (Biar tulisan kebaca) */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}></div>

      {/* 3. TULISAN TENGAH */}
      <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%', 
          color: 'white',
          textAlign: 'center' 
      }}>
        
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold', fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1 }}>
          Find Your <br/>
          <span style={{ color: '#fbbf24' }}>Style</span> {/* Warna Kuning Emas */}
        </h1>
        
        <p style={{ marginTop: '20px', fontSize: '1.5rem', letterSpacing: '5px' }}>
          STRIDE COMMERCE EXCLUSIVE
        </p>

        <button style={{ 
            marginTop: '30px', 
            padding: '15px 40px', 
            fontSize: '1.2rem', 
            fontWeight: 'bold', 
            backgroundColor: 'white', 
            color: 'black', 
            border: 'none', 
            cursor: 'pointer' 
        }}>
          SHOP NOW
        </button>

      </div>
    </div>
  );
}