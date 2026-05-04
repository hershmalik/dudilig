"use client";

import { useEffect, useRef } from "react";

const COLS = 50;
const ROWS = 30;
const SPRING = 0.025;
const DAMPING = 0.93;
const SPREAD = 0.18;
const HOVER_RADIUS = 130;
const HOVER_FORCE = 15;
const PRESS_RADIUS = 200;
const PRESS_FORCE = 30;

type Vertex = {
  restX: number;
  restY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  offsetZ: number;
  velZ: number;
};

export default function MeshCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let vertices: Vertex[] = [];
    const mouse = { x: -9999, y: -9999, pressed: false };
    let raf = 0;
    const startTime = performance.now();
    let canvasAlpha = 0;
    const newVelZ = new Float32Array(COLS * ROWS);

    const buildGrid = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      vertices = new Array(COLS * ROWS);
      const stepX = width / (COLS - 1);
      const stepY = height / (ROWS - 1);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = c * stepX;
          const y = r * stepY;
          vertices[r * COLS + c] = {
            restX: x,
            restY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            offsetZ: 0,
            velZ: 0,
          };
        }
      }
    };

    const idx = (c: number, r: number) => r * COLS + c;

    const tick = () => {
      const now = performance.now();
      const t = (now - startTime) / 1000;

      if (canvasAlpha < 1) {
        canvasAlpha = Math.min(1, (now - startTime) / 2000);
      }

      // Physics: forces, spring, damping, integrate
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const v = vertices[idx(c, r)];

          // Ambient breathing
          const breathe = Math.sin(t * 0.6 + c * 0.15 + r * 0.12) * 2;
          v.velZ += (breathe - v.offsetZ) * 0.002;

          // Cursor proximity force
          const dx = v.x - mouse.x;
          const dy = v.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          const radius = mouse.pressed ? PRESS_RADIUS : HOVER_RADIUS;
          const force = mouse.pressed ? PRESS_FORCE : HOVER_FORCE;
          if (dist < radius && dist > 0) {
            const falloff = 1 - dist / radius;
            const f = force * falloff;
            v.vx += (dx / dist) * f * 0.12;
            v.vy += (dy / dist) * f * 0.12;
            v.velZ += f * 0.4;
          }

          // Spring back to rest
          v.vx += (v.restX - v.x) * SPRING;
          v.vy += (v.restY - v.y) * SPRING;
          v.velZ -= v.offsetZ * SPRING * 1.5;

          // Damping
          v.vx *= DAMPING;
          v.vy *= DAMPING;
          v.velZ *= DAMPING;

          // Integrate
          v.x += v.vx;
          v.y += v.vy;
          v.offsetZ += v.velZ;
        }
      }

      // Wave propagation through 4 neighbors
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = idx(c, r);
          const z = vertices[i].offsetZ;
          let acc = 0;
          if (c > 0) acc += (vertices[idx(c - 1, r)].offsetZ - z) * SPREAD;
          if (c < COLS - 1) acc += (vertices[idx(c + 1, r)].offsetZ - z) * SPREAD;
          if (r > 0) acc += (vertices[idx(c, r - 1)].offsetZ - z) * SPREAD;
          if (r < ROWS - 1) acc += (vertices[idx(c, r + 1)].offsetZ - z) * SPREAD;
          newVelZ[i] = acc;
        }
      }
      for (let i = 0; i < vertices.length; i++) {
        vertices[i].velZ += newVelZ[i];
      }

      // ── Render
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = canvasAlpha;

      const cx = width / 2;
      const cy = height / 2;
      const maxDist = Math.hypot(cx, cy);
      const zoneW = width * 0.35;
      const zoneH = height * 0.35;
      const cursorActive = mouse.x > -1000;

      // Wireframe lines
      ctx.strokeStyle = "rgba(255,255,255,0.018)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 1; c++) {
          const a = vertices[idx(c, r)];
          const b = vertices[idx(c + 1, r)];
          ctx.moveTo(a.x, a.y - a.offsetZ * 0.3);
          ctx.lineTo(b.x, b.y - b.offsetZ * 0.3);
        }
      }
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS - 1; r++) {
          const a = vertices[idx(c, r)];
          const b = vertices[idx(c, r + 1)];
          ctx.moveTo(a.x, a.y - a.offsetZ * 0.3);
          ctx.lineTo(b.x, b.y - b.offsetZ * 0.3);
        }
      }
      ctx.stroke();

      // Vertices
      for (let i = 0; i < vertices.length; i++) {
        const v = vertices[i];
        const distFromCenter = Math.hypot(v.restX - cx, v.restY - cy);
        const centerFactor = Math.pow(
          1 - Math.min(1, (distFromCenter / maxDist) * 1.4),
          1.5
        );
        const disp =
          Math.hypot(v.x - v.restX, v.y - v.restY) + Math.abs(v.offsetZ);

        let red = 130 + (245 - 130) * centerFactor;
        let green = 130 + (235 - 130) * centerFactor;
        let blue = 140 + (210 - 140) * centerFactor;
        if (disp > 3) {
          const k = Math.min(1, (disp - 3) * 0.05);
          red = red + (255 - red) * k;
          green = green + (252 - green) * k;
          blue = blue + (245 - blue) * k;
        }

        const size = 1 + centerFactor * 1 + (disp > 0.5 ? disp * 0.05 : 0);
        const baseAlpha = 0.06 + centerFactor * 0.18;
        const activeAlpha = disp > 0.5 ? Math.min(0.9, disp * 0.05) : 0;
        let alpha = Math.max(baseAlpha, activeAlpha);

        // Content-zone dim (when cursor is in section)
        if (cursorActive) {
          const ed =
            Math.pow((v.restX - cx) / zoneW, 2) +
            Math.pow((v.restY - cy) / zoneH, 2);
          if (ed < 1) {
            const dim = (1 - ed) * 0.7;
            alpha *= 1 - dim;
          }
        }

        const screenY = v.y - v.offsetZ * 0.3;
        const r = Math.round(red);
        const g = Math.round(green);
        const b = Math.round(blue);

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(v.x, screenY, size, 0, Math.PI * 2);
        ctx.fill();

        if (disp > 1.5 || centerFactor > 0.4) {
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.18})`;
          ctx.beginPath();
          ctx.arc(v.x, screenY, size + 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const updateMouseFromEvent = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        mouse.x = -9999;
        mouse.y = -9999;
        mouse.pressed = false;
      } else {
        mouse.x = x;
        mouse.y = y;
      }
    };

    const onMouseMove = (e: MouseEvent) => updateMouseFromEvent(e);
    const onMouseDown = (e: MouseEvent) => {
      updateMouseFromEvent(e);
      if (mouse.x > -1000) mouse.pressed = true;
    };
    const onMouseUp = () => {
      mouse.pressed = false;
    };
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        mouse.x = -9999;
        mouse.y = -9999;
        mouse.pressed = false;
      }
    };
    const onResize = () => buildGrid();

    buildGrid();
    if (!reduceMotion) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mouseout", onMouseOut);
    }
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      data-testid="canvas-mesh"
    />
  );
}
