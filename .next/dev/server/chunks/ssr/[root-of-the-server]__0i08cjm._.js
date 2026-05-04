module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/favicon.ico (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/favicon.0x3dzn~oxb6tn.ico" + (globalThis["NEXT_CLIENT_ASSET_SUFFIX"] || ''));}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/app/favicon.ico (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$favicon$2e$ico__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 256,
    height: 256
};
}),
"[next]/internal/font/google/playfair_display_95973ca.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "playfair_display_95973ca-module__ZnWula__className",
  "variable": "playfair_display_95973ca-module__ZnWula__variable",
});
}),
"[next]/internal/font/google/playfair_display_95973ca.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_95973ca$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/playfair_display_95973ca.module.css [app-rsc] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_95973ca$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Playfair Display', 'Playfair Display Fallback'"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_95973ca$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_95973ca$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[project]/lib/storage/seed.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "readSeedManifest",
    ()=>readSeedManifest
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
;
const MANIFEST_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), "data", "certificates", "_seed.json");
async function readSeedManifest() {
    try {
        const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].readFile(MANIFEST_PATH, "utf8");
        return JSON.parse(raw);
    } catch  {
        return {};
    }
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/lib/crypto/hash.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "attestationHash",
    ()=>attestationHash,
    "canonicalize",
    ()=>canonicalize,
    "sha256Hex",
    ()=>sha256Hex
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
function canonicalize(value) {
    // Match JSON.stringify semantics for non-serializable values:
    // - top-level undefined / function / symbol -> "null" (we coerce instead
    //   of returning undefined so the canonical string is always valid JSON)
    // - inside arrays:  undefined -> "null"
    // - inside objects: undefined values are omitted entirely
    if (value === undefined || typeof value === "function" || typeof value === "symbol") {
        return "null";
    }
    if (value === null || typeof value !== "object") {
        return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
        return "[" + value.map((v)=>v === undefined || typeof v === "function" || typeof v === "symbol" ? "null" : canonicalize(v)).join(",") + "]";
    }
    const obj = value;
    const keys = Object.keys(obj).filter((k)=>{
        const v = obj[k];
        return v !== undefined && typeof v !== "function" && typeof v !== "symbol";
    }).sort();
    return "{" + keys.map((k)=>JSON.stringify(k) + ":" + canonicalize(obj[k])).join(",") + "}";
}
function sha256Hex(input) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(input, "utf8").digest("hex");
}
function attestationHash(payload) {
    return "sha256:" + sha256Hex(canonicalize(payload));
}
}),
"[project]/lib/storage/certificates.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCertificate",
    ()=>createCertificate,
    "getCertificate",
    ()=>getCertificate,
    "listCertificates",
    ()=>listCertificates,
    "newCertificateId",
    ()=>newCertificateId,
    "saveCertificate",
    ()=>saveCertificate
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$crypto$2f$hash$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/crypto/hash.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), "data", "certificates");
async function ensureDir() {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].mkdir(DATA_DIR, {
        recursive: true
    });
}
/**
 * URL-safe 12-char ID. Uses crypto random + base32-ish alphabet
 * (no ambiguous characters: removed 0/O/1/I/l).
 */ const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";
function newCertificateId() {
    const bytes = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(12);
    let out = "";
    for(let i = 0; i < 12; i++){
        out += ALPHABET[bytes[i] % ALPHABET.length];
    }
    return out;
}
function certPath(id) {
    if (!/^[a-z0-9-]+$/.test(id)) {
        throw new Error("Invalid certificate id");
    }
    return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(DATA_DIR, `${id}.json`);
}
async function saveCertificate(cert) {
    await ensureDir();
    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].writeFile(certPath(cert.id), JSON.stringify(cert, null, 2), "utf8");
}
async function createCertificate(args) {
    const id = newCertificateId();
    const createdAt = new Date().toISOString();
    const hashPayload = {
        id,
        issuerName: args.issuerName,
        tokenName: args.tokenName,
        standard: args.standard,
        standardName: args.standardName,
        contractAddress: args.contractAddress ?? null,
        network: args.network ?? null,
        claimedFacts: args.claimedFacts ?? {},
        contractCode: args.contractCode,
        analysis: args.analysis,
        createdAt
    };
    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$crypto$2f$hash$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["attestationHash"])(hashPayload);
    const cert = {
        id,
        issuerName: args.issuerName,
        tokenName: args.tokenName,
        standard: args.standard,
        standardName: args.standardName,
        contractAddress: args.contractAddress,
        network: args.network,
        claimedFacts: args.claimedFacts ?? {},
        contractCode: args.contractCode,
        analysis: args.analysis,
        hash,
        createdAt
    };
    await saveCertificate(cert);
    return cert;
}
async function getCertificate(id) {
    let filePath;
    try {
        filePath = certPath(id);
    } catch  {
        // Invalid id format -> treat as "not found" so callers can render 404
        return null;
    }
    try {
        const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].readFile(filePath, "utf8");
        return JSON.parse(raw);
    } catch (err) {
        const e = err;
        if (e.code === "ENOENT") return null;
        throw err;
    }
}
async function listCertificates() {
    try {
        await ensureDir();
        const files = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].readdir(DATA_DIR);
        const summaries = [];
        for (const file of files){
            if (!file.endsWith(".json")) continue;
            try {
                const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].readFile(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(DATA_DIR, file), "utf8");
                const cert = JSON.parse(raw);
                summaries.push({
                    id: cert.id,
                    issuerName: cert.issuerName,
                    tokenName: cert.tokenName,
                    standardName: cert.standardName,
                    overallStatus: cert.analysis.overallStatus,
                    score: cert.analysis.score,
                    createdAt: cert.createdAt
                });
            } catch  {
            // Skip malformed
            }
        }
        summaries.sort((a, b)=>b.createdAt.localeCompare(a.createdAt));
        return summaries;
    } catch  {
        return [];
    }
}
}),
"[project]/components/landing/HeroSection.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/components/landing/HeroSection.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/landing/HeroSection.tsx <module evaluation>", "default");
}),
"[project]/components/landing/HeroSection.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/components/landing/HeroSection.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/landing/HeroSection.tsx", "default");
}),
"[project]/components/landing/HeroSection.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/landing/HeroSection.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/landing/HeroSection.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_95973ca$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/playfair_display_95973ca.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2f$seed$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage/seed.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2f$certificates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage/certificates.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/landing/HeroSection.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
const dynamic = "force-dynamic";
async function Home() {
    const manifest = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2f$seed$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["readSeedManifest"])();
    const [clean, warning, mismatch] = await Promise.all([
        manifest.clean ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2f$certificates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCertificate"])(manifest.clean) : null,
        manifest.warning ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2f$certificates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCertificate"])(manifest.warning) : null,
        manifest.mismatch ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2f$certificates$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCertificate"])(manifest.mismatch) : null
    ]);
    const showcase = [];
    if (clean) showcase.push(clean);
    if (warning) showcase.push(warning);
    if (mismatch) showcase.push(mismatch);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$playfair_display_95973ca$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].variable,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
            showcase: showcase
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0i08cjm._.js.map