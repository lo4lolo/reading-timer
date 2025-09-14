
import { useState, useCallback, useRef } from 'react';

export const useNoiseLevel = () => {
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setNoiseLevel(0);
  }, []);

  const startListening = useCallback(async () => {
    if (audioContextRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const context = new AudioContext();
      audioContextRef.current = context;
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateNoiseLevel = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const average = sum / dataArray.length;
        
        // Scale the average to a more intuitive 0-100 range.
        // This scaling factor may need adjustment based on mic sensitivity.
        const scaledLevel = Math.min(100, Math.floor((average / 255) * 200));

        setNoiseLevel(scaledLevel);
        animationFrameRef.current = requestAnimationFrame(updateNoiseLevel);
      };

      updateNoiseLevel();
      setError(null);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('마이크에 접근할 수 없습니다. 권한을 확인해주세요.');
      stopListening();
    }
  }, [stopListening]);
  
  return { noiseLevel, error, startListening, stopListening };
};
