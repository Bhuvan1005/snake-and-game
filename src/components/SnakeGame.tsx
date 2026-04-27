import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2; // Milliseconds to subtract per food eaten
const MIN_SPEED = 50;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Ref to keep track of the current direction to prevent rapid reverse keystrokes
  const currentDirectionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Make sure food doesn't spawn on the snake
      const onSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    const initialDir = { x: 0, y: -1 };
    setDirection(initialDir);
    currentDirectionRef.current = initialDir;
    setFood(generateFood([{ x: 10, y: 10 }]));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent un-intentional scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !isGameOver) {
        setIsPaused((p) => !p);
        return;
      }

      if (isGameOver || isPaused) return;

      const { x, y } = currentDirectionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isPaused]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    currentDirectionRef.current = direction;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Wall collisions
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Self collisions
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); 
        }

        return newSnake;
      });
    };

    const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - (score / 10) * SPEED_INCREMENT);
    const intervalId = setInterval(moveSnake, currentSpeed);

    return () => clearInterval(intervalId);
  }, [direction, isGameOver, isPaused, food, score, generateFood]);

  useEffect(() => {
    if (isGameOver && score > highScore) {
      setHighScore(score);
    }
  }, [isGameOver, score, highScore]);

  return (
    <div className="flex flex-col items-center bg-slate-900 border border-cyan-500 rounded-xl p-6 box-shadow-neon-cyan max-w-full">
      <div className="flex justify-between w-full mb-4 px-2">
        <div className="text-cyan-400 font-display text-xl text-shadow-neon-cyan">
          SCORE: {score}
        </div>
        <div className="text-pink-500 font-display text-xl text-shadow-neon-pink">
          HIGH: {highScore}
        </div>
      </div>

      <div 
        className="relative bg-black border border-slate-700/50 outline outline-1 outline-pink-500/30 w-full max-w-[400px] aspect-square rounded-sm overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Draw Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${
                isHead ? 'bg-cyan-300 z-10' : 'bg-cyan-500/80 shadow-[0_0_8px_theme(colors.cyan.500)]'
              } rounded-[2px]`}
              style={{
                gridColumn: segment.x + 1,
                gridRow: segment.y + 1,
                transform: isHead ? 'scale(1.1)' : 'scale(0.9)',
                transition: 'all 0.05s linear'
              }}
            />
          );
        })}

        {/* Draw Food */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="bg-pink-500 shadow-[0_0_12px_theme(colors.pink.500)] rounded-full z-0"
          style={{
            gridColumn: food.x + 1,
            gridRow: food.y + 1,
            transform: 'scale(0.8)',
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm"
            >
              <h2 className="text-4xl font-display font-bold text-pink-500 mb-4 text-shadow-neon-pink tracking-widest text-center">
                SYSTEM<br/>FAILURE
              </h2>
              <div className="text-cyan-400 mb-6 font-mono text-lg text-shadow-neon-cyan">
                FINAL SCORE: {score}
              </div>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold rounded hover:bg-cyan-400 hover:text-black transition-all hover:box-shadow-neon-cyan font-display uppercase tracking-widest cursor-pointer"
              >
                Reboot_
              </button>
            </motion.div>
          )}

          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20 backdrop-blur-[2px]"
            >
              <h2 className="text-3xl font-display font-bold text-cyan-400 tracking-[0.2em] text-shadow-neon-cyan mb-4">
                PAUSED
              </h2>
              <div className="text-pink-500 uppercase tracking-wider text-sm animate-pulse">
                [SPACE] to resume
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-6 text-slate-500 text-sm flex gap-4 uppercase tracking-wider">
        <span>[W A S D] or [ARROWS] to move</span>
        <span>[SPACE] to pause</span>
      </div>
    </div>
  );
}
