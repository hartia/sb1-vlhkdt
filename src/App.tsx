import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Contact from './components/Contact';
import Administration from './pages/Administration';
import { StaffProvider } from './context/StaffContext';

export default function App() {
  return (
    <StaffProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Hero />
        <Features />
        <Administration />
        <Contact />
      </div>
    </StaffProvider>
  );
}