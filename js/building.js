/* ==========================================================================
   Focus Town - Isometric Building Assets & Chibi Character Module
   ========================================================================== */

import { project, drawIsoBox, drawIsoRect } from './palette.js';

export function drawScaffolding(x, y, z, w, l, h) {
  const p0 = project(x, y, z), p1 = project(x + w, y, z), p2 = project(x + w, y + l, z), p3 = project(x, y + l, z);
  const p4 = project(x, y, z + h), p5 = project(x + w, y, z + h), p6 = project(x + w, y + l, z + h), p7 = project(x, y + l, z + h);
  const color = '#A88C7D';
  return `
    <g class="iso-layer" stroke="${color}" stroke-width="1.5" fill="none" opacity="0.7">
      <line x1="${p0.x}" y1="${p0.y}" x2="${p4.x}" y2="${p4.y}" class="scaffold-line" />
      <line x1="${p1.x}" y1="${p1.y}" x2="${p5.x}" y2="${p5.y}" class="scaffold-line" />
      <line x1="${p2.x}" y1="${p2.y}" x2="${p6.x}" y2="${p6.y}" class="scaffold-line" />
      <line x1="${p3.x}" y1="${p3.y}" x2="${p7.x}" y2="${p7.y}" class="scaffold-line" />
      <polygon points="${p4.x},${p4.y} ${p5.x},${p5.y} ${p6.x},${p6.y} ${p7.x},${p7.y}" stroke-dasharray="3,3" />
      <polygon points="${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" stroke-dasharray="3,3" />
      <line x1="${p4.x}" y1="${p4.y}" x2="${p6.x}" y2="${p6.y}" stroke-dasharray="3,3" />
      <line x1="${p5.x}" y1="${p5.y}" x2="${p7.x}" y2="${p7.y}" stroke-dasharray="3,3" />
    </g>`;
}

export function drawNightSky() {
  // Dark backdrop with stars, rendered as absolute pixel coordinates inside SVG
  const stars = [
    [25, 18], [60, 10], [100, 22], [145, 8], [185, 14], [225, 20], [265, 11], [295, 19],
    [42, 40], [88, 35], [130, 45], [175, 32], [215, 42], [255, 38], [285, 44],
    [15, 60], [70, 55], [118, 62], [160, 50], [200, 58], [245, 52], [305, 60],
    [33, 80], [95, 78], [140, 85], [190, 74], [238, 81],
    [50, 100], [110, 95], [158, 105], [210, 98], [270, 103]
  ];
  const brightStars = [[60, 10], [185, 14], [130, 45], [245, 52], [140, 85]];
  const brightSet = new Set(brightStars.map(s => `${s[0]},${s[1]}`));

  // 1. Sky Background Rect (Gradient)
  let code = `<rect width="320" height="320" fill="url(#sky-gradient)" />`;

  // 2. Draw constellation connectors
  code += `<g stroke="rgba(180,200,255,0.12)" stroke-width="0.7" stroke-dasharray="2,3" fill="none">
            <line x1="60" y1="10" x2="130" y2="45" />
            <line x1="130" y1="45" x2="185" y2="14" />
            <line x1="185" y1="14" x2="245" y2="52" />
            <line x1="245" y1="52" x2="140" y2="85" />
          </g>`;

  // 3. Draw stars
  stars.forEach(([sx, sy]) => {
    const key = `${sx},${sy}`;
    const r = brightSet.has(key) ? 2.2 : 1.1;
    const opacity = brightSet.has(key) ? 0.95 : (0.4 + Math.random() * 0.45);
    const delay = (sx * 0.037 + sy * 0.051).toFixed(2);
    const dur = (1.8 + (sx % 5) * 0.4).toFixed(1);
    if (brightSet.has(key)) {
      code += `<circle cx="${sx}" cy="${sy}" r="${r}" fill="#FFF9E3" class="star-bright" style="animation: pulseStar ${dur}s infinite alternate; animation-delay: ${delay}s;" />`;
      code += `<circle cx="${sx}" cy="${sy}" r="${r * 2.5}" fill="rgba(255,248,210,0.12)" />`;
    } else {
      code += `<circle cx="${sx}" cy="${sy}" r="${r}" fill="white" opacity="${opacity.toFixed(2)}" class="star-dim" style="animation: pulseStar ${dur}s infinite alternate; animation-delay: ${delay}s;" />`;
    }
  });

  // 4. Distant Mountains/Hills Silhouettes
  code += `<path d="M 0,165 Q 60,150 120,160 T 240,155 T 320,162 L 320,320 L 0,320 Z" fill="#121824" opacity="0.9" />`;
  code += `<path d="M 0,175 Q 90,160 170,170 T 320,168 L 320,320 L 0,320 Z" fill="#1b2436" />`;

  // 5. Full-frame Grass Ground
  code += `<path d="M 0,185 L 320,185 L 320,320 L 0,320 Z" fill="#354b3e" />`;

  // 6. Winding River at bottom-left corner
  code += `<!-- River bank shadow -->
           <path d="M 0,265 C 45,265 65,285 90,285 C 115,285 125,305 135,320" fill="none" stroke="#25352c" stroke-width="2.5" />
           <!-- Water body -->
           <path d="M 0,265 C 45,265 65,285 90,285 C 115,285 125,305 135,320 L 0,320 Z" fill="url(#water-gradient)" />
           <!-- Foam lines -->
           <path d="M 0,270 C 40,270 60,290 85,290 C 110,290 120,310 130,320" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="10,15" />
           <path d="M 0,260 C 50,260 70,280 95,280 C 120,280 130,300 140,320" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.8" />`;

  // 7. Rocks at bottom-left
  code += `<!-- River stones -->
           <ellipse cx="65" cy="275" rx="7" ry="4" fill="#5E6864" stroke="#48514E" stroke-width="0.5" />
           <ellipse cx="63" cy="274" rx="4" ry="2" fill="#75827D" opacity="0.6" />
           <ellipse cx="90" cy="310" rx="9" ry="5.5" fill="#4B5350" stroke="#363C3A" stroke-width="0.5" />
           <ellipse cx="88" cy="308" rx="5" ry="2.5" fill="#65706C" opacity="0.6" />
           <ellipse cx="40" cy="305" rx="8" ry="5" fill="#545D5A" stroke="#3D4442" stroke-width="0.5" />
           <ellipse cx="38" cy="303" rx="4" ry="2" fill="#6E7B77" opacity="0.6" />`;

  return code;
}

