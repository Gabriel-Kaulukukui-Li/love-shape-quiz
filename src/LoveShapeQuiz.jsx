import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DATA ─── */
const QUESTIONS = [
  { id: 0, dim: "Intimacy", text: "I can share my worst thoughts without worrying they'll think less of me." },
  { id: 1, dim: "Intimacy", text: "We can sit in silence and it doesn't feel awkward." },
  { id: 2, dim: "Intimacy", text: "When something good or bad happens, they're the first person I want to tell." },
  { id: 3, dim: "Intimacy", text: "I feel more like myself around them." },
  { id: 4, dim: "Passion", text: "I think about them when they're not around." },
  { id: 5, dim: "Passion", text: "There's a physical pull toward them I can't explain." },
  { id: 6, dim: "Passion", text: "The thought of them with someone else bothers me" },
  { id: 7, dim: "Passion", text: "When we're together, everything else becomes background noise." },
  { id: 8, dim: "Commitment", text: "When things get difficult with them, my instinct is to work through it, not walk away." },
  { id: 9, dim: "Commitment", text: "I think about my life five years from now and they're in it." },
  { id: 10, dim: "Commitment", text: "I've made sacrifices for this relationship that I don't regret." },
  { id: 11, dim: "Commitment", text: "This relationship feels like something we're building, together." },
  { id: 12, dim: "Autonomy", text: "I still feel like a complete person when we're apart." },
  { id: 13, dim: "Autonomy", text: "I have friendships, goals, and interests that are mine, not ours." },
  { id: 14, dim: "Autonomy", text: "We support each other's individual growth even when our paths don't overlap." },
  { id: 15, dim: "Autonomy", text: "I can say no to them without it becoming a whole thing." },
];

