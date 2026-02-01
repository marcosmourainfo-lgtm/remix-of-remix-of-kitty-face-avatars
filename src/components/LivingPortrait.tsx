import { motion, Easing } from "framer-motion";

interface LivingPortraitProps {
  imageUrl: string;
  motionType: string;
  personality: string;
  className?: string;
}

type MotionVariant = {
  animate: Record<string, number[] | string[]>;
  transition: {
    duration: number;
    repeat: number;
    ease: Easing;
    times?: number[];
  };
};

const LivingPortrait = ({ imageUrl, motionType, personality, className = "" }: LivingPortraitProps) => {
  // Get animation variants based on motion type
  const getMotionVariants = (): MotionVariant => {
    const baseTransition = {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as Easing,
    };

    switch (motionType) {
      case "breathing":
        return {
          animate: {
            scale: [1, 1.015, 1, 1.01, 1],
            y: [0, -2, 0, -1, 0],
          },
          transition: { ...baseTransition, duration: 4 },
        };
      
      case "blinking":
        return {
          animate: {
            scaleY: [1, 1, 0.98, 1, 1, 1, 1, 1, 0.97, 1],
          },
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut" as Easing,
            times: [0, 0.4, 0.42, 0.44, 0.7, 0.8, 0.85, 0.87, 0.89, 1],
          },
        };
      
      case "head-tilt":
        return {
          animate: {
            rotateZ: [0, -2, 0, 2, 0],
            x: [0, -3, 0, 3, 0],
          },
          transition: { ...baseTransition, duration: 6 },
        };
      
      case "purring":
        return {
          animate: {
            scale: [1, 1.008, 1.003, 1.01, 1.005, 1],
          },
          transition: { ...baseTransition, duration: 2 },
        };
      
      case "looking-around":
        return {
          animate: {
            x: [0, 5, 0, -5, 0],
          },
          transition: { ...baseTransition, duration: 5 },
        };
      
      case "tail-swish":
        return {
          animate: {
            rotateZ: [0, 1, -1, 1, 0],
            scale: [1, 1.005, 1, 1.003, 1],
          },
          transition: { ...baseTransition, duration: 3 },
        };
      
      default:
        return {
          animate: {
            scale: [1, 1.01, 1],
          },
          transition: { ...baseTransition, duration: 3 },
        };
    }
  };

  // Get personality-based subtle overlay animation
  const getPersonalityOverlay = (): MotionVariant | null => {
    const baseTransition = {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as Easing,
    };

    switch (personality) {
      case "happy":
        return {
          animate: {
            scale: [1, 1.02, 1],
          },
          transition: { ...baseTransition, duration: 2 },
        };
      
      case "sleepy":
        return {
          animate: {
            opacity: [1, 0.95, 1],
          },
          transition: { ...baseTransition, duration: 4 },
        };
      
      case "curious":
        return {
          animate: {
            scale: [1, 1.02, 1, 1.015, 1],
          },
          transition: { ...baseTransition, duration: 3 },
        };
      
      case "playful":
        return {
          animate: {
            rotate: [0, 0.5, -0.5, 0.3, 0],
            scale: [1, 1.01, 1.02, 1.01, 1],
          },
          transition: { ...baseTransition, duration: 2.5 },
        };
      
      case "royal":
        return {
          animate: {
            scale: [1, 1.01, 1],
          },
          transition: { ...baseTransition, duration: 5 },
        };
      
      case "shy":
        return {
          animate: {
            x: [0, -2, 0, 1, 0],
            opacity: [1, 0.98, 1],
          },
          transition: { ...baseTransition, duration: 4 },
        };
      
      default:
        return null;
    }
  };

  const motionVariants = getMotionVariants();
  const personalityOverlay = getPersonalityOverlay();

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Subtle ambient glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-amber-500/10 opacity-50"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main animated image container */}
      <motion.div
        className="relative z-10"
        animate={motionVariants.animate}
        transition={motionVariants.transition}
      >
        <motion.img
          src={imageUrl}
          alt="Retrato Vivo"
          className="w-full h-auto rounded-2xl shadow-2xl"
          animate={personalityOverlay?.animate}
          transition={personalityOverlay?.transition}
          style={{ transformOrigin: "center center" }}
        />
      </motion.div>

      {/* Sparkle effects for magical feel */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        animate={{
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <motion.div 
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full shadow-lg shadow-white/80"
          animate={{ scale: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-amber-300 rounded-full shadow-lg"
          animate={{ scale: [0.7, 1.2, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-white rounded-full shadow-lg shadow-white/80"
          animate={{ scale: [0.6, 1.1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
        />
      </motion.div>

      {/* Frame border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-amber-500/40 pointer-events-none z-30"
        animate={{
          boxShadow: [
            "0 0 20px 0 rgba(245, 158, 11, 0.2)",
            "0 0 40px 5px rgba(245, 158, 11, 0.4)",
            "0 0 20px 0 rgba(245, 158, 11, 0.2)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Magic particles floating */}
      <motion.div
        className="absolute top-0 left-1/2 w-1 h-1 bg-amber-400 rounded-full z-20"
        animate={{
          y: [0, -30, 0],
          x: [-10, 10, -10],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-1 h-1 bg-white rounded-full z-20"
        animate={{
          y: [0, -40, 0],
          x: [0, -15, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

export default LivingPortrait;
