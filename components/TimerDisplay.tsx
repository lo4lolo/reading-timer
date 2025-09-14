
import React from 'react';
import CircularProgress from './CircularProgress';
import NoiseChart from './NoiseChart';
import { BackIcon, PlayIcon, PauseIcon } from './icons';
import type { NoiseRecord } from '../types';

interface TimerDisplayProps {
  duration: number;
  remainingTime: number;
  isRunning: boolean;
  sensitivity: number;
  noiseHistory: NoiseRecord[];
  showWarning: boolean;
  noiseLevel: number;
  onGoBack: () => void;
  onTogglePlayPause: () => void;
  onDownload: () => void;
  onSensitivityChange: (newSensitivity: number) => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  duration,
  remainingTime,
  isRunning,
  sensitivity,
  noiseHistory,
  showWarning,
  noiseLevel,
  onGoBack,
  onTogglePlayPause,
  onDownload,
  onSensitivityChange,
}) => {
  const progress = duration > 0 ? (remainingTime / duration) * 100 : 0;
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-4">
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 shadow-2xl text-center border-4 border-warning-orange">
            <h2 className="text-3xl font-serif text-dark-brown mb-4">조금만 조용히 해볼까요?</h2>
            <p className="text-lg font-sans text-medium-brown mb-6">타이머가 잠시 멈췄어요. 다시 시작하려면 재생 버튼을 눌러주세요.</p>
            <button
              onClick={onTogglePlayPause}
              className="bg-calm-green text-white font-bold py-2 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
            >
              다시 시작
            </button>
          </div>
        </div>
      )}

      <div className="text-center">
        <h1 className="text-4xl font-serif text-dark-brown font-bold">하는반 독서 시간</h1>
      </div>

      <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
        <CircularProgress percentage={progress} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl sm:text-7xl md:text-8xl font-sans font-bold text-dark-brown tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-lg font-serif text-medium-brown">남은 시간</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button onClick={onGoBack} className="p-4 bg-white/60 rounded-full shadow-md hover:bg-white transition-transform transform hover:scale-110" aria-label="뒤로가기">
          <BackIcon className="w-8 h-8 text-medium-brown" />
        </button>
        <button onClick={onTogglePlayPause} className="p-6 bg-calm-green rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-110" aria-label={isRunning ? "일시정지" : "재생"}>
          {isRunning ? <PauseIcon className="w-10 h-10 text-white" /> : <PlayIcon className="w-10 h-10 text-white" />}
        </button>
         <div className="w-16 h-16"></div> {/* Spacer to balance the back button */}
      </div>

      <div className="w-full max-w-sm">
        <label htmlFor="sensitivity-runtime" className="block text-md font-sans text-dark-brown mb-2 text-center">
            소음 민감도: <span className="font-bold text-calm-green">{sensitivity}</span>
        </label>
        <input
            id="sensitivity-runtime"
            type="range"
            min="1"
            max="100"
            value={sensitivity}
            onChange={(e) => onSensitivityChange(parseInt(e.target.value, 10))}
            className="w-full h-3 bg-cream rounded-lg appearance-none cursor-pointer range-lg accent-calm-green"
            aria-label="소음 민감도 조절"
        />
      </div>

      <div className="w-full p-6 bg-white/50 rounded-lg shadow-lg backdrop-blur-sm border border-dark-brown/20">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-serif text-dark-brown">실시간 소음 그래프 (최근 30초)</h3>
            <button 
                onClick={onDownload} 
                className="bg-medium-brown text-white font-sans py-2 px-4 rounded-md text-sm hover:bg-opacity-90 transition-colors"
            >
                기록 내려받기
            </button>
        </div>
        <div className="h-48">
          <NoiseChart data={noiseHistory} sensitivity={sensitivity} />
        </div>
        <div className="text-center mt-2 font-sans text-medium-brown">
          현재 소음: <span className="font-bold text-dark-brown text-lg">{Math.round(noiseLevel)}</span>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