const ARCHETYPES = [
  { name: "Consummate Love", targets: [8.5, 8, 8.5, 7.5], emoji: "◈",
    summary: "The rare configuration where all four dimensions fire together.",
    description: "This is what Sternberg called consummate love — but with the crucial addition of autonomy. You're not just close, attracted, and committed. You're also whole on your own. This is the hardest shape to build and the hardest to maintain, because every dimension demands ongoing investment. But when it works, it's not consuming. It's generative. Two complete people choosing each other, fully.",
    insight: "Your biggest risk isn't losing this — it's taking it for granted. Consummate love decays silently when people stop investing because things feel 'fine.'" },
  { name: "The Slow Burn", targets: [8.5, 3.5, 8, 6], emoji: "◎",
    summary: "Deep roots, steady warmth, no fireworks required.",
    description: "High intimacy and commitment with moderate passion. This is companionate love with a backbone. You chose each other not in a rush of dopamine but through accumulated trust. The neuroscience supports this shape — long-term couples who report high satisfaction often show this exact profile. The passion isn't gone; it's just not leading.",
    insight: "The gap to watch is passion. Not because you need butterflies, but because physical and romantic connection is the variable that distinguishes this from a deep friendship." },
  { name: "The Situationship", targets: [4.5, 7.5, 2.5, 8.5], emoji: "◌",
    summary: "All the energy, none of the architecture.",
    description: "Passion and autonomy are high. Commitment is low. Intimacy hovers in the middle — close enough to feel something, not close enough to feel safe. This is the defining relationship shape of a generation raised on optionality. It's not that you can't commit. It's that committing feels like foreclosing — and the cost-benefit math doesn't resolve.",
    insight: "The question to sit with: is the high autonomy here genuine independence, or is it a defense mechanism against vulnerability? Only you know. But the difference matters." },
  { name: "The Deep End", targets: [8, 8, 8, 2.5], emoji: "●",
    summary: "All in. Maybe too far in.",
    description: "Three dimensions are maxed, but autonomy is low. This relationship is intense, committed, and intimate — but you may have lost yourself inside it. This is the shape that feels like love in movies: total immersion, complete devotion. But the neuroscience of healthy attachment suggests that some separateness is necessary. Without autonomy, closeness becomes enmeshment.",
    insight: "Ask yourself: if this ended tomorrow, would you know who you are? If the answer takes too long, the autonomy gap isn't just a number." },
  { name: "The Entanglement", targets: [5, 8, 3, 3], emoji: "◍",
    summary: "Can't commit. Can't leave. Can't look away.",
    description: "High passion with low commitment and low autonomy. You're pulled toward this person with a force that overrides your better judgment, but there's no structure holding it together — and you've lost some of yourself in the process. This is the love shape that Marazziti's research links to OCD-like serotonin profiles: obsessive, intrusive, consuming.",
    insight: "This shape is a signal, not a destination. The intensity you feel is real, but intensity is not the same as depth. What would this relationship look like if you rebuilt your autonomy first?" },
  { name: "The Best Friend", targets: [8.5, 3, 5, 8], emoji: "○",
    summary: "The person you'd call first. About anything.",
    description: "High intimacy and autonomy, lower passion and moderate commitment. You know each other deeply, you support each other's independence, and there's genuine love here. What's ambiguous is whether this is romantic love or the deepest kind of friendship wearing a relationship label. Sternberg would call this 'liking' at scale.",
    insight: "The honest question: do you want more passion with this person, or do you want this level of intimacy with someone who also sets your nervous system on fire? Both are valid. But they lead to different decisions." },
  { name: "The Fling", targets: [3, 8.5, 2, 8.5], emoji: "✦",
    summary: "Ships in the night. Beautiful while it lasted.",
    description: "Pure passion and pure autonomy. No roots, no expectations, no pretense. This is eros at its most honest — mutual attraction without the weight of everything else. It's not shallow. It's just brief. And sometimes the brevity is the point.",
    insight: "Nothing to fix here unless you want something different. But if you keep finding yourself in this shape across multiple relationships, it might be worth asking what you're optimizing for." },
  { name: "The Builder", targets: [6, 5, 9, 6], emoji: "▣",
    summary: "Choosing to construct something, brick by brick.",
    description: "Commitment leads everything else. This is pragma — the love style the Greeks named for practicality. You've decided this person is worth building with, and you're investing accordingly. The passion and intimacy may not peak as high, but they're stable and intentional. This is the love shape that Finkel's suffocation model says works best: realistic expectations matched with real investment.",
    insight: "Your strength is durability. Your risk is settling into comfortable distance. Keep choosing closeness, not just co-existence." },
  { name: "The Orbit", targets: [5, 5, 4, 7], emoji: "◦",
    summary: "Circling. Close but never quite landing.",
    description: "Everything moderate, autonomy slightly elevated. You're present but not fully committed in any direction. This isn't apathy — it's ambivalence. And ambivalence in relationships usually means the evidence hasn't accumulated enough to cross a threshold in either direction. In accumulator model terms: your drift rate is near zero.",
    insight: "Orbiting is sustainable for a while, but it has a half-life. At some point, not deciding becomes the decision. What evidence would you need to commit — or to leave?" },
  { name: "The Anchor", targets: [8, 5, 8, 3], emoji: "◆",
    summary: "Grounded. Stable. Maybe too still.",
    description: "High intimacy and commitment, but low autonomy. This relationship is your home base — maybe your only base. You're deeply bonded and deeply invested, but your sense of self has quietly merged with the relationship. This is the shape that attachment theorists would flag: secure bonding is good, but identity fusion can make the relationship load-bearing for your entire psychological life.",
    insight: "The fix isn't less love. It's more you. What did you care about before this relationship? What would you pursue if you had full permission?" },
];

const PREVIEW_ARCHETYPES = [
  { name: "Consummate Love", values: [8.5, 8, 8.5, 7.5], color: "#ede6d6" },
  { name: "The Situationship", values: [4.5, 7.5, 2.5, 8.5], color: "#c9705b" },
  { name: "The Best Friend", values: [8.5, 3, 5, 8], color: "#d4a574" },
  { name: "The Deep End", values: [8, 8, 8, 2.5], color: "#5b7fb5" },
  { name: "The Slow Burn", values: [8.5, 3.5, 8, 6], color: "#7a9e8e" },
];