export function drawTent(x, y, z, w, l, h, state = 'working') {
  const pL0 = project(x, y, z), pR0 = project(x + w, y, z), pL1 = project(x, y + l, z), pR1 = project(x + w, y + l, z);
  const pPeak0 = project(x + w / 2, y, z + h), pPeak1 = project(x + w / 2, y + l, z + h);

  // Symmetrically corrected Peg points at top-centers of the peg boxes (z + 0.15 peg height)
  const pgL0 = project(x - 0.075, y - 0.075, z + 0.15);
  const pgR0 = project(x + w + 0.075, y - 0.075, z + 0.15);
  const pgR1 = project(x + w + 0.075, y + l + 0.075, z + 0.15);
  const pgL1 = project(x - 0.075, y + l + 0.075, z + 0.15);

  // Door opening points showing warm glowing interior
  const pDoorLeftOpen = project(x + w * 0.38, y + l, z);
  const pDoorRightOpen = project(x + w * 0.62, y + l, z);

  // Soft drop shadow underneath the tent base
  const shadowPoints = `${pL0.x},${pL0.y} ${pR0.x},${pR0.y} ${pR1.x},${pR1.y} ${pL1.x},${pL1.y}`;

  let code = `
    <g class="iso-layer">
      <!-- Ambient Shadow -->
      <polygon points="${shadowPoints}" fill="rgba(0, 0, 0, 0.18)" />

      <!-- Guy Lines (Dây neo) - Symmetrically anchored -->
      <g stroke="#615B55" stroke-width="0.8" opacity="0.7" fill="none">
        <line x1="${pL0.x}" y1="${pL0.y}" x2="${pgL0.x}" y2="${pgL0.y}" />
        <line x1="${pR0.x}" y1="${pR0.y}" x2="${pgR0.x}" y2="${pgR0.y}" />
        <line x1="${pR1.x}" y1="${pR1.y}" x2="${pgR1.x}" y2="${pgR1.y}" />
        <line x1="${pL1.x}" y1="${pL1.y}" x2="${pgL1.x}" y2="${pgL1.y}" />
      </g>

      <!-- Tent Fabric Shapes -->
      <!-- Back face -->
      <path d="M ${pL0.x},${pL0.y} L ${pR0.x},${pR0.y} L ${pPeak0.x},${pPeak0.y} Z" fill="#8D4C3A" />
      <!-- Left fabric panel -->
      <path d="M ${pL0.x},${pL0.y} L ${pL1.x},${pL1.y} L ${pPeak1.x},${pPeak1.y} L ${pPeak0.x},${pPeak0.y} Z" fill="#AF705D" />
      <!-- Right fabric panel -->
      <path d="M ${pR0.x},${pR0.y} L ${pR1.x},${pR1.y} L ${pPeak1.x},${pPeak1.y} L ${pPeak0.x},${pPeak0.y} Z" fill="#C88A75" stroke="#9E6150" stroke-width="0.3" />
      <!-- Campfire warm light cast onto right panel (phản chiếu ánh lửa trại) -->
      <path d="M ${pR0.x},${pR0.y} L ${pR1.x},${pR1.y} L ${pPeak1.x},${pPeak1.y} L ${pPeak0.x},${pPeak0.y} Z" fill="url(#firecast)" />

      <!-- === COZY 3D INTERIOR (Visible through opening) === -->
      <!-- Inside floor mat -->
      <polygon points="${pL0.x},${pL0.y} ${pR0.x},${pR0.y} ${pR1.x},${pR1.y} ${pL1.x},${pL1.y}" fill="#4E342E" />
      <!-- Inside back wall -->
      <polygon points="${pL0.x},${pL0.y} ${pR0.x},${pR0.y} ${pPeak0.x},${pPeak0.y}" fill="#5C3127" />
      <!-- Inside left wall -->
      <polygon points="${pL0.x},${pL0.y} ${pL1.x},${pL1.y} ${pPeak1.x},${pPeak1.y} ${pPeak0.x},${pPeak0.y}" fill="#6E3C32" />
  `;

  // Draw cozy sleeping mat & bags inside if size is large enough (to avoid cluttering welcome hero micro-tents)
  if (w >= 3) {
    // Sleeping mat
    const pMat0 = project(x + w * 0.15, y + l * 0.2, z + 0.02);
    const pMat1 = project(x + w * 0.15, y + l * 0.7, z + 0.02);
    const pMat2 = project(x + w * 0.85, y + l * 0.7, z + 0.02);
    const pMat3 = project(x + w * 0.85, y + l * 0.2, z + 0.02);
    code += `<polygon points="${pMat0.x},${pMat0.y} ${pMat1.x},${pMat1.y} ${pMat2.x},${pMat2.y} ${pMat3.x},${pMat3.y}" fill="#00796B" stroke="#004D40" stroke-width="0.3" />`;
    
    // Sleeping mat stripes
    const pStripe0 = project(x + w * 0.35, y + l * 0.2, z + 0.03);
    const pStripe1 = project(x + w * 0.35, y + l * 0.7, z + 0.03);
    const pStripe2 = project(x + w * 0.45, y + l * 0.7, z + 0.03);
    const pStripe3 = project(x + w * 0.45, y + l * 0.2, z + 0.03);
    code += `<polygon points="${pStripe0.x},${pStripe0.y} ${pStripe1.x},${pStripe1.y} ${pStripe2.x},${pStripe2.y} ${pStripe3.x},${pStripe3.y}" fill="#4DB6AC" />`;
    
    const pStripe4 = project(x + w * 0.55, y + l * 0.2, z + 0.03);
    const pStripe5 = project(x + w * 0.55, y + l * 0.7, z + 0.03);
    const pStripe6 = project(x + w * 0.65, y + l * 0.7, z + 0.03);
    const pStripe7 = project(x + w * 0.65, y + l * 0.2, z + 0.03);
    code += `<polygon points="${pStripe4.x},${pStripe4.y} ${pStripe5.x},${pStripe5.y} ${pStripe6.x},${pStripe6.y} ${pStripe7.x},${pStripe7.y}" fill="#4DB6AC" />`;

    // Sleeping bags
    code += drawIsoBox(x + w * 0.2, y + l * 0.25, z + 0.04, w * 0.25, l * 0.4, 0.1, 'terracotta');
    code += drawIsoBox(x + w * 0.52, y + l * 0.25, z + 0.04, w * 0.25, l * 0.4, 0.1, 'yellow');
    
    // Pillows
    code += drawIsoBox(x + w * 0.22, y + l * 0.27, z + 0.14, w * 0.21, l * 0.1, 0.06, 'cream');
    code += drawIsoBox(x + w * 0.54, y + l * 0.27, z + 0.14, w * 0.21, l * 0.1, 0.06, 'cream');

    // Lying sleeping chibis inside the tent (only in sleeping state)
    if (state === 'sleeping') {
      const cx1 = x + w * 0.22, cy1 = y + l * 0.27, cz1 = z + 0.1;
      code += drawIsoBox(cx1, cy1, cz1, 0.25, 0.25, 0.25, 'chibiSkin');
      code += drawIsoBox(cx1 - 0.015, cy1 - 0.015, cz1 + 0.18, 0.28, 0.28, 0.1, 'chibiHair');
      code += drawIsoBox(cx1, cy1 + 0.25, cz1, 0.25, 0.35, 0.14, 'chibiShirt');
      const pEye1_1 = project(cx1 + 0.06, cy1 + 0.25, cz1 + 0.12);
      const pEye1_2 = project(cx1 + 0.19, cy1 + 0.25, cz1 + 0.12);
      code += `<line x1="${pEye1_1.x - 1.2}" y1="${pEye1_1.y}" x2="${pEye1_1.x + 1.2}" y2="${pEye1_1.y + 0.6}" stroke="#3C3633" stroke-width="0.8" stroke-linecap="round" />
               <line x1="${pEye1_2.x - 1.2}" y1="${pEye1_2.y}" x2="${pEye1_2.x + 1.2}" y2="${pEye1_2.y + 0.6}" stroke="#3C3633" stroke-width="0.8" stroke-linecap="round" />`;

      const cx2 = x + w * 0.54, cy2 = y + l * 0.27, cz2 = z + 0.1;
      code += drawIsoBox(cx2, cy2, cz2, 0.25, 0.25, 0.25, 'chibiSkin');
      code += drawIsoBox(cx2 - 0.015, cy2 - 0.015, cz2 + 0.18, 0.28, 0.28, 0.1, 'chibi2Hair');
      code += drawIsoBox(cx2, cy2 + 0.25, cz2, 0.25, 0.35, 0.14, 'chibi2Shirt');
      const pEye2_1 = project(cx2 + 0.06, cy2 + 0.25, cz2 + 0.12);
      const pEye2_2 = project(cx2 + 0.19, cy2 + 0.25, cz2 + 0.12);
      code += `<line x1="${pEye2_1.x - 1.2}" y1="${pEye2_1.y}" x2="${pEye2_1.x + 1.2}" y2="${pEye2_1.y + 0.6}" stroke="#3C3633" stroke-width="0.8" stroke-linecap="round" />
               <line x1="${pEye2_2.x - 1.2}" y1="${pEye2_2.y}" x2="${pEye2_2.x + 1.2}" y2="${pEye2_2.y + 0.6}" stroke="#3C3633" stroke-width="0.8" stroke-linecap="round" />`;
    }

    // Hanging Lantern
    const pLantern = project(x + w / 2, y + l * 0.6, z + h - 0.88);
    const pRidgeCenter = project(x + w / 2, y + l * 0.6, z + h);
    code += `
      <g stroke="#3C3633" stroke-width="0.8" fill="none">
        <line x1="${pRidgeCenter.x}" y1="${pRidgeCenter.y}" x2="${pLantern.x}" y2="${pLantern.y - 4}" />
      </g>
    `;
    code += drawIsoBox(x + w/2 - 0.08, y + l*0.6 - 0.08, z + h - 0.8, 0.16, 0.16, 0.06, 'darkwood');
    code += drawIsoBox(x + w/2 - 0.06, y + l*0.6 - 0.06, z + h - 0.94, 0.12, 0.12, 0.14, 'yellow');
    code += `<circle cx="${pLantern.x}" cy="${pLantern.y}" r="22" fill="url(#lantern-glow)" />`;
  }

  code += `
      <!-- Door Opening Warm Interior Glow Overlay (for color blending) -->
      <polygon points="${pL1.x},${pL1.y} ${pR1.x},${pR1.y} ${pPeak1.x},${pPeak1.y}" fill="#FFE082" opacity="0.12" />

      <!-- Left Flap Door (partially open) -->
      <path d="M ${pL1.x},${pL1.y} L ${pDoorLeftOpen.x},${pDoorLeftOpen.y} L ${pPeak1.x},${pPeak1.y} Z" fill="#A66351" opacity="0.95" />
      <!-- Right Flap Door with fire cast overlay -->
      <path d="M ${pR1.x},${pR1.y} L ${pDoorRightOpen.x},${pDoorRightOpen.y} L ${pPeak1.x},${pPeak1.y} Z" fill="#B87563" opacity="0.95" stroke="#905342" stroke-width="0.5" />
      <path d="M ${pR1.x},${pR1.y} L ${pDoorRightOpen.x},${pDoorRightOpen.y} L ${pPeak1.x},${pPeak1.y} Z" fill="url(#firecast)" opacity="0.45" />

      <!-- Zipper seam details -->
      <g stroke="#5C3127" stroke-width="0.8" opacity="0.8">
        <line x1="${pPeak1.x}" y1="${pPeak1.y}" x2="${pDoorLeftOpen.x}" y2="${pDoorLeftOpen.y}" />
        <line x1="${pPeak1.x}" y1="${pPeak1.y}" x2="${pDoorRightOpen.x}" y2="${pDoorRightOpen.y}" />
      </g>

      <!-- Fairy Lights wire (Dây đèn trang trí nhấp nháy) -->
      <path d="M ${pL1.x},${pL1.y} Q ${(pL1.x + pPeak1.x) / 2},${(pL1.y + pPeak1.y) / 2 + 4} ${pPeak1.x},${pPeak1.y} Q ${(pR1.x + pPeak1.x) / 2},${(pR1.y + pPeak1.y) / 2 + 4} ${pR1.x},${pR1.y}" fill="none" stroke="rgba(255, 220, 80, 0.4)" stroke-width="0.6" />
  `;

  // Draw glowing warm fairy light beads along the wire (parabolic sag)
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const sag = Math.sin(t * Math.PI) * 3.5;
    // Left half: L1 -> Peak1
    const xL = pL1.x + (pPeak1.x - pL1.x) * t;
    const yL = pL1.y + (pPeak1.y - pL1.y) * t + sag;
    code += `<circle cx="${xL}" cy="${yL}" r="2.2" fill="#FFE082" stroke="#FF8F00" stroke-width="0.4" class="fairy-light" style="animation: pulseLight 1.2s infinite alternate; animation-delay: ${i * 0.18}s;" />`;

    if (i > 0) { // avoid duplicate at peak
      // Right half: Peak1 -> R1
      const sag2 = Math.sin((1 - t) * Math.PI) * 3.5;
      const xR = pPeak1.x + (pR1.x - pPeak1.x) * t;
      const yR = pPeak1.y + (pR1.y - pPeak1.y) * t + sag2;
      code += `<circle cx="${xR}" cy="${yR}" r="2.2" fill="#FFE082" stroke="#FF8F00" stroke-width="0.4" class="fairy-light" style="animation: pulseLight 1.2s infinite alternate; animation-delay: ${i * 0.14}s;" />`;
    }
  }

  code += `</g>`;
  return code;
}


