/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden font-mono">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(theme(colors.purple.500) 1px, transparent 1px), linear-gradient(90deg, theme(colors.purple.500) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(3)',
          transformOrigin: 'bottom'
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 p-6 flex flex-col items-center border-b border-purple-500/30 bg-slate-950/50 backdrop-blur-md">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-6xl font-display font-bold text-white text-center tracking-wider text-shadow-neon-cyan"
        >
          NEON<span className="text-pink-500 text-shadow-neon-pink">SNAKE</span>
        </motion.h1>
        <p className="text-cyan-400 mt-2 tracking-widest text-sm opacity-80">CYBERNETIC_RECREATION_MODULE</p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col md:flex-row items-center justify-center p-4 md:p-8 gap-8 overflow-y-auto">
        
        {/* Game Container */}
        <div className="w-full max-w-lg">
          <SnakeGame />
        </div>

      </main>

      {/* Footer / Music Player */}
      <footer className="relative z-10 p-4 w-full max-w-4xl mx-auto mt-auto mb-4">
        <MusicPlayer />
      </footer>
    </div>
  );
}