const DC = { Intimacy: "#d4a574", Passion: "#c9705b", Commitment: "#5b7fb5", Autonomy: "#7a9e8e" };
const DN = ["Intimacy", "Passion", "Commitment", "Autonomy"];
const DL = ["I", "P", "C", "A"];
// Cardinal angles: top, right, bottom, left
const DA = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

function getScores(answers) {
  const s = {};
  DN.forEach((d, i) => { const st = i * 4; s[d] = (answers[st] + answers[st+1] + answers[st+2] + answers[st+3]) / 4; });
  return s;
}
function getArchetype(scores) {
  const v = [scores.Intimacy, scores.Passion, scores.Commitment, scores.Autonomy];
  let best = null, bd = Infinity;
  ARCHETYPES.forEach((a) => { const d = Math.sqrt(a.targets.reduce((s,t,i) => s+(t-v[i])**2, 0)); if (d < bd) { bd = d; best = a; } });
  return best;
}
function fmt(n) { return n % 1 === 0 ? String(n) : n.toFixed(1); }

/* ─── ORGANIC BLOB (Canvas, animated) ─── */
function OrganicBlob({ scores, size = 340 }) {
  const canvasRef = useRef(null);
  const tRef = useRef(0);
  const rafRef = useRef(null);

  const targetVals = [scores.Intimacy / 10, scores.Passion / 10, scores.Commitment / 10, scores.Autonomy / 10];

  const dimColors = [[212, 165, 116], [201, 112, 91], [91, 127, 181], [122, 158, 142]];
  const totalScore = targetVals.reduce((a, b) => a + b, 0.001);
  const tintRgb = dimColors.reduce((acc, c, i) => {
    const w = targetVals[i] / totalScore;
    return [acc[0] + c[0] * w, acc[1] + c[1] * w, acc[2] + c[2] * w];
  }, [0, 0, 0]).map(Math.round);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = size, h = size;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = w / 2, cy = h / 2;
    const maxR = w * 0.38;
    const t = tRef.current;
    const [I, P, C, A] = targetVals;

    ctx.clearRect(0, 0, w, h);

    [0.33, 0.66, 1.0].forEach((lev) => {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * lev, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(237,230,214,0.04)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
    DA.forEach((a) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxR * 1.05 * Math.cos(a), cy + maxR * 1.05 * Math.sin(a));
      ctx.strokeStyle = "rgba(237,230,214,0.04)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    const N = 200;
    const pts = [];
    // Very low floor so valleys are real
    const floor = 0.08;

    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2;

      // Sharp lobes: narrow gaussian-like influence per axis
      let baseR = 0;
      for (let d = 0; d < 4; d++) {
        let diff = angle - DA[d];
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        // Narrow gaussian: sigma ~0.6 radians → sharp directional lobes
        const influence = Math.exp(-(diff * diff) / (2 * 0.55 * 0.55));
        // Cubic scaling: 0.3→0.027, 0.5→0.125, 0.85→0.614
        const dimVal = Math.pow(targetVals[d], 2.5);
        baseR += dimVal * influence;
      }
      // Normalize: at exactly a cardinal direction, influence≈1 for that axis
      // Between axes (~45°), influence drops to ~0.16 each → valley
      baseR = (floor + baseR * (1 - floor)) * maxR;

      // Passion: aggressive spikes, multi-frequency
      const pFactor = P * P * P; // cubic → 0.3=0.027, 0.75=0.42, 1.0=1.0
      const noiseAmp = pFactor * maxR * 0.38;
      // Intimacy smoothing: high I kills almost all noise
      const smoothDamp = Math.pow(Math.max(0, 1 - I * 0.85), 2);
      let noise = 0;
      noise += Math.sin(angle * 3 + t * 0.4) * 0.30;
      noise += Math.sin(angle * 5.7 - t * 0.65) * 0.25;
      noise += Math.sin(angle * 9.3 + t * 0.22) * 0.20;
      noise += Math.sin(angle * 15 - t * 0.5) * 0.15;
      noise += Math.sin(angle * 23 + t * 0.12) * 0.10;
      noise *= noiseAmp * (0.15 + smoothDamp * 0.85);

      // Breathing
      const breathSpeed = 0.35 + P * 1.0;
      const breathAmp = maxR * (0.004 + (1 - C) * 0.02);
      const breath = Math.sin(t * breathSpeed) * breathAmp;

      // Autonomy: dramatic scale 0.35–1.0
      const autoScale = 0.35 + A * 0.65;

      const r = Math.max(maxR * 0.03, (baseR + noise + breath) * autoScale);
      pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }

    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const p0 = pts[(i - 1 + N) % N];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % N];
      const p3 = pts[(i + 2) % N];
      if (i === 0) ctx.moveTo(p1.x, p1.y);
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    ctx.closePath();

    // Fill: commitment from ghostly to very solid
    const fillAlpha = 0.01 + Math.pow(C, 2.5) * 0.22;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    grad.addColorStop(0, `rgba(${tintRgb[0]},${tintRgb[1]},${tintRgb[2]},${fillAlpha + 0.08})`);
    grad.addColorStop(0.45, `rgba(${tintRgb[0]},${tintRgb[1]},${tintRgb[2]},${fillAlpha * 0.7})`);
    grad.addColorStop(1, `rgba(${tintRgb[0]},${tintRgb[1]},${tintRgb[2]},${fillAlpha * 0.05})`);
    ctx.fillStyle = grad;
    ctx.fill();

    // Stroke
    const strokeAlpha = 0.08 + C * 0.55;
    const strokeWidth = 0.4 + C * 1.6;
    ctx.strokeStyle = `rgba(${tintRgb[0]},${tintRgb[1]},${tintRgb[2]},${strokeAlpha})`;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // Outer glow: passion
    ctx.save();
    const glowBlur = 3 + P * P * P * 24;
    ctx.filter = `blur(${glowBlur}px)`;
    ctx.strokeStyle = `rgba(${tintRgb[0]},${tintRgb[1]},${tintRgb[2]},${0.01 + P * P * 0.15})`;
    ctx.lineWidth = 1.5 + P * 4;
    ctx.stroke();
    ctx.restore();

    // Inner core glow: commitment
    if (C > 0.25) {
      ctx.save();
      ctx.filter = `blur(${18 + C * 16}px)`;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.45);
      coreGrad.addColorStop(0, `rgba(${tintRgb[0]},${tintRgb[1]},${tintRgb[2]},${Math.pow(C, 2) * 0.14})`);
      coreGrad.addColorStop(1, `rgba(${tintRgb[0]},${tintRgb[1]},${tintRgb[2]},0)`);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Labels
    ctx.font = "500 11px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const labelR = maxR * 1.18;
    DN.forEach((name, i) => {
      const lx = cx + labelR * Math.cos(DA[i]);
      const ly = cy + labelR * Math.sin(DA[i]);
      const c = Object.values(DC)[i];
      ctx.fillStyle = c.replace(")", ",0.55)").replace("rgb", "rgba");
      ctx.fillText(name, lx, ly);
      ctx.font = "300 10px 'Cormorant Garamond', serif";
      ctx.fillStyle = "rgba(237,230,214,0.25)";
      ctx.fillText(fmt(scores[DN[i]]), lx, ly + 14);
      ctx.font = "500 11px 'DM Sans', sans-serif";
    });

    tRef.current += 0.018;
    rafRef.current = requestAnimationFrame(draw);
  }, [scores, size]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  return <canvas ref={canvasRef} style={{ width: size, height: size, display: "block", margin: "0 auto" }} />;
}

