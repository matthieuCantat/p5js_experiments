

export function interpolateValues(t, tPoints, vPoints) {
    if (tPoints.length !== vPoints.length) {
      throw new Error("tPoints and vPoints must have the same length");
    }
  
    // Handle edge cases
    if (t <= tPoints[0]) return vPoints[0];
    if (t >= tPoints[tPoints.length - 1]) return vPoints[vPoints.length - 1];
  
    // Find the segment where t falls into
    for (let i = 0; i < tPoints.length - 1; i++) {
      const tStart = tPoints[i];
      const tEnd = tPoints[i + 1];
  
      if (t >= tStart && t <= tEnd) {
        const vStart = vPoints[i];
        const vEnd = vPoints[i + 1];
        const localT = (t - tStart) / (tEnd - tStart);
  
        // Linear interpolation (assuming numeric values)
        return vStart + (vEnd - vStart) * localT;
      }
    }
  }


export function interpolateColors(t, tPoints, vPoints)
{
  if (tPoints.length !== vPoints.length) {
    throw new Error("tPoints and vPoints must have the same length");
  }

  // Handle edge cases
  if (t <= tPoints[0]) return vPoints[0];
  if (t >= tPoints[tPoints.length - 1]) return vPoints[vPoints.length - 1];

  // Find the segment where t falls into
  for (let i = 0; i < tPoints.length - 1; i++) {
    const tStart = tPoints[i];
    const tEnd = tPoints[i + 1];

    if (t >= tStart && t <= tEnd) {
      const vStart = vPoints[i];
      const vEnd = vPoints[i + 1];
      const localT = (t - tStart) / (tEnd - tStart);

      // Linear interpolation (assuming numeric values)
      return [
          vStart[0] + (vEnd[0] - vStart[0]) * localT,
          vStart[1] + (vEnd[1] - vStart[1]) * localT,
          vStart[2] + (vEnd[2] - vStart[2]) * localT];
    }
  }
}


export function smoothstep(edge0, edge1, x) {
  // Scale, bias and saturate x to 0..1 range
  let t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  // Evaluate polynomial
  return t * t * (3 - 2 * t);
}

export function smoothstep2(edge0, edge1, x) {
  // Scale, bias and saturate x to 0..1 range
  let t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  // Evaluate smootherstep polynomial
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function easeOut(edge0, edge1, x ,pow = 2)
{
  let t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return 1 - Math.pow(1 - t, pow);
}

export function easeOut2(edge0, edge1, x) {
  // Normalize x to [0, 1]
  let t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  // Invert smootherstep to create an ease-out curve
  t = 1 - (t * t * t * (t * (t * 6 - 15) + 10));
  // Map back to original range
  return  (1 - t);
}