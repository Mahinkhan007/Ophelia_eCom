import { useEffect, useRef } from 'react';

export default function MiniLocket({ color }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height, cx = w / 2, cy = h / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#C17E82'; ctx.beginPath(); ctx.arc(cx, cy, 52, 0, 7); ctx.fill();
    ctx.fillStyle = '#B98D8A'; ctx.beginPath(); ctx.arc(cx, cy, 44, 0, 7); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, 7); ctx.fill();
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, 7); ctx.fill();
  }, [color]);

  return <canvas ref={ref} width={90} height={90} style={{ width: 44, height: 44 }} />;
}