/* ─── MINI ORGANIC BLOB (SVG, static for landing page) ─── */
function MiniBlob({ values, color, size = 88 }) {
  const cx = size / 2, cy = size / 2, maxR = size * 0.36;
  const [I, P, C, A] = values.map((v) => v / 10);
  const floor = 0.08;

  const N = 140;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
    let baseR = 0;
    for (let d = 0; d < 4; d++) {
      let diff = angle - DA[d];
      while (diff > Math.PI) diff -= 2 * Math.PI;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      const influence = Math.exp(-(diff * diff) / (2 * 0.55 * 0.55));
      const dimVal = Math.pow([I, P, C, A][d], 2.5);
      baseR += dimVal * influence;
    }
    baseR = (floor + baseR * (1 - floor)) * maxR;
    // Passion spikes
    const pFactor = P * P * P;
    const noiseAmp = pFactor * maxR * 0.35;
    const smoothDamp = Math.pow(Math.max(0, 1 - I * 0.85), 2);
    let noise = Math.sin(angle * 3 + 1.2) * 0.30 + Math.sin(angle * 5.7 - 0.8) * 0.25 + Math.sin(angle * 9.3 + 0.5) * 0.20 + Math.sin(angle * 15 - 0.3) * 0.15 + Math.sin(angle * 23 + 0.7) * 0.10;
    noise *= noiseAmp * (0.15 + smoothDamp * 0.85);
    const autoScale = 0.35 + A * 0.65;
    const r = Math.max(maxR * 0.03, (baseR + noise) * autoScale);
    pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }

  let d = "";
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
    if (i === 0) d += `M${p1.x.toFixed(1)},${p1.y.toFixed(1)} `;
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)} `;
  }
  d += "Z";

  const fillOpacity = 0.02 + Math.pow(C, 2.5) * 0.18;
  const strokeOpacity = 0.1 + C * 0.5;
  const glowStd = 1 + P * P * P * 6;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.33, 0.66, 1].map((l) => <circle key={l} cx={cx} cy={cy} r={maxR * l} fill="none" stroke="rgba(237,230,214,0.04)" strokeWidth={0.4} />)}
      <defs>
        <radialGradient id={`g-${color.replace("#","")}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity + 0.06} />
          <stop offset="100%" stopColor={color} stopOpacity={fillOpacity * 0.08} />
        </radialGradient>
        <filter id={`glow-${color.replace("#","")}`}><feGaussianBlur stdDeviation={glowStd} /></filter>
      </defs>
      <path d={d} fill={`url(#g-${color.replace("#","")})`} stroke={color} strokeWidth={0.3 + C * 1.2} strokeOpacity={strokeOpacity} />
      <path d={d} fill="none" stroke={color} strokeWidth={1 + P * 2.5} strokeOpacity={0.02 + P * P * 0.1} filter={`url(#glow-${color.replace("#","")})`} />
      {DA.map((a, i) => <text key={i} x={cx + (maxR + 10) * Math.cos(a)} y={cy + (maxR + 10) * Math.sin(a)} textAnchor="middle" dominantBaseline="central" fill="rgba(237,230,214,0.18)" fontSize={7} fontFamily="DM Sans,sans-serif" fontWeight={500}>{DL[i]}</text>)}
    </svg>
  );
}

