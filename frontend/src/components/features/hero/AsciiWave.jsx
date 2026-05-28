import { useState, useEffect, useRef } from 'react';
import './AsciiWave.css';

const AsciiWave = () => {
    const chars = ['.', ',', '~', '=', '*', '#', '@'];
    const rows = 18;
    const cols = 28;
    const spacing = 22;
    
    // Create static grid data
    const particles = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            particles.push({
                r,
                c,
                x: (c - cols / 2) * spacing,
                z: (r - rows / 2) * spacing,
                charIndex: Math.floor(Math.random() * chars.length)
            });
        }
    }

    const [wavePoints, setWavePoints] = useState(particles);
    const requestRef = useRef();
    const timeRef = useRef(0);

    const animate = (time) => {
        timeRef.current += 0.02;
        const t = timeRef.current;

        setWavePoints(prev => prev.map(p => {
            // Composite wave: sin(x) + cos(z) + moving frequencies
            const y = Math.sin(p.x * 0.01 + t) * 20 + 
                      Math.cos(p.z * 0.01 + t * 0.8) * 20 +
                      Math.sin((p.x + p.z) * 0.005 + t * 0.5) * 15;
            
            // Map character to height
            const heightFactor = (y + 55) / 110; // 0 to 1 approx
            const charIdx = Math.floor(heightFactor * (chars.length - 1));
            
            return {
                ...p,
                y,
                char: chars[charIdx],
                opacity: 0.2 + heightFactor * 0.8,
                scale: 0.8 + heightFactor * 0.4
            };
        }));

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <div className="ascii-wave-wrapper">
            <div className="wave-container">
                {wavePoints.map((p, i) => (
                    <span
                        key={i}
                        className="wave-particle"
                        style={{
                            transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px) scale(${p.scale})`,
                            opacity: p.opacity
                        }}
                    >
                        {p.char}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AsciiWave;
