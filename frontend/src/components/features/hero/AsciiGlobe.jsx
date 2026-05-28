import { useMemo } from 'react';
import './AsciiGlobe.css';

const AsciiGlobe = () => {
  const chars = ['+', '|', 'T', '—', '.', '_', ',', '1', '0'];
  const particleCount = 280;
  
  const particles = useMemo(() => {
    const items = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    
    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // y from 1 to -1
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      
      // Calculate opacity from z-depth
      const zNorm = (z + 1) / 2; // 0 to 1
      
      items.push({
        x: x * 200, // Sphere radius
        y: y * 200,
        z: z * 200,
        char: chars[Math.floor(Math.random() * chars.length)],
        opacity: 0.1 + (zNorm * 0.9), // Darker/fade in back, fully opaque in front
        scale: 0.5 + (zNorm * 0.5) // Slightly smaller in back
      });
    }
    return items;
  }, []);

  return (
    <div className="ascii-globe-wrapper">
      <div className="globe-container">
        {particles.map((p, i) => (
          <span
            key={i}
            className="globe-particle"
            style={{
              transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px) scale(${p.scale})`,
              opacity: p.opacity
            }}
          >
            {p.char}
          </span>
        ))}
      </div>
      <div className="globe-fade-mask"></div>
    </div>
  );
};

export default AsciiGlobe;