/* ─── LANDING ─── */
function Landing({ onStart }) {
  const top3 = PREVIEW_ARCHETYPES.slice(0, 3);
  const bot2 = PREVIEW_ARCHETYPES.slice(3, 5);
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "2.2rem", marginBottom: "1.4rem", opacity: 0.2, letterSpacing: "0.5rem" }}>◇ ◆ ◇</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.3rem,6vw,3.6rem)", fontWeight: 300, lineHeight: 1.12, marginBottom: "1.4rem", color: "#ede6d6", letterSpacing: "-0.02em" }}>
          What Shape Is<br />Your Love?
        </h1>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1.02rem", lineHeight: 1.7, color: "#9e978a", maxWidth: 430, margin: "0 auto 0.6rem" }}>
          Different relationships don't have different <em style={{ color: "#c8c1b4" }}>amounts</em> of love. They have different <em style={{ color: "#c8c1b4" }}>shapes</em>.
        </p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.86rem", lineHeight: 1.65, color: "#5e5952", maxWidth: 400, margin: "0 auto 2.8rem" }}>
          16 questions. Four dimensions. One shape that's yours.
        </p>

        {/* 3-2 grid */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1.4rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
          {top3.map((a) => (
            <div key={a.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 115 }}>
              <MiniBlob values={a.values} color={a.color} size={92} />
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.82rem", fontWeight: 400, color: a.color, marginTop: "0.35rem", lineHeight: 1.2 }}>{a.name}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", color: "#4e4a44", lineHeight: 1.35, textAlign: "center", marginTop: "0.1rem" }}>{a.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.4rem", marginBottom: "3rem" }}>
          {bot2.map((a) => (
            <div key={a.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 115 }}>
              <MiniBlob values={a.values} color={a.color} size={92} />
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.82rem", fontWeight: 400, color: a.color, marginTop: "0.35rem", lineHeight: 1.2 }}>{a.name}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", color: "#4e4a44", lineHeight: 1.35, textAlign: "center", marginTop: "0.1rem" }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <button onClick={onStart} style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.93rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "1rem 2.8rem", background: "transparent", color: "#ede6d6", border: "1px solid rgba(237,230,214,0.25)", borderRadius: 0, cursor: "pointer", transition: "all 0.3s ease",
        }}
          onMouseEnter={(e) => { e.target.style.background = "rgba(237,230,214,0.08)"; e.target.style.borderColor = "rgba(237,230,214,0.5)"; }}
          onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(237,230,214,0.25)"; }}
        >Map Your Love</button>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: "#3a3733", marginTop: "2rem" }}>
          Grounded in Sternberg's Triangular Theory of Love, extended with autonomy for modern relationships.
        </p>
      </div>
    </div>
  );
}

