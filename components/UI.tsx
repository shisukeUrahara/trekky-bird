import React from 'react';
import { GameState } from '../types';
import { audioService } from '../services/audioService';

interface UIProps {
  gameState: GameState;
  score: number;
  onStart: () => void;
  onRestart: () => void;
}

export const UI: React.FC<UIProps> = ({ gameState, score, onStart, onRestart }) => {
  
  // Shared logic to start audio
  const handleStart = () => {
    audioService.playScore(); // Init audio context
    onStart();
  };
  
  const handleRestart = () => {
    audioService.playScore();
    onRestart();
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col z-10">
      {/* LCARS Header */}
      <div className="flex h-24 w-full pointer-events-auto">
        <div className="w-32 bg-[#FF9900] rounded-br-3xl mb-2 ml-4 mt-2 flex items-end justify-end p-2 font-bold text-black text-xl tracking-widest">
          LCARS
        </div>
        <div className="flex-1 flex flex-col ml-2 mt-2">
          <div className="h-8 bg-[#CC99CC] w-3/4 rounded-tr-full rounded-bl-full mb-1 flex items-center px-4">
             <span className="text-black font-bold tracking-widest">FEDERATION DATABASE ACCESS</span>
          </div>
          <div className="flex items-center">
            <div className="h-8 bg-[#99CCFF] w-1/4 rounded-bl-full mr-2"></div>
            <div className="text-[#FF9900] text-2xl font-bold tracking-widest">STARDATE: {2370 + score}</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative">
        {/* Sidebar Graphic */}
        <div className="w-24 flex flex-col items-end pr-2 pb-8">
           <div className="w-4 h-16 bg-[#FF9900] mb-1 rounded-l-full"></div>
           <div className="w-4 flex-1 bg-[#CC99CC] mb-1 rounded-l-full"></div>
           <div className="w-8 h-32 bg-[#99CCFF] rounded-l-2xl rounded-br-2xl mb-1"></div>
        </div>

        {/* Center Overlays */}
        <div className="flex-1 flex items-center justify-center pointer-events-auto">
          
          {gameState === GameState.START && (
            <div className="bg-black/80 border-2 border-[#FF9900] p-8 rounded-2xl text-center max-w-md backdrop-blur-sm">
              <h1 className="text-5xl text-[#FF9900] mb-4 font-bold tracking-tighter uppercase">Trekky Bird</h1>
              <p className="text-[#99CCFF] mb-8 text-xl">Pilot the shuttle through the anomaly.</p>
              <p className="text-[#CC99CC] text-sm mb-6">TAP or SPACE to Engage Thrusters</p>
              <button 
                onClick={handleStart}
                className="bg-[#FF9900] hover:bg-[#ffaa33] text-black font-bold py-3 px-8 rounded-full text-xl tracking-widest transition-all transform hover:scale-105"
              >
                ENGAGE
              </button>
            </div>
          )}

          {gameState === GameState.GAME_OVER && (
            <div className="bg-black/90 border-2 border-[#CC0000] p-8 rounded-2xl text-center max-w-md animate-pulse">
              <h1 className="text-6xl text-[#CC0000] mb-2 font-bold uppercase">RED ALERT</h1>
              <p className="text-[#FF9900] mb-6 text-xl">Structural Integrity Failed.</p>
              <div className="text-3xl text-[#99CCFF] mb-8">Final Score: {score}</div>
              <button 
                onClick={handleRestart}
                className="bg-[#99CCFF] hover:bg-[#bbddff] text-black font-bold py-3 px-8 rounded-full text-xl tracking-widest transition-all"
              >
                REINITIALIZE
              </button>
            </div>
          )}
        </div>
      </div>

       {/* Footer */}
       <div className="h-12 flex items-end justify-between px-4 pb-2">
          <div className="text-[#CC99CC] text-xs">USS ENTERPRISE NCC-1701-D</div>
          <div className="text-[#FF9900] text-xs">SYSTEMS ONLINE</div>
       </div>
    </div>
  );
};