export function drawCampfire(x, y, z) {
  const p = project(x, y, z);
  let c = `<g class="iso-layer">`;

  // Ground Warm Glow beneath campfire (Flickering!)
  c += `<ellipse cx="${p.x}" cy="${p.y}" rx="20" ry="11" fill="#FF8F00" opacity="0.25" class="glow-flicker" />
        <ellipse cx="${p.x}" cy="${p.y}" rx="12" ry="7" fill="#FFD54F" opacity="0.3" class="glow-flicker" />`;

  // Radial Logs (Spokes)
  // Diagonal logs drawn as thick lines
  const pDiag1 = project(x - 0.5, y - 0.5, z);
  const pDiag2 = project(x + 0.5, y + 0.5, z);
  const pDiag3 = project(x + 0.5, y - 0.5, z);
  const pDiag4 = project(x - 0.5, y + 0.5, z);
  c += `<g stroke="#382B24" stroke-width="4.5" stroke-linecap="round" opacity="0.95">
          <line x1="${pDiag1.x}" y1="${pDiag1.y}" x2="${pDiag2.x}" y2="${pDiag2.y}" />
          <line x1="${pDiag3.x}" y1="${pDiag3.y}" x2="${pDiag4.x}" y2="${pDiag4.y}" />
        </g>`;
  
  // Standard X and Y aligned logs
  c += drawIsoBox(x - 0.6, y, z, 1.2, 0.3, 0.22, 'darkwood');
  c += drawIsoBox(x, y - 0.6, z, 0.3, 1.2, 0.22, 'darkwood');

  // Decorative stones surrounding the fire
  c += drawIsoBox(x - 0.75, y - 0.75, z, 0.25, 0.25, 0.2, 'stone');
  c += drawIsoBox(x + 0.5, y - 0.75, z, 0.25, 0.25, 0.2, 'stone');
  c += drawIsoBox(x - 0.75, y + 0.5, z, 0.25, 0.25, 0.2, 'stone');
  c += drawIsoBox(x + 0.5, y + 0.5, z, 0.25, 0.25, 0.2, 'stone');

  // High-fidelity glowing flames (Flickering with class!)
  c += `<g class="flame-flicker">
          <circle cx="${p.x}" cy="${p.y - 4}" r="9.5" fill="#FF5252" opacity="0.85" />
          <circle cx="${p.x}" cy="${p.y - 4}" r="7.5" fill="#FF9E2C" opacity="0.9" />
          <circle cx="${p.x - 2}" cy="${p.y - 6}" r="5.0" fill="#FFD54F" opacity="0.95" />
          <circle cx="${p.x + 1}" cy="${p.y - 8}" r="2.8" fill="#FFFFFF" opacity="0.98" />
        </g>`;

  // Floating spark particles (Tàn lửa bay lơ lửng)
  c += `<circle cx="${p.x - 4}" cy="${p.y - 14}" r="1.2" fill="#FFE082" class="campfire-spark" style="animation: floatSpark 1.6s infinite; animation-delay: 0s;" />
        <circle cx="${p.x + 5}" cy="${p.y - 18}" r="0.9" fill="#FF9E2C" class="campfire-spark" style="animation: floatSpark 2.0s infinite; animation-delay: 0.4s;" />
        <circle cx="${p.x - 1}" cy="${p.y - 22}" r="1.3" fill="#FFD54F" class="campfire-spark" style="animation: floatSpark 1.3s infinite; animation-delay: 0.9s;" />`;

  c += `</g>`;
  return c;
}

export function drawPineTree(x, y, z) {
  let c = '';
  const pTrunk = project(x + 0.4, y + 0.4, z);
  // Soft ambient shadow under the tree
  c += `<g class="iso-layer"><ellipse cx="${pTrunk.x}" cy="${pTrunk.y}" rx="7.5" ry="4.2" fill="rgba(0, 0, 0, 0.15)" /></g>`;

  // Brown Trunk
  c += drawIsoBox(x + 0.3, y + 0.3, z, 0.2, 0.2, 0.7, 'darkwood');
  // Stacked Green Foliage layers
  c += drawIsoBox(x, y, z + 0.7, 0.8, 0.8, 0.55, 'grass');
  c += drawIsoBox(x + 0.1, y + 0.1, z + 1.25, 0.6, 0.6, 0.45, 'grass');
  c += drawIsoBox(x + 0.2, y + 0.2, z + 1.7, 0.4, 0.4, 0.35, 'grass');
  return c;
}

export function drawDeciduousTree(x, y, z) {
  let c = '';
  const pTrunk = project(x + 0.4, y + 0.4, z);
  // Soft ambient shadow under the tree
  c += `<g class="iso-layer"><ellipse cx="${pTrunk.x}" cy="${pTrunk.y}" rx="8.5" ry="4.8" fill="rgba(0, 0, 0, 0.16)" /></g>`;

  // Brown Trunk (taller than pine trunk)
  c += drawIsoBox(x + 0.3, y + 0.3, z, 0.2, 0.2, 1.2, 'darkwood');

  // Layered fluffy green canopy (using overlapping shaded ellipses)
  const pCanopy = project(x + 0.4, y + 0.4, z + 1.2);
  c += `
    <g class="iso-layer">
      <!-- Dark under-shadow of canopy -->
      <ellipse cx="${pCanopy.x}" cy="${pCanopy.y - 12}" rx="23" ry="18" fill="#50725E" />
      <!-- Mid-tone foliage -->
      <ellipse cx="${pCanopy.x - 4}" cy="${pCanopy.y - 15}" rx="18" ry="14" fill="#6C937A" />
      <ellipse cx="${pCanopy.x + 4}" cy="${pCanopy.y - 10}" rx="16" ry="12" fill="#6C937A" />
      <!-- Top highlight foliage -->
      <ellipse cx="${pCanopy.x - 2}" cy="${pCanopy.y - 18}" rx="13" ry="10" fill="#7BA38A" />
    </g>`;
  return c;
}

export function drawCampRug(x, y, z, w, l) {
  let c = '';
  // Terracotta rug base
  c += drawIsoBox(x, y, z, w, l, 0.04, 'terracotta');
  // Stylish yellow stripes
  c += drawIsoBox(x + 0.25, y, z + 0.04, 0.2, l, 0.01, 'yellow');
  c += drawIsoBox(x + w - 0.45, y, z + 0.04, 0.2, l, 0.01, 'yellow');

  // Tassels fringe details (Tua rua thảm dệt tinh xảo)
  const pL0 = project(x, y, z + 0.04), pL1 = project(x, y + l, z + 0.04);
  const pR0 = project(x + w, y, z + 0.04), pR1 = project(x + w, y + l, z + 0.04);

  c += `<g stroke="#DDD5C9" stroke-width="0.8" stroke-linecap="round" opacity="0.9">`;
  // Left border tassels
  for (let i = 0; i <= 5; i++) {
    const t = i / 5;
    const px0 = pL0.x + (pL1.x - pL0.x) * t;
    const py0 = pL0.y + (pL1.y - pL0.y) * t;
    c += `<line x1="${px0}" y1="${py0}" x2="${px0 - 2.5}" y2="${py0 + 1.5}" />`;
  }
  // Right border tassels
  for (let i = 0; i <= 5; i++) {
    const t = i / 5;
    const px0 = pR0.x + (pR1.x - pR0.x) * t;
    const py0 = pR0.y + (pR1.y - pR0.y) * t;
    c += `<line x1="${px0}" y1="${py0}" x2="${px0 + 2.5}" y2="${py0 - 1.5}" />`;
  }
  c += `</g>`;
  return c;
}

export function drawTentPegs(x, y, z, w, l) {
  let c = '';
  c += drawIsoBox(x - 0.15, y - 0.15, z, 0.15, 0.15, 0.15, 'stone');
  c += drawIsoBox(x + w, y - 0.15, z, 0.15, 0.15, 0.15, 'stone');
  c += drawIsoBox(x + w, y + l, z, 0.15, 0.15, 0.15, 'stone');
  c += drawIsoBox(x - 0.15, y + l, z, 0.15, 0.15, 0.15, 'stone');
  return c;
}

export function drawTentChest(x, y, z) {
  let c = '';
  c += drawIsoBox(x, y, z, 0.7, 0.5, 0.45, 'wood');
  c += drawIsoBox(x + 0.3, y + 0.46, z + 0.15, 0.1, 0.05, 0.15, 'stone');
  return c;
}

export function drawTentStools(x, y, z) {
  let c = '';
  c += drawIsoBox(x, y, z, 0.4, 0.4, 0.35, 'wood');
  c += drawIsoBox(x + 0.6, y - 0.3, z, 0.4, 0.4, 0.35, 'wood');
  return c;
}

export function drawTentFlag(x, y, z, h) {
  const pPoleBottom = project(x, y, z);
  const pPoleTop = project(x, y, z + h);
  const pFlagRight = project(x + 0.5, y, z + h - 0.3);
  const pFlagMid = project(x, y, z + h - 0.4);
  return `
    <g class="iso-layer" stroke="#5E5249" stroke-width="1.5" stroke-linecap="round">
      <line x1="${pPoleBottom.x}" y1="${pPoleBottom.y}" x2="${pPoleTop.x}" y2="${pPoleTop.y}" />
      <polygon points="${pPoleTop.x},${pPoleTop.y} ${pFlagRight.x},${pFlagRight.y} ${pFlagMid.x},${pFlagMid.y}" fill="#D32F2F" stroke="none" />
    </g>`;
}

