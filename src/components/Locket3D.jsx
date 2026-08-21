import { useEffect, useRef } from 'react';
import { initLocket } from '../lib/locket3d';

export default function Locket3D({ swatchColor, ambientParticles = false, interactive = true, className, style }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const instance = initLocket(canvasRef.current, { swatchColor, ambientParticles, interactive });
    return () => instance.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swatchColor, ambientParticles, interactive]);

  return <canvas ref={canvasRef} className={className} style={style} />;
}
