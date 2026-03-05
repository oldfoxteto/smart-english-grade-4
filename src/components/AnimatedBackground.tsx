import { Box } from '@mui/material';
import { motion } from 'framer-motion';

// Generate some random shapes for the background
const shapes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 40 + 20, // 20px to 60px
    x: Math.random() * 100, // 0 to 100vw
    y: Math.random() * 100, // 0 to 100vh
    duration: Math.random() * 20 + 10, // 10s to 30s
    delay: Math.random() * 5,
    type: Math.random() > 0.5 ? 'circle' : 'star',
}));

const StarPattern = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFC107" style={{ opacity: 0.15 }}>
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
);

const AnimatedBackground = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                overflow: 'hidden',
                pointerEvents: 'none',
                background: 'linear-gradient(135deg, #F9FBE7 0%, #E8F5E9 100%)', // Subtle premium gradient
            }}
        >
            {shapes.map((shape) => (
                <motion.div
                    key={shape.id}
                    initial={{
                        x: `${shape.x}vw`,
                        y: `${shape.y}vh`,
                        opacity: 0,
                        scale: 0.5,
                    }}
                    animate={{
                        y: [`${shape.y}vh`, `${shape.y - 20}vh`, `${shape.y + 10}vh`, `${shape.y}vh`],
                        x: [`${shape.x}vw`, `${shape.x + 10}vw`, `${shape.x - 5}vw`, `${shape.x}vw`],
                        opacity: [0.1, 0.3, 0.1],
                        scale: [0.8, 1.2, 0.8],
                        rotate: shape.type === 'star' ? [0, 180, 360] : 0,
                    }}
                    transition={{
                        duration: shape.duration,
                        repeat: Infinity,
                        delay: shape.delay,
                        ease: "easeInOut",
                    }}
                    style={{
                        position: 'absolute',
                        width: shape.size,
                        height: shape.size,
                        borderRadius: shape.type === 'circle' ? '50%' : '0',
                        backgroundColor: shape.type === 'circle' ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                    }}
                >
                    {shape.type === 'star' && <StarPattern size={shape.size} />}
                </motion.div>
            ))}

            {/* Adding some glowing orbs in the corners for a richer feel */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '50vw',
                    height: '50vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139,195,74,0.15) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(40px)',
                }}
            />

            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                style={{
                    position: 'absolute',
                    bottom: '-20%',
                    right: '-10%',
                    width: '60vw',
                    height: '60vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(33,150,243,0.1) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(60px)',
                }}
            />
        </Box>
    );
};

export default AnimatedBackground;