export function drawTentFrame(x, y, z, w, l, h) {
  const pL0 = project(x, y, z), pR0 = project(x + w, y, z);
  const pL1 = project(x, y + l, z), pR1 = project(x + w, y + l, z);
  const pPeak0 = project(x + w / 2, y, z + h), pPeak1 = project(x + w / 2, y + l, z + h);
  return `
    <g class="iso-layer" stroke="#8B7E74" stroke-width="2" stroke-linecap="round" fill="none">
      <line x1="${pL0.x}" y1="${pL0.y}" x2="${pPeak0.x}" y2="${pPeak0.y}" />
      <line x1="${pR0.x}" y1="${pR0.y}" x2="${pPeak0.x}" y2="${pPeak0.y}" />
      <line x1="${pL1.x}" y1="${pL1.y}" x2="${pPeak1.x}" y2="${pPeak1.y}" />
      <line x1="${pR1.x}" y1="${pR1.y}" x2="${pPeak1.x}" y2="${pPeak1.y}" />
      <line x1="${pPeak0.x}" y1="${pPeak0.y}" x2="${pPeak1.x}" y2="${pPeak1.y}" />
      <line x1="${pL0.x}" y1="${pL0.y}" x2="${pL1.x}" y2="${pL1.y}" />
      <line x1="${pR0.x}" y1="${pR0.y}" x2="${pR1.x}" y2="${pR1.y}" />
    </g>`;
}

export function drawTentPartialTarp(x, y, z, w, l, h) {
  const pL0 = project(x, y, z), pR0 = project(x + w, y, z);
  const pPeak0 = project(x + w / 2, y, z + h);
  const pL1 = project(x, y + l / 2, z), pPeak1 = project(x + w / 2, y + l / 2, z + h / 2);
  let c = drawTentBackSheet(x, y, z, w, l, h);
  c += `
    <g class="iso-layer">
      <path d="M ${pL0.x},${pL0.y} L ${pL1.x},${pL1.y} L ${pPeak1.x},${pPeak1.y} L ${pPeak0.x},${pPeak0.y} Z" fill="#AF705D" opacity="0.8" />
    </g>`;
  return c;
}

export function drawSingleChibi(x, y, z, state, charType = 'worker1') {
  let code = '';
  const shirtKey = charType === 'worker1' ? 'chibiShirt' : 'chibi2Shirt';
  const pantsKey = charType === 'worker1' ? 'chibiPants' : 'chibi2Pants';
  const hairKey = charType === 'worker1' ? 'chibiHair' : 'chibi2Hair';
  const skinKey = 'chibiSkin';

  if (state === 'sleeping') {
    // Drawn resting sitting against a wood stump
    code += drawIsoBox(x, y, z, 0.65, 0.65, 0.45, 'wood'); // wood stump
    // Chibi legs hanging in front of the stump
    code += drawIsoBox(x + 0.1, y + 0.5, z, 0.15, 0.22, 0.45, pantsKey);
    code += drawIsoBox(x + 0.35, y + 0.5, z, 0.15, 0.22, 0.45, pantsKey);
    // Tiny shoes on the ground
    code += drawIsoBox(x + 0.1, y + 0.62, z, 0.15, 0.12, 0.1, 'stone');
    code += drawIsoBox(x + 0.35, y + 0.62, z, 0.15, 0.12, 0.1, 'stone');
    // Body & head
    code += drawIsoBox(x + 0.05, y + 0.05, z + 0.45, 0.55, 0.45, 0.7, shirtKey);
    code += drawIsoBox(x + 0.1, y + 0.1, z + 1.15, 0.45, 0.4, 0.45, skinKey);
    code += drawIsoBox(x + 0.08, y + 0.08, z + 1.6, 0.49, 0.44, 0.2, hairKey);

    const pEyeL = project(x + 0.15, y + 0.3, z + 1.35), pEyeR = project(x + 0.15, y + 0.12, z + 1.35);
    code += `<g class="iso-layer" stroke="#3C3633" stroke-width="1.5" stroke-linecap="round">
      <line x1="${pEyeL.x - 2.5}" y1="${pEyeL.y - 1}" x2="${pEyeL.x + 2.5}" y2="${pEyeL.y + 1}" />
      <line x1="${pEyeR.x - 2.5}" y1="${pEyeR.y - 1}" x2="${pEyeR.x + 2.5}" y2="${pEyeR.y + 1}" /></g>`;

    const pHead = project(x + 0.3, y + 0.3, z + 1.8);
    const delay = charType === 'worker1' ? '0s' : '1.2s';
    code += `<text x="${pHead.x + 10}" y="${pHead.y - 10}" class="chibi-zzz" style="animation-delay:${delay};">Zzz</text>
             <text x="${pHead.x + 18}" y="${pHead.y - 22}" class="chibi-zzz" style="animation-delay:${charType === 'worker1' ? '0.8s' : '2.0s'};">Zzz</text>`;

  } else if (state === 'sad') {
    // Sad / Sitting with head down
    code += drawIsoBox(x - 0.2, y - 0.2, z, 0.22, 0.22, 0.22, 'stone');
    code += drawIsoBox(x + 0.2, y - 0.2, z, 0.22, 0.22, 0.22, 'stone');
    code += drawIsoBox(x - 0.2, y - 0.1, z, 0.25, 0.5, 0.3, pantsKey);
    code += drawIsoBox(x + 0.2, y - 0.1, z, 0.25, 0.5, 0.3, pantsKey);
    code += drawIsoBox(x + 0.1, y + 0.1, z + 0.3, 0.5, 0.45, 0.7, shirtKey);
    code += drawIsoBox(x + 0.15, y + 0.15, z + 1.0, 0.4, 0.35, 0.45, skinKey);
    code += drawIsoBox(x + 0.13, y + 0.13, z + 1.45, 0.44, 0.39, 0.2, hairKey);

    const pEyeL = project(x + 0.15, y + 0.3, z + 1.2), pEyeR = project(x + 0.15, y + 0.12, z + 1.2);
    code += `<g class="iso-layer" stroke="#3C3633" stroke-width="1.2" fill="none" stroke-linecap="round">
      <path d="M ${pEyeL.x - 3},${pEyeL.y - 1.5} Q ${pEyeL.x},${pEyeL.y - 3.5} ${pEyeL.x + 3},${pEyeL.y - 1.5}" />
      <path d="M ${pEyeR.x - 3},${pEyeR.y - 1.5} Q ${pEyeR.x},${pEyeR.y - 3.5} ${pEyeR.x + 3},${pEyeR.y - 1.5}" /></g>
      <circle cx="${pEyeL.x - 2}" cy="${pEyeL.y + 2}" r="2" fill="#63A4FF" class="chibi-tear" />`;

  } else if (state === 'cheering') {
    // Jumping and cheering
    code += drawIsoBox(x - 0.1, y, z, 0.2, 0.2, 0.3, 'stone');
    code += drawIsoBox(x + 0.3, y, z, 0.2, 0.2, 0.3, 'stone');
    code += drawIsoBox(x - 0.1, y, z + 0.3, 0.2, 0.2, 0.4, pantsKey);
    code += drawIsoBox(x + 0.3, y, z + 0.3, 0.2, 0.2, 0.4, pantsKey);
    code += drawIsoBox(x, y - 0.05, z + 0.7, 0.45, 0.35, 0.8, shirtKey);
    code += drawIsoBox(x + 0.05, y - 0.02, z + 1.5, 0.38, 0.35, 0.45, skinKey);
    code += drawIsoBox(x + 0.03, y - 0.04, z + 1.95, 0.42, 0.38, 0.18, hairKey);

    const pEyeL = project(x + 0.05, y + 0.2, z + 1.75), pEyeR = project(x + 0.05, y + 0.02, z + 1.75), pMouth = project(x + 0.05, y + 0.1, z + 1.6);
    code += `<g class="iso-layer">
      <circle cx="${pEyeL.x}" cy="${pEyeL.y}" r="2" fill="#3C3633" />
      <circle cx="${pEyeR.x}" cy="${pEyeR.y}" r="2" fill="#3C3633" />
      <path d="M ${pMouth.x - 2.5},${pMouth.y} Q ${pMouth.x},${pMouth.y + 3.0} ${pMouth.x + 2.5},${pMouth.y}" stroke="#3C3633" stroke-width="1.2" fill="none" stroke-linecap="round" /></g>`;

    const pShoulderL = project(x, y - 0.1, z + 1.2), pShoulderR = project(x + 0.4, y - 0.1, z + 1.2);
    const pHandL = project(x - 0.15, y - 0.1, z + 1.8), pHandR = project(x + 0.6, y - 0.1, z + 1.8);
    const cheerDelay = charType === 'worker1' ? '0s' : '0.2s';

    if (charType === 'worker1') {
      code += `
        <g class="chibi-cheer" style="transform-origin:${pShoulderL.x}px ${pShoulderL.y}px; animation-delay:${cheerDelay};">
          <line x1="${pShoulderL.x}" y1="${pShoulderL.y}" x2="${pHandL.x}" y2="${pHandL.y}" stroke="#D32F2F" stroke-width="4.5" stroke-linecap="round" />
          <circle cx="${pHandL.x}" cy="${pHandL.y}" r="2.5" fill="#FFE082" />
          <line x1="${pHandL.x}" y1="${pHandL.y}" x2="${pHandL.x}" y2="${pHandL.y - 10}" stroke="#8B7E74" stroke-width="1.2" />
          <polygon points="${pHandL.x},${pHandL.y - 10} ${pHandL.x - 7},${pHandL.y - 7} ${pHandL.x},${pHandL.y - 4}" fill="#7BA38A" />
        </g>
        <g class="chibi-cheer" style="transform-origin:${pShoulderR.x}px ${pShoulderR.y}px; animation-delay:${cheerDelay};">
          <line x1="${pShoulderR.x}" y1="${pShoulderR.y}" x2="${pHandR.x}" y2="${pHandR.y}" stroke="#D32F2F" stroke-width="4.5" stroke-linecap="round" />
          <circle cx="${pHandR.x}" cy="${pHandR.y}" r="2.5" fill="#FFE082" />
        </g>`;
    } else {
      code += `
        <g class="chibi-cheer" style="transform-origin:${pShoulderL.x}px ${pShoulderL.y}px; animation-delay:${cheerDelay};">
          <line x1="${pShoulderL.x}" y1="${pShoulderL.y}" x2="${pHandL.x}" y2="${pHandL.y}" stroke="#2E7D32" stroke-width="4.5" stroke-linecap="round" />
          <circle cx="${pHandL.x}" cy="${pHandL.y}" r="2.5" fill="#FFE082" />
        </g>
        <g class="chibi-cheer" style="transform-origin:${pShoulderR.x}px ${pShoulderR.y}px; animation-delay:${cheerDelay};">
          <line x1="${pShoulderR.x}" y1="${pShoulderR.y}" x2="${pHandR.x}" y2="${pHandR.y}" stroke="#2E7D32" stroke-width="4.5" stroke-linecap="round" />
          <circle cx="${pHandR.x}" cy="${pHandR.y}" r="2.5" fill="#FFE082" />
        </g>`;
    }

  } else if (state === 'carrying') {
    // Worker 2 carrying wood
    code += drawIsoBox(x - 0.1, y, z, 0.2, 0.2, 0.3, 'stone');
    code += drawIsoBox(x + 0.3, y, z, 0.2, 0.2, 0.3, 'stone');
    code += drawIsoBox(x - 0.1, y, z + 0.3, 0.2, 0.2, 0.4, pantsKey);
    code += drawIsoBox(x + 0.3, y, z + 0.3, 0.2, 0.2, 0.4, pantsKey);
    code += drawIsoBox(x, y - 0.05, z + 0.7, 0.45, 0.35, 0.8, shirtKey);
    code += drawIsoBox(x + 0.05, y - 0.02, z + 1.5, 0.38, 0.35, 0.45, skinKey);
    code += drawIsoBox(x + 0.03, y - 0.04, z + 1.95, 0.42, 0.38, 0.18, hairKey);

    const pEyeL = project(x + 0.05, y + 0.2, z + 1.75), pEyeR = project(x + 0.05, y + 0.02, z + 1.75), pMouth = project(x + 0.05, y + 0.1, z + 1.6);
    code += `<g class="iso-layer">
      <circle cx="${pEyeL.x}" cy="${pEyeL.y}" r="2" fill="#3C3633" />
      <circle cx="${pEyeR.x}" cy="${pEyeR.y}" r="2" fill="#3C3633" />
      <path d="M ${pMouth.x - 2.5},${pMouth.y} Q ${pMouth.x},${pMouth.y + 2.5} ${pMouth.x + 2.5},${pMouth.y}" stroke="#3C3633" stroke-width="1.2" fill="none" stroke-linecap="round" /></g>`;

    const pShoulderL = project(x, y - 0.1, z + 1.1), pShoulderR = project(x + 0.4, y - 0.1, z + 1.1);
    const pHandL = project(x + 0.1, y - 0.35, z + 1.3), pHandR = project(x + 0.3, y - 0.35, z + 1.3);
    code += `
      <g class="chibi-sway" style="transform-origin:${pShoulderL.x}px ${pShoulderL.y}px;">
        <line x1="${pShoulderL.x}" y1="${pShoulderL.y}" x2="${pHandL.x}" y2="${pHandL.y}" stroke="#2E7D32" stroke-width="4.5" stroke-linecap="round" />
        <line x1="${pShoulderR.x}" y1="${pShoulderR.y}" x2="${pHandR.x}" y2="${pHandR.y}" stroke="#2E7D32" stroke-width="4.5" stroke-linecap="round" />
      </g>`;

    // The wood plank
    code += drawIsoBox(x - 0.4, y - 0.6, z + 1.35, 1.2, 0.35, 0.18, 'wood');

  } else {
    // state === 'hammering'
    code += drawIsoBox(x - 0.1, y, z, 0.2, 0.2, 0.3, 'stone');
    code += drawIsoBox(x + 0.3, y, z, 0.2, 0.2, 0.3, 'stone');
    code += drawIsoBox(x - 0.1, y, z + 0.3, 0.2, 0.2, 0.4, pantsKey);
    code += drawIsoBox(x + 0.3, y, z + 0.3, 0.2, 0.2, 0.4, pantsKey);
    code += drawIsoBox(x, y - 0.05, z + 0.7, 0.45, 0.35, 0.8, shirtKey);
    code += drawIsoBox(x + 0.05, y - 0.02, z + 1.5, 0.38, 0.35, 0.45, skinKey);
    code += drawIsoBox(x + 0.03, y - 0.04, z + 1.95, 0.42, 0.38, 0.18, hairKey);

    const pEyeL = project(x + 0.05, y + 0.2, z + 1.75), pEyeR = project(x + 0.05, y + 0.02, z + 1.75), pMouth = project(x + 0.05, y + 0.1, z + 1.6);
    code += `<g class="iso-layer">
      <circle cx="${pEyeL.x}" cy="${pEyeL.y}" r="2" fill="#3C3633" />
      <circle cx="${pEyeR.x}" cy="${pEyeR.y}" r="2" fill="#3C3633" />
      <path d="M ${pMouth.x - 2.5},${pMouth.y} Q ${pMouth.x},${pMouth.y + 2.5} ${pMouth.x + 2.5},${pMouth.y}" stroke="#3C3633" stroke-width="1.2" fill="none" stroke-linecap="round" /></g>`;

    const pShoulder = project(x, y - 0.1, z + 1.2), pArmEnd = project(x, y - 0.6, z + 1.35), pHammerHead = project(x, y - 0.6, z + 1.6);
    code += `
      <g class="chibi-arm-group" style="transform-origin:${pShoulder.x}px ${pShoulder.y}px;">
        <circle cx="${pShoulder.x}" cy="${pShoulder.y}" r="3" fill="#FFE082" />
        <line x1="${pShoulder.x}" y1="${pShoulder.y}" x2="${pArmEnd.x}" y2="${pArmEnd.y}" stroke="${charType === 'worker1' ? '#D32F2F' : '#2E7D32'}" stroke-width="4.5" stroke-linecap="round" />
        <circle cx="${pArmEnd.x}" cy="${pArmEnd.y}" r="2.5" fill="#FFE082" />
        <line x1="${pArmEnd.x}" y1="${pArmEnd.y}" x2="${pHammerHead.x}" y2="${pHammerHead.y - 2}" stroke="#8B7E74" stroke-width="2.0" />
        <polygon points="${pHammerHead.x - 2},${pHammerHead.y - 5} ${pHammerHead.x + 5},${pHammerHead.y - 2} ${pHammerHead.x + 2},${pHammerHead.y + 5} ${pHammerHead.x - 5},${pHammerHead.y + 2}" fill="#909A96" />
      </g>`;
  }
  return code;
}

