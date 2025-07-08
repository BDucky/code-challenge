import { useState, useEffect } from 'react';
import SwapForm from '@/components/SwapForm';
import { Toaster } from 'react-hot-toast';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <main className="min-h-screen w-full bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 transition duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(236, 72, 153, 0.15), transparent 80%)`,
        }}
      />
      <div className="w-full max-w-md z-10">
        <SwapForm />
      </div>
    </main>
  );
}

export default App;
