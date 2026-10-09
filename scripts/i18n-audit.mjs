#!/usr/bin/env node
// Zero-dependency i18n audit: node scripts/i18n-audit.mjs [srcDir] [--json]
import fs from "fs";
import path from "path";

const SRC = path.resolve(process.argv.find((a,i)=>i>1 && !a.startsWith("--")) || "src");
const LANGS = ["en", "am", "it"];
const out = { parity: [], untranslated: [], missingKeys: [], dynamicKeys: [], hardcoded: [], ethiopicInCode: [] };

const read = (f) => fs.readFileSync(f, "utf8");
const walk = (d, acc = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc); else acc.push(p);
  }
  return acc;
};
const flat = (o, pre = "", acc = {}) => {
  for (const [k, v] of Object.entries(o)) {
    const key = pre ? `${pre}.${k}` : k;
    if (v && typeof v === "object") flat(v, key, acc); else acc[key] = v;
  }
  return acc;
};

// ---------- 1. locale files ----------
const locDir = path.join(SRC, "locales");
const data = {};
for (const l of LANGS) {
  data[l] = {};
  for (const f of fs.readdirSync(path.join(locDir, l)).filter((x) => x.endsWith(".json"))) {
    const ns = f.replace(".json", "");
    const camel = ns === "churchsupport" ? "churchSupport" : ns;
    try { data[l][camel] = flat(JSON.parse(read(path.join(locDir, l, f)))); }
    catch (e) { out.parity.push(`INVALID JSON ${l}/${f}: ${e.message}`); }
  }
}
const allNs = new Set(LANGS.flatMap((l) => Object.keys(data[l])));
for (const ns of allNs) {
  const keys = new Set(LANGS.flatMap((l) => Object.keys(data[l][ns] || {})));
  for (const k of keys) for (const l of LANGS) {
    const v = data[l][ns]?.[k];
    if (v === undefined) out.parity.push(`${l}  MISSING  ${ns}.${k}`);
    else if (typeof v === "string" && v.trim() === "") out.parity.push(`${l}  EMPTY    ${ns}.${k}`);
  }
  for (const l of ["am", "it"]) for (const [k, v] of Object.entries(data[l][ns] || {})) {
    const en = data.en[ns]?.[k];
    if (typeof v === "string" && v === en && /[A-Za-z]{3,}/.test(v) && !/^(https?:|\S+@\S+|@\S+|[\d\s+()-]+$)/.test(v) && !/\.(query|mapQuery|place)$|^(Facebook|Instagram|YouTube|Home|Media|Team|Video|Audio|Email|Password|Newsletter|Debre.*)$|^in \{\{/.test(v) && !/\.(query|mapQuery|place|attribution)$/.test(k))
      out.untranslated.push(`${l}  SAME-AS-EN  ${ns}.${k} = ${JSON.stringify(v.slice(0, 60))}`);
    if (l === "am" && typeof v === "string" && /[A-Za-z]{4,}/.test(v) && !/[\u1200-\u137F]/.test(v) && v !== en)
      out.untranslated.push(`am  NO-ETHIOPIC  ${ns}.${k} = ${JSON.stringify(v.slice(0, 60))}`);
  }
}

// ---------- 2. code scan ----------
const files = walk(SRC).filter((f) => /\.(jsx?|tsx?)$/.test(f) && !/\.(bak)$|before-grid/.test(f) && !f.includes("/locales/"));
const rel = (f) => path.relative(SRC, f);
const lineOf = (s, i) => s.slice(0, i).split("\n").length;
const exists = (l, ns, k) => data[l][ns] && (data[l][ns][k] !== undefined || Object.keys(data[l][ns]).some((x) => x.startsWith(k + ".")));

for (const f of files) {
  const s = read(f).replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " ")).replace(/(^|\s)\/\/.*$/gm, "$1");
  // static + dynamic t() keys
  for (const m of s.matchAll(/\bt\(\s*(["'`])((?:\\.|(?!\1)[^\\])*)\1(\s*,\s*(?:(["'`])|\{\s*defaultValue))?/g)) {
    const key = m[2];
    if (key.includes("${")) { out.dynamicKeys.push(`${rel(f)}:${lineOf(s, m.index)}  t(\`${key}\`)`); continue; }
    const [ns, ...rest] = key.split(".");
    const k = rest.join(".");
    const miss = LANGS.filter((l) => !exists(l, ns, k));
    if (miss.length) out.missingKeys.push(`${rel(f)}:${lineOf(s, m.index)}  ${key}  missing in [${miss}]${m[3] ? "  (has inline English/Amharic default → shows wrong language)" : ""}`);
  }
  // Ethiopic hardcoded in code (not locale)
  s.split("\n").forEach((ln, i) => {
    if (/[\u1200-\u137F]/.test(ln) && !/^\s*(\/\/|\*|\/\*)/.test(ln)) out.ethiopicInCode.push(`${rel(f)}:${i + 1}  ${ln.trim().slice(0, 110)}`);
  });
  // hardcoded JSX text nodes
  for (const m of s.matchAll(/>([^<>{}\n][^<>{}]*?)</g)) {
    const t = m[1].replace(/&[a-z]+;/g, " ").trim();
    if (/[A-Za-z]{3,}/.test(t) && !/^[\s\W\d]*$/.test(t) && !/=>|\bconst\b|\breturn\b|;\s*$/.test(t))
      out.hardcoded.push(`${rel(f)}:${lineOf(s, m.index)}  TEXT   ${t.slice(0, 80)}`);
  }
  for (const m of s.matchAll(/\|\|\s*"([A-Z][^"]{3,})"/g)) out.hardcoded.push(`${rel(f)}:${lineOf(s, m.index)}  FALLBACK || "${m[1].slice(0, 60)}"`);
  for (const m of s.matchAll(/\n[ \t]+([A-Z][A-Za-z ,.'!?-]{3,60})\n[ \t]*(?=<\/|\{)/g)) out.hardcoded.push(`${rel(f)}:${lineOf(s, m.index + 1)}  TEXT   ${m[1]}`);
  // hardcoded attributes
  for (const m of s.matchAll(/\b(placeholder|title|alt|aria-label|label|aria-description)=(?:"([^"{}]*[A-Za-z]{3,}[^"{}]*)"|\{\s*"([^"]*[A-Za-z]{3,}[^"]*)"\s*\})/g))
    out.hardcoded.push(`${rel(f)}:${lineOf(s, m.index)}  ATTR   ${m[1]}="${(m[2] || m[3]).slice(0, 70)}"`);
  // hardcoded user-facing strings in setters / alert
  for (const m of s.matchAll(/\b(set(?:Error|Msg|Message|Status|Notice|Success|Toast)\w*|alert)\(\s*(["'`])((?:\\.|(?!\2)[^\\])*)\2/g))
    if (/[A-Za-z]{3,}/.test(m[3])) out.hardcoded.push(`${rel(f)}:${lineOf(s, m.index)}  MSG    ${m[1]}("${m[3].slice(0, 70)}")`);
  // t(key, "inline fallback")
  for (const m of s.matchAll(/\bt\(\s*(["'`][^"'`]+["'`])\s*,\s*(["'`])((?:\\.|(?!\2)[^\\])*)\2/g))
    if (!out.missingKeys.some((x) => x.includes(m[1].slice(1, -1)))) { /* key exists; default harmless */ }
  // files with visible JSX but no translation hook
  if (/return\s*\(\s*</.test(s) && !/useTranslation|i18n/.test(s) && /\.jsx$/.test(f))
    out.hardcoded.push(`${rel(f)}  NO-useTranslation  component renders JSX but never calls useTranslation`);
}

// ---------- report ----------
const dedupe = (a) => [...new Set(a)];
if (process.argv.includes("--json")) { console.log(JSON.stringify(out, null, 2)); process.exit(0); }
const sec = (title, arr) => { arr = dedupe(arr); console.log(`\n=== ${title} (${arr.length}) ===`); arr.forEach((x) => console.log("  " + x)); };
sec("1. LOCALE PARITY: missing/empty keys between en/am/it", out.parity);
sec("2. UNTRANSLATED values (same as English / Latin text in Amharic)", out.untranslated);
sec("3. t() KEYS used in code but missing from locale files", out.missingKeys);
sec("4. DYNAMIC t() keys (verify manually)", out.dynamicKeys);
sec("5. HARDCODED Amharic inside code (won't switch language)", out.ethiopicInCode);
sec("6. HARDCODED user-visible strings in JSX", out.hardcoded);

