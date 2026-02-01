import { useState, useRef, useCallback } from "react";

interface UseVideoRecorderOptions {
  duration?: number; // in seconds
  frameRate?: number;
}

export const useVideoRecorder = (options: UseVideoRecorderOptions = {}) => {
  const { duration = 5, frameRate = 30 } = options;
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const recordElement = useCallback(async (element: HTMLElement, imageUrl: string): Promise<string | null> => {
    return new Promise(async (resolve) => {
      setIsRecording(true);
      setProgress(0);
      chunksRef.current = [];

      // Create canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsRecording(false);
        resolve(null);
        return;
      }

      // Get element dimensions
      const rect = element.getBoundingClientRect();
      canvas.width = rect.width * 2; // Higher resolution
      canvas.height = rect.height * 2;
      canvasRef.current = canvas;

      // Load the image
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        // Setup MediaRecorder
        const stream = canvas.captureStream(frameRate);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp9",
          videoBitsPerSecond: 5000000, // 5 Mbps
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setVideoUrl(url);
          setIsRecording(false);
          setProgress(100);
          resolve(url);
        };

        mediaRecorder.start(100); // Collect data every 100ms

        // Animation loop
        const totalFrames = duration * frameRate;
        let frame = 0;
        const startTime = performance.now();

        const animate = () => {
          const elapsed = (performance.now() - startTime) / 1000;
          const t = elapsed / duration;
          
          if (t >= 1) {
            mediaRecorder.stop();
            return;
          }

          setProgress(Math.round(t * 100));

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Calculate animation values based on time
          const breatheScale = 1 + Math.sin(t * Math.PI * 4) * 0.015;
          const breatheY = Math.sin(t * Math.PI * 4) * -4;
          const shimmer = 0.3 + Math.sin(t * Math.PI * 6) * 0.2;

          // Save context
          ctx.save();

          // Apply breathing animation
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          
          ctx.translate(centerX, centerY);
          ctx.scale(breatheScale, breatheScale);
          ctx.translate(-centerX, -centerY);
          ctx.translate(0, breatheY);

          // Draw image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Add magical shimmer overlay
          const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, canvas.width / 2
          );
          gradient.addColorStop(0, `rgba(251, 191, 36, ${shimmer * 0.1})`);
          gradient.addColorStop(0.5, `rgba(245, 158, 11, ${shimmer * 0.05})`);
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Add floating particles
          const numParticles = 5;
          for (let i = 0; i < numParticles; i++) {
            const particleT = (t + i / numParticles) % 1;
            const px = centerX + Math.sin(particleT * Math.PI * 2 + i) * (canvas.width * 0.3);
            const py = canvas.height * (1 - particleT) * 0.8 + canvas.height * 0.1;
            const particleAlpha = Math.sin(particleT * Math.PI) * 0.6;
            const particleSize = 2 + Math.sin(particleT * Math.PI) * 3;

            ctx.beginPath();
            ctx.arc(px, py, particleSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particleAlpha})`;
            ctx.fill();
          }

          // Add subtle vignette
          const vignette = ctx.createRadialGradient(
            centerX, centerY, canvas.width * 0.3,
            centerX, centerY, canvas.width * 0.7
          );
          vignette.addColorStop(0, "transparent");
          vignette.addColorStop(1, "rgba(0, 0, 0, 0.2)");
          ctx.fillStyle = vignette;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.restore();

          frame++;
          requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      };

      img.onerror = () => {
        console.error("Failed to load image for video recording");
        setIsRecording(false);
        resolve(null);
      };

      img.src = imageUrl;
    });
  }, [duration, frameRate]);

  const downloadVideo = useCallback(() => {
    if (!videoUrl) return;
    
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `retrato-vivo-${Date.now()}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [videoUrl]);

  const reset = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setProgress(0);
  }, [videoUrl]);

  return {
    isRecording,
    videoUrl,
    progress,
    recordElement,
    downloadVideo,
    reset,
  };
};
