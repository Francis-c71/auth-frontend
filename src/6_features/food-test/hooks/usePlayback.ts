import { useCallback, useEffect, useRef, useState } from 'react';

export const RATES: readonly number[] = [1, 2, 4];

interface PlaybackOptions {
  duration: number;
  hasVideo: boolean;
}

/**
 * One clock for the page. With a video it reads the video's own time; without one
 * it runs a preview timer. Both give the same `time`, so the page cannot tell them apart.
 */
export function usePlayback({ duration, hasVideo }: PlaybackOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewTime = useRef(0);
  const [time, setTime] = useState(0);
  const [videoLength, setVideoLength] = useState(duration);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);

  // Preview clock: advances while playing.
  useEffect(() => {
    if (hasVideo || !playing) return;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = Math.min(previewTime.current + ((now - last) / 1000) * rate, duration);
      last = now;
      previewTime.current = next;
      setTime(next);
      if (next >= duration) {
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hasVideo, playing, rate, duration]);

  // Real video: read its clock every frame while it plays, and on pause or seek.
  useEffect(() => {
    const video = videoRef.current;
    if (!hasVideo || !video) return;
    let frame = 0;
    const read = () => setTime(video.currentTime);
    const loop = () => {
      read();
      frame = requestAnimationFrame(loop);
    };
    const onPlay = () => {
      setPlaying(true);
      cancelAnimationFrame(frame);
      loop();
    };
    const onStop = () => {
      setPlaying(false);
      cancelAnimationFrame(frame);
      read();
    };
    const onMeta = () => {
      if (Number.isFinite(video.duration)) setVideoLength(video.duration);
    };
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onStop);
    video.addEventListener('ended', onStop);
    video.addEventListener('seeked', read);
    video.addEventListener('loadedmetadata', onMeta);
    if (video.readyState >= 1) onMeta();
    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onStop);
      video.removeEventListener('ended', onStop);
      video.removeEventListener('seeked', read);
      video.removeEventListener('loadedmetadata', onMeta);
    };
  }, [hasVideo]);

  const seek = useCallback(
    (seconds: number) => {
      const target = Math.max(0, seconds);
      const video = videoRef.current;
      if (hasVideo && video) {
        video.currentTime = target;
      } else {
        previewTime.current = Math.min(target, duration);
        setTime(previewTime.current);
      }
    },
    [hasVideo, duration],
  );

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (hasVideo && video) {
      if (video.paused) void video.play();
      else video.pause();
      return;
    }
    if (!playing && previewTime.current >= duration) {
      previewTime.current = 0;
      setTime(0);
    }
    setPlaying((p) => !p);
  }, [hasVideo, playing, duration]);

  return { videoRef, time, length: hasVideo ? videoLength : duration, playing, rate, setRate, toggle, seek };
}

export type Playback = ReturnType<typeof usePlayback>;