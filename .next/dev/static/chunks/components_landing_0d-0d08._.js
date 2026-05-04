(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/landing/MeshCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MeshCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const COLS = 50;
const ROWS = 30;
const SPRING = 0.025;
const DAMPING = 0.93;
const SPREAD = 0.18;
const HOVER_RADIUS = 130;
const HOVER_FORCE = 15;
const PRESS_RADIUS = 200;
const PRESS_FORCE = 30;
function MeshCanvas() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MeshCanvas.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            let width = 0;
            let height = 0;
            let dpr = Math.max(1, window.devicePixelRatio || 1);
            let vertices = [];
            const mouse = {
                x: -9999,
                y: -9999,
                pressed: false
            };
            let raf = 0;
            const startTime = performance.now();
            let canvasAlpha = 0;
            const newVelZ = new Float32Array(COLS * ROWS);
            const buildGrid = {
                "MeshCanvas.useEffect.buildGrid": ()=>{
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
                    for(let r = 0; r < ROWS; r++){
                        for(let c = 0; c < COLS; c++){
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
                                velZ: 0
                            };
                        }
                    }
                }
            }["MeshCanvas.useEffect.buildGrid"];
            const idx = {
                "MeshCanvas.useEffect.idx": (c, r)=>r * COLS + c
            }["MeshCanvas.useEffect.idx"];
            const tick = {
                "MeshCanvas.useEffect.tick": ()=>{
                    const now = performance.now();
                    const t = (now - startTime) / 1000;
                    if (canvasAlpha < 1) {
                        canvasAlpha = Math.min(1, (now - startTime) / 2000);
                    }
                    // Physics: forces, spring, damping, integrate
                    for(let r = 0; r < ROWS; r++){
                        for(let c = 0; c < COLS; c++){
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
                                v.vx += dx / dist * f * 0.12;
                                v.vy += dy / dist * f * 0.12;
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
                    for(let r = 0; r < ROWS; r++){
                        for(let c = 0; c < COLS; c++){
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
                    for(let i = 0; i < vertices.length; i++){
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
                    for(let r = 0; r < ROWS; r++){
                        for(let c = 0; c < COLS - 1; c++){
                            const a = vertices[idx(c, r)];
                            const b = vertices[idx(c + 1, r)];
                            ctx.moveTo(a.x, a.y - a.offsetZ * 0.3);
                            ctx.lineTo(b.x, b.y - b.offsetZ * 0.3);
                        }
                    }
                    for(let c = 0; c < COLS; c++){
                        for(let r = 0; r < ROWS - 1; r++){
                            const a = vertices[idx(c, r)];
                            const b = vertices[idx(c, r + 1)];
                            ctx.moveTo(a.x, a.y - a.offsetZ * 0.3);
                            ctx.lineTo(b.x, b.y - b.offsetZ * 0.3);
                        }
                    }
                    ctx.stroke();
                    // Vertices
                    for(let i = 0; i < vertices.length; i++){
                        const v = vertices[i];
                        const distFromCenter = Math.hypot(v.restX - cx, v.restY - cy);
                        const centerFactor = Math.pow(1 - Math.min(1, distFromCenter / maxDist * 1.4), 1.5);
                        const disp = Math.hypot(v.x - v.restX, v.y - v.restY) + Math.abs(v.offsetZ);
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
                            const ed = Math.pow((v.restX - cx) / zoneW, 2) + Math.pow((v.restY - cy) / zoneH, 2);
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
                }
            }["MeshCanvas.useEffect.tick"];
            const updateMouseFromEvent = {
                "MeshCanvas.useEffect.updateMouseFromEvent": (e)=>{
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
                }
            }["MeshCanvas.useEffect.updateMouseFromEvent"];
            const onMouseMove = {
                "MeshCanvas.useEffect.onMouseMove": (e)=>updateMouseFromEvent(e)
            }["MeshCanvas.useEffect.onMouseMove"];
            const onMouseDown = {
                "MeshCanvas.useEffect.onMouseDown": (e)=>{
                    updateMouseFromEvent(e);
                    if (mouse.x > -1000) mouse.pressed = true;
                }
            }["MeshCanvas.useEffect.onMouseDown"];
            const onMouseUp = {
                "MeshCanvas.useEffect.onMouseUp": ()=>{
                    mouse.pressed = false;
                }
            }["MeshCanvas.useEffect.onMouseUp"];
            const onMouseOut = {
                "MeshCanvas.useEffect.onMouseOut": (e)=>{
                    if (!e.relatedTarget) {
                        mouse.x = -9999;
                        mouse.y = -9999;
                        mouse.pressed = false;
                    }
                }
            }["MeshCanvas.useEffect.onMouseOut"];
            const onResize = {
                "MeshCanvas.useEffect.onResize": ()=>buildGrid()
            }["MeshCanvas.useEffect.onResize"];
            buildGrid();
            if (!reduceMotion) {
                window.addEventListener("mousemove", onMouseMove, {
                    passive: true
                });
                window.addEventListener("mousedown", onMouseDown);
                window.addEventListener("mouseup", onMouseUp);
                document.addEventListener("mouseout", onMouseOut);
            }
            window.addEventListener("resize", onResize);
            raf = requestAnimationFrame(tick);
            return ({
                "MeshCanvas.useEffect": ()=>{
                    cancelAnimationFrame(raf);
                    window.removeEventListener("mousemove", onMouseMove);
                    window.removeEventListener("mousedown", onMouseDown);
                    window.removeEventListener("mouseup", onMouseUp);
                    document.removeEventListener("mouseout", onMouseOut);
                    window.removeEventListener("resize", onResize);
                }
            })["MeshCanvas.useEffect"];
        }
    }["MeshCanvas.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        "aria-hidden": true,
        className: "absolute inset-0 w-full h-full pointer-events-none",
        "data-testid": "canvas-mesh"
    }, void 0, false, {
        fileName: "[project]/components/landing/MeshCanvas.tsx",
        lineNumber: 288,
        columnNumber: 5
    }, this);
}
_s(MeshCanvas, "UJgi7ynoup7eqypjnwyX/s32POg=");
_c = MeshCanvas;
var _c;
__turbopack_context__.k.register(_c, "MeshCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/landing/HeroSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$MeshCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/landing/MeshCanvas.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const POWER4_OUT = [
    0.165,
    0.84,
    0.44,
    1
];
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.11,
            delayChildren: 0.3
        }
    }
};
const itemVariants = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.94,
        filter: "blur(6px)"
    },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.85,
            ease: POWER4_OUT
        }
    }
};
function BrandMark() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: "/",
        className: "inline-flex items-center gap-2 transition-opacity hover:opacity-100",
        style: {
            opacity: 0.6
        },
        "data-testid": "link-brand-home",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M12 2L21 7V12C21 16.97 17.84 21.43 13.34 22.82C12.46 23.06 11.54 23.06 10.66 22.82C6.16 21.43 3 16.97 3 12V7L12 2Z",
                        stroke: "#ffffff",
                        strokeWidth: "1.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/HeroSection.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M9 12L11 14L15 10",
                        stroke: "#3B82F6",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/HeroSection.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/HeroSection.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontFamily: "var(--font-mono)",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: "#ffffff"
                },
                children: "Dudilig"
            }, void 0, false, {
                fileName: "[project]/components/landing/HeroSection.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/HeroSection.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_c = BrandMark;
function statusMeta(status) {
    if (status === "pass") {
        return {
            color: "#22c55e",
            bg: "rgba(34,197,94,0.10)",
            border: "rgba(34,197,94,0.30)",
            label: "PASS"
        };
    }
    if (status === "warning") {
        return {
            color: "#eab308",
            bg: "rgba(234,179,8,0.10)",
            border: "rgba(234,179,8,0.30)",
            label: "REVIEW"
        };
    }
    return {
        color: "#ef4444",
        bg: "rgba(239,68,68,0.10)",
        border: "rgba(239,68,68,0.30)",
        label: "MISMATCH"
    };
}
function CertCard({ cert }) {
    const meta = statusMeta(cert.analysis.overallStatus);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: `/trust/${cert.id}`,
        "data-testid": `link-trust-${cert.id}`,
        className: "group flex flex-col h-full rounded-2xl p-6 md:p-4 lg:p-6 transition-colors duration-200",
        style: {
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)"
        },
        onMouseEnter: (e)=>e.currentTarget.style.borderColor = "rgba(59,130,246,0.40)",
        onMouseLeave: (e)=>e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3 mb-3.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center rounded-full",
                        style: {
                            color: meta.color,
                            background: meta.bg,
                            border: `1px solid ${meta.border}`,
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            letterSpacing: "0.10em",
                            padding: "4px 10px",
                            textTransform: "uppercase"
                        },
                        children: meta.label
                    }, void 0, false, {
                        fileName: "[project]/components/landing/HeroSection.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "tabular-nums",
                        style: {
                            color: meta.color,
                            opacity: 0.8,
                            fontFamily: "var(--font-mono)",
                            fontSize: "13px"
                        },
                        children: [
                            cert.analysis.score,
                            "/100"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/HeroSection.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/HeroSection.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "font-semibold mt-3.5",
                style: {
                    fontSize: "16px",
                    lineHeight: 1.3,
                    color: "#ffffff"
                },
                children: cert.tokenName
            }, void 0, false, {
                fileName: "[project]/components/landing/HeroSection.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1.5 truncate",
                style: {
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.45)"
                },
                children: [
                    cert.standardName,
                    " · ",
                    cert.issuerName
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/HeroSection.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/HeroSection.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_c1 = CertCard;
function HeroSection({ showcase }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen w-full overflow-hidden",
        style: {
            background: "#08080a",
            color: "#ffffff"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$MeshCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/components/landing/HeroSection.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 hero-radial pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/components/landing/HeroSection.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "absolute top-8 left-8 z-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BrandMark, {}, void 0, false, {
                    fileName: "[project]/components/landing/HeroSection.tsx",
                    lineNumber: 148,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/landing/HeroSection.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].main, {
                variants: containerVariants,
                initial: "hidden",
                animate: "show",
                className: "relative z-10 mx-auto max-w-5xl px-6 pt-28 sm:pt-36 pb-12 flex flex-col items-center text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        variants: itemVariants,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-flex items-center gap-2 rounded-full",
                            style: {
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                padding: "6px 14px",
                                fontFamily: "var(--font-mono)",
                                fontSize: "11px",
                                fontWeight: 500,
                                letterSpacing: "0.10em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.70)"
                            },
                            "data-testid": "badge-eyebrow",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "rounded-full animate-pulse-soft",
                                    style: {
                                        width: 4,
                                        height: 4,
                                        background: "#22c55e"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/HeroSection.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this),
                                "Agentic Due Diligence"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/landing/HeroSection.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/landing/HeroSection.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h1, {
                        variants: itemVariants,
                        className: "font-serif",
                        style: {
                            marginTop: 28,
                            fontSize: "clamp(3rem, 7.5vw, 6rem)",
                            fontWeight: 500,
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                            color: "#ffffff",
                            maxWidth: "20ch"
                        },
                        children: [
                            "The Compliance OS for",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gradient-accent font-serif italic",
                                children: "Tokenized Assets"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/HeroSection.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/HeroSection.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        variants: itemVariants,
                        className: "flex flex-wrap items-center justify-center gap-3",
                        style: {
                            marginTop: 40
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                className: "inline-flex items-center gap-1.5 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                                style: {
                                    background: "#ffffff",
                                    color: "#08080a",
                                    padding: "10px 28px",
                                    fontSize: 13,
                                    fontWeight: 500
                                },
                                onMouseEnter: (e)=>e.currentTarget.style.boxShadow = "0 0 40px rgba(255,255,255,0.10)",
                                onMouseLeave: (e)=>e.currentTarget.style.boxShadow = "none",
                                "data-testid": "link-get-started",
                                children: [
                                    "Get Started ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/landing/HeroSection.tsx",
                                        lineNumber: 220,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/landing/HeroSection.tsx",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard",
                                className: "inline-flex items-center gap-1.5 rounded-full transition-colors duration-200",
                                style: {
                                    background: "#18181b",
                                    border: "1px solid rgba(255,255,255,0.10)",
                                    color: "rgba(255,255,255,0.50)",
                                    padding: "10px 28px",
                                    fontSize: 13,
                                    fontWeight: 500
                                },
                                onMouseEnter: (e)=>{
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.20)";
                                    e.currentTarget.style.color = "rgba(255,255,255,0.70)";
                                },
                                onMouseLeave: (e)=>{
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                                    e.currentTarget.style.color = "rgba(255,255,255,0.50)";
                                },
                                "data-testid": "link-view-demo",
                                children: [
                                    "View Demo ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/landing/HeroSection.tsx",
                                        lineNumber: 243,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/landing/HeroSection.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/HeroSection.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    showcase.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].section, {
                        variants: itemVariants,
                        className: "w-full",
                        style: {
                            marginTop: 72
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontFamily: "var(--font-mono)",
                                            fontSize: 11,
                                            letterSpacing: "0.15em",
                                            textTransform: "uppercase",
                                            color: "rgba(255,255,255,0.40)"
                                        },
                                        children: "Live Trust Certificates"
                                    }, void 0, false, {
                                        fileName: "[project]/components/landing/HeroSection.tsx",
                                        lineNumber: 255,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/analyze",
                                        className: "transition-colors hover:text-[#60a5fa]",
                                        style: {
                                            fontSize: 13,
                                            color: "#3b82f6"
                                        },
                                        "data-testid": "link-publish-yours",
                                        children: "Publish yours →"
                                    }, void 0, false, {
                                        fileName: "[project]/components/landing/HeroSection.tsx",
                                        lineNumber: 266,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/landing/HeroSection.tsx",
                                lineNumber: 254,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-left",
                                style: {
                                    marginTop: 8,
                                    fontSize: 13,
                                    color: "rgba(255,255,255,0.40)"
                                },
                                children: "Public, signed compliance attestations — generated by reading the actual contract through Claude Opus 4.5."
                            }, void 0, false, {
                                fileName: "[project]/components/landing/HeroSection.tsx",
                                lineNumber: 276,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 items-stretch text-left",
                                style: {
                                    marginTop: 20,
                                    gap: 16
                                },
                                children: showcase.map((cert)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CertCard, {
                                        cert: cert
                                    }, cert.id, false, {
                                        fileName: "[project]/components/landing/HeroSection.tsx",
                                        lineNumber: 292,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/landing/HeroSection.tsx",
                                lineNumber: 287,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-left",
                                style: {
                                    marginTop: 20,
                                    fontSize: 12,
                                    color: "rgba(255,255,255,0.40)"
                                },
                                children: [
                                    "Every certificate above was generated in real time by an AI agent reading the actual smart contract and offering documents.",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/analyze",
                                        className: "transition-colors hover:text-[#60a5fa]",
                                        style: {
                                            color: "#3b82f6"
                                        },
                                        "data-testid": "link-verify-any",
                                        children: "Verify any of them →"
                                    }, void 0, false, {
                                        fileName: "[project]/components/landing/HeroSection.tsx",
                                        lineNumber: 305,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/landing/HeroSection.tsx",
                                lineNumber: 296,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/HeroSection.tsx",
                        lineNumber: 249,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].footer, {
                        variants: itemVariants,
                        className: "w-full text-center",
                        style: {
                            marginTop: 64,
                            paddingTop: 20,
                            borderTop: "1px solid rgba(255,255,255,0.06)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 10,
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    color: "rgba(255,255,255,0.30)"
                                },
                                children: "Demo Environment · Meridian Capital Partners"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/HeroSection.tsx",
                                lineNumber: 327,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    marginTop: 6,
                                    fontSize: 10,
                                    color: "rgba(255,255,255,0.25)"
                                },
                                children: "demo.dudilig.com · not for production use"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/HeroSection.tsx",
                                lineNumber: 338,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/HeroSection.tsx",
                        lineNumber: 318,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/HeroSection.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/HeroSection.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_c2 = HeroSection;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "BrandMark");
__turbopack_context__.k.register(_c1, "CertCard");
__turbopack_context__.k.register(_c2, "HeroSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_landing_0d-0d08._.js.map