/*
 * Adaptado de ElectricBorder do React Bits (https://reactbits.dev)
 * Copyright (c) 2026 David Haz — MIT + Commons Clause License Condition v1.0
 *
 * Mudanças: exportação nomeada, prop `active` para só animar sob o cursor,
 * cor herdada do tema em vez de fixa e respeito a prefers-reduced-motion.
 */

import { usePrefersReducedMotion } from "@hooks/Reveal";
import { useTheme } from "@hooks/Theme";
import * as React from "react";

const OCTAVES = 10;
const LACUNARITY = 1.6;
const GAIN = 0.7;
const FREQUENCY = 10;
const DISPLACEMENT = 60;
const BORDER_OFFSET = 60;

function random(x: number): number {
  return (Math.sin(x * 12.9898) * 43758.5453) % 1;
}

function noise2D(x: number, y: number): number {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;

  const a = random(i + j * 57);
  const b = random(i + 1 + j * 57);
  const c = random(i + (j + 1) * 57);
  const d = random(i + 1 + (j + 1) * 57);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
}

function octavedNoise(x: number, amplitude: number, time: number, seed: number): number {
  let y = 0;
  let currentAmplitude = amplitude;
  let currentFrequency = FREQUENCY;

  for (let i = 0; i < OCTAVES; i++) {
    const octaveAmplitude = i === 0 ? 0 : currentAmplitude;
    y += octaveAmplitude * noise2D(currentFrequency * x + seed * 100, time * currentFrequency * 0.3);
    currentFrequency *= LACUNARITY;
    currentAmplitude *= GAIN;
  }

  return y;
}

function cornerPoint(cx: number, cy: number, r: number, startAngle: number, arc: number, progress: number) {
  const angle = startAngle + progress * arc;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function roundedRectPoint(
  t: number,
  left: number,
  top: number,
  width: number,
  height: number,
  radius: number
) {
  const straightWidth = width - 2 * radius;
  const straightHeight = height - 2 * radius;
  const arc = (Math.PI * radius) / 2;
  const perimeter = 2 * straightWidth + 2 * straightHeight + 4 * arc;
  const distance = t * perimeter;
  let acc = 0;

  if (distance <= acc + straightWidth) {
    return { x: left + radius + ((distance - acc) / straightWidth) * straightWidth, y: top };
  }
  acc += straightWidth;

  if (distance <= acc + arc) {
    return cornerPoint(
      left + width - radius,
      top + radius,
      radius,
      -Math.PI / 2,
      Math.PI / 2,
      (distance - acc) / arc
    );
  }
  acc += arc;

  if (distance <= acc + straightHeight) {
    return { x: left + width, y: top + radius + ((distance - acc) / straightHeight) * straightHeight };
  }
  acc += straightHeight;

  if (distance <= acc + arc) {
    return cornerPoint(
      left + width - radius,
      top + height - radius,
      radius,
      0,
      Math.PI / 2,
      (distance - acc) / arc
    );
  }
  acc += arc;

  if (distance <= acc + straightWidth) {
    return { x: left + width - radius - ((distance - acc) / straightWidth) * straightWidth, y: top + height };
  }
  acc += straightWidth;

  if (distance <= acc + arc) {
    return cornerPoint(
      left + radius,
      top + height - radius,
      radius,
      Math.PI / 2,
      Math.PI / 2,
      (distance - acc) / arc
    );
  }
  acc += arc;

  if (distance <= acc + straightHeight) {
    return { x: left, y: top + height - radius - ((distance - acc) / straightHeight) * straightHeight };
  }
  acc += straightHeight;

  return cornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, (distance - acc) / arc);
}

type ElectricBorderProps = {
  active: boolean;
  borderRadius?: number;
  speed?: number;
  chaos?: number;
};

export function ElectricBorder({ active, borderRadius = 24, speed = 1, chaos = 0.1 }: ElectricBorderProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const hostRef = React.useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const color = resolvedTheme === "dark" ? "#fafafa" : "#09090b";

  React.useEffect(() => {
    if (!active || reducedMotion) return;
    const canvas = canvasRef.current;
    const host = hostRef.current?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let time = 0;
    let lastFrame = performance.now();
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width + BORDER_OFFSET * 2;
      height = rect.height + BORDER_OFFSET * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const draw = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      time += ((now - lastFrame) / 1000) * speed;
      lastFrame = now;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const borderWidth = width - 2 * BORDER_OFFSET;
      const borderHeight = height - 2 * BORDER_OFFSET;
      const radius = Math.min(borderRadius, Math.min(borderWidth, borderHeight) / 2);
      const perimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
      const samples = Math.floor(perimeter / 2);

      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const progress = i / samples;
        const point = roundedRectPoint(
          progress,
          BORDER_OFFSET,
          BORDER_OFFSET,
          borderWidth,
          borderHeight,
          radius
        );
        const x = point.x + octavedNoise(progress * 8, chaos, time, 0) * DISPLACEMENT;
        const y = point.y + octavedNoise(progress * 8, chaos, time, 1) * DISPLACEMENT;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      frame = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [active, reducedMotion, color, borderRadius, speed, chaos]);

  if (!active || reducedMotion) return null;

  return (
    <div ref={hostRef} aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <canvas ref={canvasRef} className="block" />
      </div>
      <div className="absolute inset-0 rounded-[inherit] opacity-60 blur-[1px] ring-2 ring-foreground" />
      <div className="absolute inset-0 rounded-[inherit] blur-[4px] ring-2 ring-foreground" />
    </div>
  );
}
