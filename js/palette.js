/* ==========================================================================
   Focus Town - Color Palettes & 3D Isometric Math Module
   ========================================================================== */

export const PALETTES = {
  grass:      { top: '#7BA38A', left: '#50725E', right: '#6C937A' },
  stone:      { top: '#909A96', left: '#6E7673', right: '#7F8A85' },
  wood:       { top: '#8B7E74', left: '#5E5249', right: '#72645B' },
  cream:      { top: '#F0EAE1', left: '#C4B7A5', right: '#DDD5C9' },
  terracotta: { top: '#C88A75', left: '#965A46', right: '#AF705D' },
  fire:       { top: '#FF9E2C', left: '#D66D00', right: '#EB8615' },
  ruin:       { top: '#76857C', left: '#505C55', right: '#617066' },
  yellow:     { top: '#F4D068', left: '#C29F38', right: '#DCB84E' },
  glass:      { top: '#D9E8E3', left: '#9BB8AF', right: '#B5CDC5' },
  darkwood:   { top: '#5A4A42', left: '#382B24', right: '#493931' },
  chibiShirt: { top: '#D32F2F', left: '#9A0007', right: '#FF6659' },
  chibiSkin:  { top: '#FFE082', left: '#FFD54F', right: '#FFF9C4' },
  chibiPants: { top: '#1976D2', left: '#004BA0', right: '#63A4FF' },
  chibiHair:  { top: '#5D4037', left: '#3E2723', right: '#8D6E63' },
  chibi2Shirt:{ top: '#2E7D32', left: '#1B5E20', right: '#4CAF50' },
  chibi2Pants:{ top: '#455A64', left: '#263238', right: '#607D8B' },
  chibi2Hair: { top: '#FBC02D', left: '#F57F17', right: '#FFF176' }
};

export function project(x, y, z) {
  const scale = 1.35;
  const cx = 160, cy = 175;
  return {
    x: cx + (x - y) * 12 * scale,
    y: cy + (x + y) * 6.93 * scale - z * 12.0 * scale
  };
}

export function drawIsoBox(x, y, z, w, l, h, colorKey, opacity = 1) {
  const pal = PALETTES[colorKey] || PALETTES.stone;
  const p0 = project(x, y, z),       p1 = project(x+w, y, z);
  const p2 = project(x+w, y+l, z),   p3 = project(x, y+l, z);
  const p4 = project(x, y, z+h),     p5 = project(x+w, y, z+h);
  const p6 = project(x+w, y+l, z+h), p7 = project(x, y+l, z+h);

  const topPath   = `M ${p4.x},${p4.y} L ${p5.x},${p5.y} L ${p6.x},${p6.y} L ${p7.x},${p7.y} Z`;
  const leftPath  = `M ${p1.x},${p1.y} L ${p2.x},${p2.y} L ${p6.x},${p6.y} L ${p5.x},${p5.y} Z`;
  const rightPath = `M ${p3.x},${p3.y} L ${p2.x},${p2.y} L ${p6.x},${p6.y} L ${p7.x},${p7.y} Z`;
  return `
    <g class="iso-layer" style="opacity: ${opacity}">
      <path d="${leftPath}"  fill="${pal.left}" />
      <path d="${rightPath}" fill="${pal.right}" />
      <path d="${topPath}"   fill="${pal.top}" />
    </g>`;
}

export function drawIsoRect(x, y, z, w, h, face, color, opacity = 1) {
  let p0, p1, p2, p3;
  if (face === 'right') {
    p0 = project(x, y, z);   p1 = project(x, y+w, z);
    p2 = project(x, y+w, z+h); p3 = project(x, y, z+h);
  } else {
    p0 = project(x, y, z);   p1 = project(x+w, y, z);
    p2 = project(x+w, y, z+h); p3 = project(x, y, z+h);
  }
  const path = `M ${p0.x},${p0.y} L ${p1.x},${p1.y} L ${p2.x},${p2.y} L ${p3.x},${p3.y} Z`;
  return `<path class="iso-layer" d="${path}" fill="${color}" style="opacity: ${opacity}" />`;
}