export function drawChibi(status, progress, isPaused = false, type = 'tent') {
  let state = 'hammering';
  if (status === 'abandoned') state = 'sad';
  else if (progress === 0 || isPaused) state = 'sleeping';
  else if (progress >= 1.0) state = 'cheering';

  let code = '';
  if (type === 'tent') {
    if (state === 'sleeping') {
      // Nếu lều đã xây xong (status=completed hoặc tiến độ >= 85%),
      // chibi ngủ bên trong lều — được vẽ bởi drawTent()
      if (status === 'completed' || progress >= 0.85) return '';
      // Lều chưa xây xong: chibi ngủ ngoài trời tựa lưng trên mặt đất
      code += drawSingleChibi(1.8, 5.5, 0, 'sleeping', 'worker1');
      code += drawSingleChibi(6.5, 3.5, 0, 'sleeping', 'worker2');
      return code;
    }

    // Tọa độ trên mặt đất (z=0) theo bố cục cắm trại mới
    let c1X = 2.5, c1Y = 5.0, c1Z = 0; // Mặc định cho worker1
    let c2X = 5.5, c2Y = 5.0, c2Z = 0; // Mặc định cho worker2

    if (state === 'cheering') {
      c1X = 4.0; c1Y = 6.2; c1Z = 0; // gần thảm
      c2X = 5.5; c2Y = 6.5; c2Z = 0; // gần phía trước
    } else if (state === 'hammering') {
      // Worker 2 mang gỗ gần khu vực thi công
      c2X = 3.6; c2Y = 6.8; c2Z = 0;
    }

    code += drawSingleChibi(c1X, c1Y, c1Z, state, 'worker1');
    const c2State = (state === 'hammering') ? 'carrying' : state;
    code += drawSingleChibi(c2X, c2Y, c2Z, c2State, 'worker2');
  } else {
    // Các công trình khác dùng một chibi xây dựng ở vị trí mặc định
    code += drawSingleChibi(6.3, 6.5, 0.3, state, 'worker1');
  }
  return code;
}

export function drawDryCampfire(x, y, z) {
  let c = `<g class="iso-layer">`;
  c += drawIsoBox(x - 0.5, y, z, 1.0, 0.25, 0.2, 'darkwood');
  c += drawIsoBox(x, y - 0.5, z, 0.25, 1.0, 0.2, 'darkwood');
  c += `</g>`;
  return c;
}

