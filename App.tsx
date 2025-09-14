
import React, { useState, useEffect, useCallback, useRef } from 'react';
import TimerSetup from './components/TimerSetup';
import TimerDisplay from './components/TimerDisplay';
import { useNoiseLevel } from './hooks/useNoiseLevel';
import { exportToCsv } from './services/csvExporter';
import type { NoiseRecord } from './types';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'setup' | 'timer'>('setup');
  const [duration, setDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sensitivity, setSensitivity] = useState(100);
  const [noiseHistory, setNoiseHistory] = useState<NoiseRecord[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [displayedNoiseLevel, setDisplayedNoiseLevel] = useState(0);

  const { noiseLevel, error, startListening, stopListening } = useNoiseLevel();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const noiseLevelRef = useRef(noiseLevel);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    noiseLevelRef.current = noiseLevel;
  }, [noiseLevel]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopWarningSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      if (noiseLevel > sensitivity) {
        setIsRunning(false);
        setShowWarning(true);
        audioRef.current?.play().catch(e => console.error("Audio playback failed:", e));
      }
    }
  }, [noiseLevel, isRunning, remainingTime, sensitivity]);
  
  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        const currentNoise = noiseLevelRef.current;
        setRemainingTime(prev => prev - 1);
        setNoiseHistory(prev => [...prev, { timestamp: new Date(), level: currentNoise }]);
        setDisplayedNoiseLevel(currentNoise);
      }, 1000);
    } else if (remainingTime <= 0 && duration > 0) {
      setIsRunning(false);
      stopListening();
      stopWarningSound();
      setDisplayedNoiseLevel(0);
    }
    
    return () => clearTimer();
  }, [isRunning, remainingTime, duration, stopListening, clearTimer, stopWarningSound]);

  const handleStart = useCallback((minutes: number, newSensitivity: number) => {
    const totalSeconds = minutes * 60;
    setDuration(totalSeconds);
    setRemainingTime(totalSeconds);
    setSensitivity(newSensitivity);
    setNoiseHistory([]);
    setShowWarning(false);
    setDisplayedNoiseLevel(0);
    startListening();
    setIsRunning(true);
    setScreen('timer');
  }, [startListening]);

  const handleGoBack = useCallback(() => {
    setIsRunning(false);
    stopListening();
    setScreen('setup');
    clearTimer();
    stopWarningSound();
    setDisplayedNoiseLevel(0);
  }, [stopListening, clearTimer, stopWarningSound]);

  const handleTogglePlayPause = useCallback(() => {
    if (remainingTime > 0) {
      setIsRunning(prev => !prev);
      if (showWarning) {
        setShowWarning(false);
        stopWarningSound();
      }
    }
  }, [remainingTime, showWarning, stopWarningSound]);

  const handleDownload = useCallback(() => {
    if (noiseHistory.length > 0) {
      exportToCsv('noise-log.csv', noiseHistory);
    } else {
      alert("기록된 데이터가 없습니다.");
    }
  }, [noiseHistory]);
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-cream text-dark-brown p-4 text-center">
        <div>
          <h1 className="text-2xl font-serif mb-4">오류가 발생했습니다</h1>
          <p className="font-sans">마이크 접근 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해주세요.</p>
          <p className="text-sm mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-cream text-dark-brown font-sans flex flex-col items-center justify-center p-4">
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/audio/2022/03/15/audio_70281c79e8.mp3"
        loop
        preload="auto"
      />
      {screen === 'setup' ? (
        <TimerSetup onStart={handleStart} initialSensitivity={sensitivity} />
      ) : (
        <TimerDisplay
          duration={duration}
          remainingTime={remainingTime}
          isRunning={isRunning}
          sensitivity={sensitivity}
          noiseHistory={noiseHistory}
          showWarning={showWarning}
          onGoBack={handleGoBack}
          onTogglePlayPause={handleTogglePlayPause}
          onDownload={handleDownload}
          onSensitivityChange={setSensitivity}
          noiseLevel={displayedNoiseLevel}
        />
      )}
    </div>
  );
};

export default App;
