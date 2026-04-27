import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Synthwave Gen 01',
    artist: 'AI.Studio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'Cybernetic Groove Gen 02',
    artist: 'AI.Studio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'Digital Horizon Gen 03',
    artist: 'AI.Studio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Autoplay prevented:", err);
        setIsPlaying(false);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/80 border border-purple-500/50 box-shadow-neon-purple rounded-xl p-4 w-full backdrop-blur-md gap-4">
      <div className="flex flex-col items-center sm:items-start flex-1 min-w-0">
        <h3 className="font-display font-bold text-pink-400 text-shadow-neon-pink truncate w-full text-center sm:text-left text-lg">
          {currentTrack.title}
        </h3>
        <p className="text-cyan-400/80 text-sm">{currentTrack.artist}</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={prevTrack}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
          title="Previous"
        >
          <SkipBack size={24} />
        </button>
        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-950 border border-cyan-400 text-cyan-400 hover:bg-cyan-900 hover:box-shadow-neon-cyan transition-all"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <button
          onClick={nextTrack}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
          title="Next"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-1 justify-end">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-24 accent-pink-500 cursor-pointer"
        />
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
}