export function drawEmberCampfire(x, y, z) {
  const p = project(x, y, z);
  let c = drawDryCampfire(x, y, z);
  c += drawIsoBox(x - 0.75, y - 0.75, z, 0.25, 0.25, 0.2, 'stone');
  c += drawIsoBox(x + 0.5, y - 0.75, z, 0.25, 0.25, 0.2, 'stone');
  c += drawIsoBox(x - 0.75, y + 0.5, z, 0.25, 0.25, 0.2, 'stone');
  c += drawIsoBox(x + 0.5, y + 0.5, z, 0.25, 0.25, 0.2, 'stone');
  c += `
    <g class="iso-layer">
      <circle cx="${p.x}" cy="${p.y - 3}" r="5" fill="#FF7043" opacity="0.85" />
      <circle cx="${p.x - 1}" cy="${p.y - 4}" r="2.5" fill="#FFCA28" opacity="0.95" />
    </g>`;
  return c;
}

export function drawTripodCampfire(x, y, z) {
  const p = project(x, y, z);
  let c = drawCampfire(x, y, z);
  const pL = project(x - 0.7, y + 0.7, z), pR = project(x + 0.7, y - 0.7, z), pBack = project(x - 0.7, y - 0.7, z);
  const pTop = project(x, y, z + 1.4);
  c += `
    <g class="iso-layer" stroke="#382B24" stroke-width="1.5" stroke-linecap="round" fill="none">
      <line x1="${pL.x}" y1="${pL.y}" x2="${pTop.x}" y2="${pTop.y}" />
      <line x1="${pR.x}" y1="${pR.y}" x2="${pTop.x}" y2="${pTop.y}" />
      <line x1="${pBack.x}" y1="${pBack.y}" x2="${pTop.x}" y2="${pTop.y}" />
      <line x1="${pTop.x}" y1="${pTop.y}" x2="${pTop.x}" y2="${pTop.y + 10}" stroke="#76857C" stroke-width="1" />
      <ellipse cx="${pTop.x}" cy="${pTop.y + 14}" rx="4.5" ry="3" fill="#2E3A3F" stroke="#232C30" stroke-width="0.5" />
    </g>`;
  return c;
}

export function drawCafeMenuBoard(x, y, z) {
  let c = drawIsoBox(x, y, z, 0.25, 0.7, 0.9, 'darkwood'); // Stand
  c += drawIsoRect(x + 0.26, y + 0.1, z + 0.15, 0.5, 0.6, 'right', '#263238'); // Chalkboard face
  return c;
}

export function drawCafeCoffeeTable(x, y, z) {
  let c = drawIsoBox(x, y, z, 0.8, 0.8, 0.6, 'wood'); // Table top
  c += drawIsoBox(x - 0.5, y + 0.2, z, 0.35, 0.35, 0.45, 'darkwood'); // Chair left
  c += drawIsoBox(x + 0.95, y + 0.2, z, 0.35, 0.35, 0.45, 'darkwood'); // Chair right
  return c;
}

export function drawIvy(x, y, z) {
  const pIvy1 = project(x, y, z), pIvy2 = project(x - 0.1, y + 0.6, z - 0.8);
  return `
    <g class="iso-layer">
      <circle cx="${pIvy1.x}" cy="${pIvy1.y}" r="4.5" fill="#425E4E" />
      <circle cx="${pIvy1.x + 2}" cy="${pIvy1.y - 1}" r="3" fill="#50725E" />
      <circle cx="${pIvy2.x}" cy="${pIvy2.y}" r="3.5" fill="#6C937A" />
    </g>`;
}

export function drawConstellation(x, y, z) {
  const pStar1 = project(x - 1.2, y - 0.5, z + 2.5);
  const pStar2 = project(x + 2.8, y - 0.8, z + 3.2);
  const pStar3 = project(x + 1.0, y - 1.8, z + 4.5);

  return `
    <g class="iso-layer">
      <!-- Twinkling Star lines/polygons -->
      <polygon points="${pStar1.x},${pStar1.y - 3.5} ${pStar1.x - 1.5},${pStar1.y - 1} ${pStar1.x - 4},${pStar1.y} ${pStar1.x - 1.5},${pStar1.y + 1} ${pStar1.x},${pStar1.y + 3.5} ${pStar1.x + 1.5},${pStar1.y + 1} ${pStar1.x + 4},${pStar1.y} ${pStar1.x + 1.5},${pStar1.y - 1}" fill="#F4D068" />
      <polygon points="${pStar2.x},${pStar2.y - 3.5} ${pStar2.x - 1.5},${pStar2.y - 1} ${pStar2.x - 4},${pStar2.y} ${pStar2.x - 1.5},${pStar2.y + 1} ${pStar2.x},${pStar2.y + 3.5} ${pStar2.x + 1.5},${pStar2.y + 1} ${pStar2.x + 4},${pStar2.y} ${pStar2.x + 1.5},${pStar2.y - 1}" fill="#FFFFFF" opacity="0.9" />
      <polygon points="${pStar3.x},${pStar3.y - 4.5} ${pStar3.x - 2},${pStar3.y - 1.2} ${pStar3.x - 5},${pStar3.y} ${pStar3.x - 2},${pStar3.y + 1.2} ${pStar3.x},${pStar3.y + 4.5} ${pStar3.x + 2},${pStar3.y + 1.2} ${pStar3.x + 5},${pStar3.y} ${pStar3.x + 2},${pStar3.y - 1.2}" fill="#FFF59D" />
      
      <!-- Faint Constellation connector lines -->
      <line x1="${pStar1.x}" y1="${pStar1.y}" x2="${pStar3.x}" y2="${pStar3.y}" stroke="rgba(244,208,68,0.22)" stroke-width="0.8" stroke-dasharray="2,2" />
      <line x1="${pStar3.x}" y1="${pStar3.y}" x2="${pStar2.x}" y2="${pStar2.y}" stroke="rgba(244,208,68,0.22)" stroke-width="0.8" stroke-dasharray="2,2" />
    </g>`;
}

/* ==========================================================================
   20-STEP PROGRESSIVE BUILDING GENERATOR
   ========================================================================== */

