
import React, { useState } from 'react';

interface TimerSetupProps {
  onStart: (minutes: number, sensitivity: number) => void;
  initialSensitivity: number;
}

const TimerSetup: React.FC<TimerSetupProps> = ({ onStart, initialSensitivity }) => {
  const [minutes, setMinutes] = useState(10);
  const [sensitivity, setSensitivity] = useState(initialSensitivity);

  const handleStart = () => {
    if (minutes > 0) {
      onStart(minutes, sensitivity);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/50 rounded-lg shadow-lg p-8 text-center flex flex-col items-center backdrop-blur-sm border border-dark-brown/20">
      <div className="mb-6">
        <h1 className="text-4xl font-serif text-dark-brown font-bold">하는반 독서 시간</h1>
        <p className="text-lg font-sans text-medium-brown mt-2">조용한 독서 환경을 위한 스마트 타이머</p>
      </div>

      <div className="w-full space-y-6">
        <div>
          <label htmlFor="minutes" className="block text-md font-sans text-dark-brown mb-2">시간 설정 (분)</label>
          <input
            id="minutes"
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Math.max(1, parseInt(e.target.value, 10)))}
            className="w-full p-3 text-center text-xl font-sans bg-cream border-2 border-medium-brown rounded-md focus:outline-none focus:ring-2 focus:ring-calm-green"
            min="1"
          />
        </div>
        
        <div>
          <label htmlFor="sensitivity" className="block text-md font-sans text-dark-brown mb-2">
            소음 민감도: <span className="font-bold text-calm-green">{sensitivity}</span>
          </label>
          <input
            id="sensitivity"
            type="range"
            min="1"
            max="100"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseInt(e.target.value, 10))}
            className="w-full h-3 bg-cream rounded-lg appearance-none cursor-pointer range-lg accent-calm-green"
          />
        </div>
      </div>
      
      <button
        onClick={handleStart}
        className="mt-8 w-full bg-calm-green text-white font-bold font-sans py-3 px-6 rounded-lg text-xl hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-md"
      >
        타이머 시작
      </button>
    </div>
  );
};

export default TimerSetup;