/* ─── INTRO ─── */
function Intro({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.4rem,4vw,1.9rem)", fontWeight: 300, lineHeight: 1.6, color: "#ede6d6", marginBottom: "1.2rem", fontStyle: "italic" }}>
          Think of someone you love.
        </p>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", lineHeight: 1.75, color: "#9e978a", marginBottom: "2.8rem" }}>
          Answer every question about that one relationship only. Not love in general. Not how you wish things were. Just how it actually feels right now.
        </p>
        <button onClick={onStart} style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.93rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "1rem 2.8rem", background: "transparent", color: "#ede6d6", border: "1px solid rgba(237,230,214,0.25)", borderRadius: 0, cursor: "pointer", transition: "all 0.3s ease",
        }}
          onMouseEnter={(e) => { e.target.style.background = "rgba(237,230,214,0.08)"; e.target.style.borderColor = "rgba(237,230,214,0.5)"; }}
          onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "rgba(237,230,214,0.25)"; }}
        >Begin →</button>
      </div>
    </div>
  );
}

/* ─── QUIZ ─── */
function Quiz({ onComplete }) {
  const [cur, setCur] = useState(0);
  const [ans, setAns] = useState(Array(16).fill(5));
  const [fading, setFading] = useState(false);
  const q = QUESTIONS[cur];
  const dc = DC[q.dim];
  const pct = ((cur + 1) / 16) * 100;
  const slPct = ((ans[cur] - 1) / 9) * 100;

  const go = (dir) => {
    const next = cur + dir;
    if (next < 0 || next > 16) return;
    if (next === 16) { onComplete(ans); return; }
    setFading(true);
    setTimeout(() => { setCur(next); setFading(false); }, 220);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: 570, margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: "2.8rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem", fontFamily: "'DM Sans',sans-serif", fontSize: "0.73rem", color: "#6e685e", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            <span style={{ color: dc, fontWeight: 500 }}>{q.dim}</span>
            <span>{cur + 1} / 16</span>
          </div>
          <div style={{ width: "100%", height: 2, background: "rgba(237,230,214,0.08)", borderRadius: 1 }}>
            <div style={{ width: `${pct}%`, height: "100%", background: dc, borderRadius: 1, transition: "width 0.4s ease" }} />
          </div>
        </div>
        <div style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(6px)" : "translateY(0)", transition: "all 0.22s ease" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.28rem,3.4vw,1.6rem)", fontWeight: 300,
            lineHeight: 1.5, color: "#ede6d6", marginBottom: "2.8rem", minHeight: "4rem", fontStyle: "italic",
          }}>{q.text}</p>
          <div style={{ marginBottom: "1.2rem" }}>
            <input type="range" min={1} max={10} step={0.5} value={ans[cur]}
              onChange={(e) => { const n = [...ans]; n[cur] = Number(e.target.value); setAns(n); }}
              style={{
                width: "100%", appearance: "none", WebkitAppearance: "none", height: 3,
                background: `linear-gradient(to right, ${dc} 0%, ${dc} ${slPct}%, rgba(237,230,214,0.1) ${slPct}%, rgba(237,230,214,0.1) 100%)`,
                borderRadius: 2, outline: "none", cursor: "pointer",
              }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: "#5e5952", marginTop: "0.3rem" }}>
              <span>not at all</span>
              <span style={{ color: dc, fontSize: "1.25rem", fontWeight: 500, fontFamily: "'Cormorant Garamond',serif", minWidth: "2.5rem", textAlign: "center" }}>{fmt(ans[cur])}</span>
              <span>completely</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2.4rem" }}>
            <button onClick={() => go(-1)} disabled={cur === 0} style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", letterSpacing: "0.04em", padding: "0.65rem 1.4rem",
              background: "transparent", color: cur === 0 ? "#302d28" : "#6e685e",
              border: `1px solid ${cur === 0 ? "rgba(237,230,214,0.04)" : "rgba(237,230,214,0.12)"}`, cursor: cur === 0 ? "default" : "pointer", transition: "all 0.2s",
            }}>← Back</button>
            <button onClick={() => go(1)} style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.04em", padding: "0.65rem 1.4rem",
              background: cur === 15 ? dc : "transparent", color: cur === 15 ? "#0d0d14" : "#ede6d6",
              border: `1px solid ${cur === 15 ? dc : "rgba(237,230,214,0.2)"}`, cursor: "pointer", transition: "all 0.2s",
            }}>{cur === 15 ? "See My Shape →" : "Next →"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── RESULTS ─── */
function Results({ scores, onReset }) {
  const arch = getArchetype(scores);
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 80); }, []);

  const sorted = [...DN].sort((a, b) => scores[b] - scores[a]);
  const hi = sorted[0], lo = sorted[3];

  return (
    <div style={{
      minHeight: "100vh", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center",
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)", transition: "all 0.7s ease",
    }}>
      <div style={{ maxWidth: 570, width: "100%", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem", paddingTop: "0.8rem" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5e5952", marginBottom: "0.5rem" }}>Your love shape</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,5vw,2.7rem)", fontWeight: 300, color: "#ede6d6", marginBottom: "0.5rem" }}>{arch.name}</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.93rem", color: "#9e978a", fontStyle: "italic" }}>{arch.summary}</p>
        </div>

        {/* Organic Blob */}
        <div style={{ margin: "0 auto 1.8rem", maxWidth: 360 }}>
          <OrganicBlob scores={scores} size={Math.min(360, typeof window !== "undefined" ? window.innerWidth - 64 : 360)} />
        </div>

        {/* Score Bars */}
        <div style={{ marginBottom: "2.4rem" }}>
          {DN.map((d) => (
            <div key={d} style={{ marginBottom: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans',sans-serif", fontSize: "0.73rem", marginBottom: "0.25rem" }}>
                <span style={{ color: DC[d], fontWeight: 500 }}>{d}</span>
                <span style={{ color: "#5e5952" }}>{fmt(scores[d])} / 10</span>
              </div>
              <div style={{ width: "100%", height: 4, background: "rgba(237,230,214,0.05)", borderRadius: 2 }}>
                <div style={{ width: `${(scores[d] / 10) * 100}%`, height: "100%", background: DC[d], borderRadius: 2, transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ width: 36, height: 1, background: "rgba(237,230,214,0.12)", margin: "0 auto 2.4rem" }} />

        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.12rem", lineHeight: 1.75, color: "#c8c1b4", marginBottom: "1.4rem" }}>{arch.description}</p>
        <div style={{ borderLeft: "2px solid rgba(237,230,214,0.1)", paddingLeft: "1.1rem", marginBottom: "2rem" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.84rem", lineHeight: 1.7, color: "#9e978a" }}>
            <span style={{ fontWeight: 500, color: "#ede6d6" }}>The insight: </span>{arch.insight}
          </p>
        </div>

        <div style={{ background: "rgba(237,230,214,0.025)", border: "1px solid rgba(237,230,214,0.05)", padding: "1.4rem", marginBottom: "2.4rem" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: "#5e5952", marginBottom: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Quick read</p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", lineHeight: 1.7, color: "#9e978a" }}>
            Your strongest dimension is <span style={{ color: DC[hi], fontWeight: 500 }}>{hi.toLowerCase()}</span> and your most underdeveloped is <span style={{ color: DC[lo], fontWeight: 500 }}>{lo.toLowerCase()}</span>.
            {lo === "Commitment" && " This tracks with the broader generational pattern. Not a lack of love, but a cost-benefit hesitation under optionality."}
            {lo === "Autonomy" && " This suggests the relationship may be carrying weight that belongs to you individually. Your identity and your love shouldn't be the same structure."}
            {lo === "Passion" && " Passion decays exponentially in every relationship. The question isn't whether it's low. It's whether you're investing in what regenerates it."}
            {lo === "Intimacy" && " Real intimacy requires vulnerability. The willingness to be seen without curation. High scores elsewhere without intimacy suggests performance, not connection."}
          </p>
        </div>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: "#5e5952", marginBottom: "0.9rem" }}>
            The essay behind this quiz explores why your generation's love shapes look different from your parents'.
          </p>
          <a href="#" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.84rem", fontWeight: 500, letterSpacing: "0.04em", color: "#ede6d6", textDecoration: "none", borderBottom: "1px solid rgba(237,230,214,0.25)", paddingBottom: "0.15rem" }}>
            Read on Substack →
          </a>
        </div>
        <div style={{ textAlign: "center", paddingBottom: "3rem", marginTop: "1rem" }}>
          <button onClick={onReset} style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: "0.73rem", letterSpacing: "0.04em", padding: "0.55rem 1.3rem",
            background: "transparent", color: "#4a453e", border: "1px solid rgba(237,230,214,0.07)", cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.target.style.color = "#6e685e"; e.target.style.borderColor = "rgba(237,230,214,0.14)"; }}
            onMouseLeave={(e) => { e.target.style.color = "#4a453e"; e.target.style.borderColor = "rgba(237,230,214,0.07)"; }}
          >Retake Quiz</button>
        </div>
      </div>
    </div>
  );
}

/* ─── APP ─── */
export default function LoveShapeQuiz() {
  const [phase, setPhase] = useState("landing");
  const [scores, setScores] = useState(null);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body,html{background:#0d0d14;color:#ede6d6;-webkit-font-smoothing:antialiased}
        input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:#ede6d6;cursor:pointer;border:none;box-shadow:0 0 12px rgba(237,230,214,0.25)}
        input[type="range"]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#ede6d6;cursor:pointer;border:none;box-shadow:0 0 12px rgba(237,230,214,0.25)}
        ::selection{background:rgba(201,112,91,0.3);color:#ede6d6}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{ background: "#0d0d14", minHeight: "100vh", animation: "fadeIn 0.6s ease" }}>
        {phase === "landing" && <Landing onStart={() => setPhase("intro")} />}
        {phase === "intro" && <Intro onStart={() => setPhase("quiz")} />}
        {phase === "quiz" && <Quiz onComplete={(a) => { setScores(getScores(a)); setPhase("results"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}
        {phase === "results" && scores && <Results scores={scores} onReset={() => { setScores(null); setPhase("landing"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}
      </div>
    </>
  );
}