export function getBuildingSVG(type, progress, status = 'completed', isPaused = false, duration = 25) {
  // Map new building progression styles to existing graphic templates as structural presets
  if (type === 'stadium' || type === 'library') type = 'cafe';
  else if (type === 'campus' || type === 'lighthouse' || type === 'berlin') type = 'observatory';

  // SVG gradient defs for tent campfire reflections (only injected for tent type)
  const tentDefs = `
    <defs>
      <linearGradient id="sky-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#07090e" />
        <stop offset="60%" stop-color="#121824" />
        <stop offset="100%" stop-color="#1b2436" />
      </linearGradient>
      <linearGradient id="water-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#214e6d" />
        <stop offset="50%" stop-color="#2a668c" />
        <stop offset="100%" stop-color="#3b82a6" />
      </linearGradient>
      <radialGradient id="lantern-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFF9C4" stop-opacity="0.85" />
        <stop offset="35%" stop-color="#FFE082" stop-opacity="0.45" />
        <stop offset="100%" stop-color="#FFD54F" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="firecast" cx="100%" cy="75%" r="85%">
        <stop offset="0%" stop-color="#FF8C00" stop-opacity="0.40"/>
        <stop offset="55%" stop-color="#FF4500" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#FF4500" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="campfire-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FF9E2C" stop-opacity="0.55"/>
        <stop offset="45%" stop-color="#FF6D00" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#FF4500" stop-opacity="0"/>
      </radialGradient>
    </defs>`;

  let code = '';
  let defs = '';

  if (status === 'abandoned') {
    // Diorama Base
    code += drawIsoBox(1, 1, -1.2, 8, 8, 1.2, 'stone');
    code += drawIsoBox(1, 1, 0, 8, 8, 0.3, 'grass');
    code += drawScaffolding(2, 2, 0.3, 6, 6, 6);
    code += drawIsoBox(3, 3, 0.3, 4, 4, 1.5, 'ruin');
    const p1 = project(3.5, 4.5, 1.8), p2 = project(5, 3.5, 1.8);
    code += `<circle cx="${p1.x}" cy="${p1.y}" r="6" fill="#50725E" opacity="0.8" class="iso-layer" />`;
    code += `<circle cx="${p2.x}" cy="${p2.y}" r="4" fill="#6C937A" opacity="0.8" class="iso-layer" />`;
    code += drawChibi(status, progress, isPaused, type);
    return `<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">${code}</svg>`;
  }


  if (type === 'tent') {
    defs = tentDefs;
    // Khung cảnh bầu trời đêm đầy sao (vẽ trước tiên, làm nền)
    code += drawNightSky();
    // Không có hộp isometric lơ lửng — mọi thứ nằm thẳng trên mặt đất tự nhiên

    // Xác định trạng thái chibi/lều
    const state = (progress === 0 || isPaused) ? 'sleeping' : (status === 'abandoned' ? 'sad' : (progress >= 1.0 ? 'cheering' : 'hammering'));

    if (status === 'completed') {
      // --- Vẽ từ xa đến gần (Painter's Algorithm) ---

      // 1. Cây thông phía sau trái (xa nhất)
      code += drawPineTree(1.2, 1.5, 0);  // D=2.7 back-left

      // 2. Rương hành lý bên trong/sau bức tường trái lều
      if (duration > 15) {
        code += drawTentChest(2.3, 2.2, 0);
      }

      // 3. Cây thông giữa trái
      code += drawPineTree(1.3, 3.2, 0);  // D=4.5 mid-left

      // 4. Cây lá rộng góc phải phía sau (theo bản phác thảo)
      code += drawDeciduousTree(7.5, 1.8, 0);  // D=9.3 back-right

      // 5. Cấu trúc lều (nằm thẳng trên mặt đất, không có sàn gỗ)
      code += drawTentPegs(3, 2, 0, 4, 4);
      code += drawTent(3, 2, 0, 4, 4, 3.5, state);

      if (duration > 45) {
        code += drawTentFlag(5.0, 4.0, 3.5, 1.4);
      }

      // 6. Cây thông phía trước trái
      code += drawPineTree(1.3, 7.2, 0);  // D=8.5 front-left

      // 7. Thảm trang trí trước cửa lều
      code += drawCampRug(3.2, 6.2, 0, 1.6, 1.4);

      // 8. Ghế ngồi cạnh bếp lửa (góc phải, theo bản phác thảo)
      if (duration > 45) {
        code += drawTentStools(6.5, 4.0, 0);
      }

      // 9. Ánh hào quang bếp lửa trải rộng (góc phải)
      const pFire = project(7.0, 4.5, 0.01);
      code += `<g class="iso-layer"><ellipse cx="${pFire.x}" cy="${pFire.y}" rx="55" ry="30" fill="url(#campfire-glow)" class="glow-flicker" /></g>`;

      // 10. Chi tiết bếp lửa theo thời gian (góc phải, theo bản phác thảo)
      if (duration <= 15) {
        code += drawEmberCampfire(7.0, 4.5, 0);
      } else if (duration <= 45) {
        code += drawCampfire(7.0, 4.5, 0);
      } else {
        code += drawTripodCampfire(7.0, 4.5, 0);
      }

      // 11. Cây thông phía trước phải (khung cảnh)
      code += drawPineTree(7.8, 6.5, 0);  // D=14.3 front-right

    } else {
      // Đang thi công (trong phiên tập trung đang chạy)

      // Cây thông phía sau xuất hiện dần
      if (progress >= 0.05) code += drawPineTree(1.2, 1.5, 0);

      // Rương hành lý
      if (progress >= 0.90 && duration > 15) {
        code += drawTentChest(2.3, 2.2, 0);
      }

      // Cây thông giữa trái
      if (progress >= 0.10) code += drawPineTree(1.3, 3.2, 0);

      // Cây lá rộng phía sau phải (xuất hiện sớm để tạo không khí)
      if (progress >= 0.12) code += drawDeciduousTree(7.5, 1.8, 0);

      // Các giai đoạn cọc lều, khung, và vải phủ (không có sàn gỗ)
      if (progress >= 0.05) code += drawTentPegs(3, 2, 0, 4, 4);
      if (progress >= 0.25 && progress < 0.85) code += drawTentFrame(3, 2, 0, 4, 4, 3.5);

      if (progress >= 0.70 && progress < 0.75) {
        code += drawIsoBox(3.4, 2.4, 0.05, 3.2, 3.2, 0.05, 'stone');
      } else if (progress >= 0.75 && progress < 0.80) {
        code += drawIsoBox(3.4, 2.4, 0.05, 3.2, 3.2, 0.05, 'stone');
        code += drawTentBackSheet(3, 2, 0, 4, 4, 3.5);
      } else if (progress >= 0.80 && progress < 0.85) {
        code += drawIsoBox(3.4, 2.4, 0.05, 3.2, 3.2, 0.05, 'stone');
        code += drawTentPartialTarp(3, 2, 0, 4, 4, 3.5);
      } else if (progress >= 0.85) {
        code += drawTent(3, 2, 0, 4, 4, 3.5, state);
      }

      // Cây thông phía trước trái
      if (progress >= 0.08) code += drawPineTree(1.3, 7.2, 0);

      // Thảm sau khi lều bắt đầu hình thành
      if (progress >= 0.30) code += drawCampRug(3.2, 6.2, 0, 1.6, 1.4);

      // Ghế ngồi cạnh bếp lửa phía phải
      if (progress >= 0.95 && duration > 45) {
        code += drawTentStools(6.5, 4.0, 0);
      }

      // Giai đoạn xây dựng bếp lửa (góc phải)
      if (progress >= 0.35 && progress < 0.40) {
        const pCamp = project(7.0, 4.5, 0);
        code += `<g class="iso-layer"><ellipse cx="${pCamp.x}" cy="${pCamp.y}" rx="7" ry="4.5" fill="none" stroke="#7F8A85" stroke-width="1.8" /></g>`;
      } else if (progress >= 0.40 && progress < 0.50) {
        code += drawDryCampfire(7.0, 4.5, 0);
      } else if (progress >= 0.50 && progress < 0.55) {
        code += drawEmberCampfire(7.0, 4.5, 0);
      } else if (progress >= 0.55) {
        // Ánh hào quang khi lửa bùng lên
        const pFire = project(7.0, 4.5, 0.01);
        code += `<g class="iso-layer"><ellipse cx="${pFire.x}" cy="${pFire.y}" rx="55" ry="30" fill="url(#campfire-glow)" class="glow-flicker" /></g>`;
        if (duration <= 15) code += drawEmberCampfire(7.0, 4.5, 0);
        else code += drawCampfire(7.0, 4.5, 0);
      }

      // Giàn giáo trong quá trình xây dựng
      if (progress >= 0.60 && progress < 0.85) code += drawScaffolding(3, 2, 0, 4, 4, 4);

      // Cây thông phía trước phải
      if (progress >= 0.15) code += drawPineTree(7.8, 6.5, 0);
    }

  } else if (type === 'cafe') {
    // Diorama Base
    code += drawIsoBox(1, 1, -1.2, 8, 8, 1.2, 'stone');
    code += drawIsoBox(1, 1, 0, 8, 8, 0.3, 'grass');

    if (status === 'completed') {
      // Basic Cafe Structure always present
      code += drawIsoBox(2, 2, 0.3, 6, 6, 0.4, 'stone');
      code += drawIsoBox(2.5, 2.5, 0.7, 5, 5, 4.0, 'cream');
      code += drawIsoRect(7.5, 3.5, 0.7, 1.2, 2.8, 'right', '#5A4A42'); // wood door
      code += drawIsoRect(4.0, 7.5, 1.8, 2.2, 2.0, 'left', 'rgba(244,208,104,0.35)'); // glowing windows
      code += drawIsoBox(2.3, 2.3, 4.7, 5.4, 5.4, 1.0, 'terracotta'); // terracotta tile roof

      // Awning, Chimney, Menu, Plant based on duration
      if (duration > 15) {
        code += drawIsoBox(3.5, 7.5, 3.8, 3.0, 0.6, 0.3, 'yellow'); // Awning
        code += drawIsoBox(3.0, 3.0, 5.7, 0.6, 0.6, 1.5, 'stone'); // Chimney
        const pSmoke = project(3.3, 3.3, 7.8);
        code += `<circle cx="${pSmoke.x}" cy="${pSmoke.y}" r="7" fill="#F5F5F5" opacity="0.75" class="iso-layer" />`; // Smoke
        code += drawCafeMenuBoard(6.8, 4.8, 0.7);

        // Pot plant
        code += drawIsoBox(6.5, 7.5, 0.7, 0.8, 0.8, 1.0, 'wood');
        const pPlant = project(6.9, 7.9, 1.7);
        code += `<circle cx="${pPlant.x}" cy="${pPlant.y}" r="6.5" fill="#7BA38A" class="iso-layer" />`;
      }

      // Outdoor table & chairs
      if (duration > 45) {
        code += drawCafeCoffeeTable(6.0, 2.6, 0.7);
      }
    } else {
      // Under construction
      if (progress >= 0.05) code += drawTentPegs(2, 2, 0.3, 6, 6);
      if (progress >= 0.10) code += drawIsoBox(2, 2, 0.3, 6, 6, 0.4, 'stone');

      if (progress >= 0.15) {
        const pillH = progress >= 0.20 ? 2.4 : 1.2;
        code += drawIsoBox(2.5, 2.5, 0.7, 0.6, 0.6, pillH, 'stone');
        code += drawIsoBox(6.9, 2.5, 0.7, 0.6, 0.6, pillH, 'stone');
        code += drawIsoBox(2.5, 6.9, 0.7, 0.6, 0.6, pillH, 'stone');
        code += drawIsoBox(6.9, 6.9, 0.7, 0.6, 0.6, pillH, 'stone');
      }

      if (progress >= 0.25 && progress < 0.30) {
        code += drawIsoBox(2.5, 2.5, 0.7, 5, 5, 1.5, 'cream');
      } else if (progress >= 0.30 && progress < 0.35) {
        code += drawIsoBox(2.5, 2.5, 0.7, 5, 5, 2.8, 'cream');
      } else if (progress >= 0.35) {
        code += drawIsoBox(2.5, 2.5, 0.7, 5, 5, 4.0, 'cream');
      }

      if (progress >= 0.40) code += drawIsoRect(7.5, 3.5, 0.7, 1.2, 2.8, 'right', '#5A4A42');
      if (progress >= 0.45) {
        const winColor = progress >= 0.95 ? 'rgba(244,208,104,0.35)' : 'rgba(255,255,255,0.15)';
        code += drawIsoRect(4.0, 7.5, 1.8, 2.2, 2.0, 'left', '#B5CDC5');
        code += drawIsoRect(4.0, 7.5, 1.8, 2.2, 2.0, 'left', winColor);
      }

      if (progress >= 0.50 && progress < 0.85) code += drawScaffolding(2, 2, 0.7, 6, 6, 5);
      if (progress >= 0.60 && duration > 15) code += drawIsoBox(3.5, 7.5, 3.8, 3.0, 0.6, 0.3, 'yellow');

      if (progress >= 0.70 && progress < 0.75) {
        code += drawIsoBox(2.3, 2.3, 4.7, 5.4, 5.4, 0.4, 'terracotta');
      } else if (progress >= 0.75) {
        code += drawIsoBox(2.3, 2.3, 4.7, 5.4, 5.4, 1.0, 'terracotta');
      }

      if (progress >= 0.80 && duration > 15) code += drawIsoBox(3.0, 3.0, 5.7, 0.6, 0.6, 1.5, 'stone');
      if (progress >= 0.85 && duration > 15) code += drawCafeMenuBoard(6.8, 4.8, 0.7);

      if (progress >= 0.90 && duration > 15) {
        code += drawIsoBox(6.5, 7.5, 0.7, 0.8, 0.8, 1.0, 'wood');
        const pPlant = project(6.9, 7.9, 1.7);
        code += `<circle cx="${pPlant.x}" cy="${pPlant.y}" r="6.5" fill="#7BA38A" class="iso-layer" />`;
      }
      if (progress >= 0.95 && duration > 15) {
        const pSmoke = project(3.3, 3.3, 7.8);
        code += `<circle cx="${pSmoke.x}" cy="${pSmoke.y}" r="7" fill="#F5F5F5" opacity="0.75" class="iso-layer" />`;
      }
      if (progress >= 1.00 && duration > 45) {
        code += drawCafeCoffeeTable(6.0, 2.6, 0.7);
      }
    }

  } else if (type === 'observatory') {
    // Diorama Base
    code += drawIsoBox(1, 1, -1.2, 8, 8, 1.2, 'stone');
    code += drawIsoBox(1, 1, 0, 8, 8, 0.3, 'grass');
    if (status === 'completed') {
      // Basic Observatory structure
      code += drawIsoBox(2, 2, 0.3, 6, 6, 0.8, 'stone');
      code += drawIsoBox(2.5, 2.5, 1.1, 5, 5, 4.5, 'cream');
      code += drawIsoBox(2.2, 2.2, 1.1, 0.6, 0.6, 4.5, 'stone');
      code += drawIsoBox(7.2, 2.2, 1.1, 0.6, 0.6, 4.5, 'stone');
      code += drawIsoBox(2.2, 7.2, 1.1, 0.6, 0.6, 4.5, 'stone');
      code += drawIsoRect(2.5, 4.5, 1.1, 1.0, 2.5, 'right', '#3C3633'); // arch door
      code += drawIsoBox(2.2, 2.2, 5.6, 5.6, 5.6, 0.6, 'stone'); // upper deck
      code += drawIsoBox(2.5, 2.5, 6.2, 5, 5, 2.2, 'yellow'); // dome

      // Telescope & Ivy based on duration
      if (duration > 15) {
        code += drawIsoBox(3.5, 4.0, 6.2, 1.5, 3.5, 1.2, 'darkwood'); // Mount
        code += drawIsoBox(3.2, 6.5, 7.2, 2.1, 1.2, 1.2, 'stone'); // Telescope
        code += drawIvy(2.2, 4.8, 3.2); // Ivy
      }

      // Gold gear, constellation and flags
      if (duration > 45) {
        code += drawIsoBox(3.1, 6.4, 7.5, 0.3, 0.3, 0.8, 'yellow'); // Gold highlights
        code += drawConstellation(4.0, 4.0, 9.0); // Starry constellation
        code += drawTentFlag(2.6, 2.6, 8.4, 1.2); // Dome flag
      }
    } else {
      // Under construction
      if (progress >= 0.05) code += drawTentPegs(2, 2, 0.3, 6, 6);
      if (progress >= 0.10) code += drawIsoBox(2, 2, 0.3, 6, 6, 0.8, 'stone');

      if (progress >= 0.15) {
        const colH = progress >= 0.20 ? 4.5 : 2.0;
        code += drawIsoBox(2.2, 2.2, 1.1, 0.6, 0.6, colH, 'stone');
        code += drawIsoBox(7.2, 2.2, 1.1, 0.6, 0.6, colH, 'stone');
        code += drawIsoBox(2.2, 7.2, 1.1, 0.6, 0.6, colH, 'stone');
      }

      if (progress >= 0.25 && progress < 0.30) {
        code += drawIsoBox(2.5, 2.5, 1.1, 5, 5, 2.0, 'cream');
      } else if (progress >= 0.30 && progress < 0.35) {
        code += drawIsoBox(2.5, 2.5, 1.1, 5, 5, 3.2, 'cream');
      } else if (progress >= 0.35) {
        code += drawIsoBox(2.5, 2.5, 1.1, 5, 5, 4.5, 'cream');
        code += drawIsoBox(2.2, 2.2, 1.1, 0.6, 0.6, 4.5, 'stone');
        code += drawIsoBox(7.2, 2.2, 1.1, 0.6, 0.6, 4.5, 'stone');
        code += drawIsoBox(2.2, 7.2, 1.1, 0.6, 0.6, 4.5, 'stone');
      }

      if (progress >= 0.40) code += drawIsoRect(2.5, 4.5, 1.1, 1.0, 2.5, 'right', '#3C3633');
      if (progress >= 0.45 && progress < 0.85) code += drawScaffolding(1.8, 1.8, 1.1, 6.4, 6.4, 6.5);
      if (progress >= 0.50) code += drawIsoBox(2.2, 2.2, 5.6, 5.6, 5.6, 0.6, 'stone');

      if (progress >= 0.55 && duration > 15) code += drawIsoBox(3.5, 4.0, 6.2, 1.5, 3.5, 1.2, 'darkwood');
      if (progress >= 0.60 && duration > 15) code += drawIsoBox(3.2, 6.5, 7.2, 2.1, 1.2, 1.2, 'stone');
      if (progress >= 0.65 && duration > 45) code += drawIsoBox(3.1, 6.4, 7.5, 0.3, 0.3, 0.8, 'yellow');

      if (progress >= 0.70 && progress < 0.80) {
        code += drawIsoBox(2.5, 2.5, 6.2, 5, 5, 1.0, 'yellow');
      } else if (progress >= 0.80) {
        code += drawIsoBox(2.5, 2.5, 6.2, 5, 5, 2.2, 'yellow');
      }

      if (progress >= 0.90 && duration > 15) code += drawIvy(2.2, 4.8, 3.2);
      if (progress >= 0.95 && duration > 45) code += drawConstellation(4.0, 4.0, 9.0);
      if (progress >= 1.00 && duration > 45) code += drawTentFlag(2.6, 2.6, 8.4, 1.2);
    }
  }

  code += drawChibi(status, progress, isPaused, type);
  return `<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">${defs}${code}</svg>`;
}

export function drawTentBackSheet(x, y, z, w, l, h) {
  const pL0 = project(x, y, z), pR0 = project(x + w, y, z), pPeak0 = project(x + w / 2, y, z + h);
  return `
    <g class="iso-layer">
      <path d="M ${pL0.x},${pL0.y} L ${pR0.x},${pR0.y} L ${pPeak0.x},${pPeak0.y} Z" fill="#8D4C3A" />
    </g>`;
}

export function getWelcomeHeroSVG() {
  const heroDefs = `
    <defs>
      <radialGradient id="firecast" cx="100%" cy="75%" r="85%">
        <stop offset="0%" stop-color="#FF8C00" stop-opacity="0.40"/>
        <stop offset="55%" stop-color="#FF4500" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#FF4500" stop-opacity="0"/>
      </radialGradient>
    </defs>`;
  let code = '';
  // Ground plane
  code += drawIsoBox(0, 0, 0, 13, 9, 0.15, 'grass');

  // House left — small
  code += drawIsoBox(0.4, 0.6, 0.15, 2.8, 2.2, 1.6, 'wood');
  code += drawTent(0.3, 0.5, 1.75, 3, 2.4, 1.8);

  // House center — tall main
  code += drawIsoBox(3.8, 2.2, 0.15, 3.2, 3.2, 2.8, 'cream');
  code += drawIsoBox(3.5, 1.9, 2.95, 3.8, 3.8, 1.0, 'terracotta');

  // House right — medium
  code += drawIsoBox(8.0, 1.2, 0.15, 3.0, 2.6, 2.2, 'stone');
  code += drawIsoBox(7.7, 0.9, 2.35, 3.6, 3.2, 0.85, 'terracotta');

  // Small cabin far right
  code += drawIsoBox(11.2, 0.4, 0.15, 1.6, 1.4, 1.2, 'darkwood');
  code += drawTent(11.1, 0.3, 1.35, 1.8, 1.6, 1.1);

  // Smoke puffs above center house
  const s1 = project(4.6, 3.0, 4.5);
  const s2 = project(5.1, 2.8, 5.1);
  const s3 = project(4.2, 3.3, 5.6);
  code += `<circle cx="${s1.x}" cy="${s1.y}" r="6" fill="#EEEEEE" opacity="0.45" class="iso-layer"/>`;
  code += `<circle cx="${s2.x}" cy="${s2.y}" r="4.5" fill="#F2F2F2" opacity="0.32" class="iso-layer"/>`;
  code += `<circle cx="${s3.x}" cy="${s3.y}" r="3.5" fill="#F5F5F5" opacity="0.25" class="iso-layer"/>`;

  return `<svg viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg">${heroDefs}${code}</svg>`;
}

export function getBuildingType(minutes) {
  if (minutes <= 15) return 'tent';
  if (minutes <= 45) return 'cafe';
  return 'observatory';
}

export function getBuildingName(type) {
  const lang = localStorage.getItem('focus_town_lang') || 'vi';
  const names = {
    vi: {
      tent: 'Lều dã ngoại',
      cafe: 'Tiệm cà phê ấm cúng',
      stadium: 'Sân vận động lớn',
      library: 'Thư viện sách cổ điển',
      campus: 'Khuôn viên trường học',
      observatory: 'Đài thiên văn hoàng gia',
      lighthouse: 'Ngọn hải đăng kỳ vĩ',
      berlin: 'Thành phố Berlin đồ sộ',
      cabin: 'Lều dã ngoại'
    },
    en: {
      tent: 'Campsite Tent',
      cafe: 'Cozy Cafe',
      stadium: 'Grand Stadium',
      library: 'Royal Library',
      campus: 'College Campus',
      observatory: 'Royal Observatory',
      lighthouse: 'Coastal Lighthouse',
      berlin: 'Berlin Brandenburg',
      cabin: 'Campsite Tent'
    }
  };
  return names[lang]?.[type] || type;
}
