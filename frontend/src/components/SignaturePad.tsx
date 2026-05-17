'use client';

/**
 * STEP-F2-023: Draw-mode SignaturePad component
 *
 * Features:
 * - Mouse + touch drawing with DPR scaling for sharp strokes
 * - Clear canvas
 * - Undo last stroke
 * - Line width selector: 2 / 4 / 6
 * - Color selector: #000000 (black) / #1E40AF (blue)
 * - Export transparent PNG via canvas.toDataURL("image/png")
 * - onSave(signatureImage: string) callback with base64 output
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/* ── Types ── */

export interface SignaturePadProps {
  onSave: (signatureImage: string) => void;
  onCancel?: () => void;
}

type StrokeColor = '#000000' | '#1E40AF';
type LineWidth = 2 | 4 | 6;

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: StrokeColor;
  width: LineWidth;
}

/* ── Constants ── */

const LINE_WIDTHS: LineWidth[] = [2, 4, 6];
const STROKE_COLORS: { value: StrokeColor; label: string }[] = [
  { value: '#000000', label: 'Hitam' },
  { value: '#1E40AF', label: 'Biru' },
];
const CANVAS_HEIGHT = 200;

/* ── Helpers ── */

function getCanvasPoint(canvas: HTMLCanvasElement, clientX: number, clientY: number): Point {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  return {
    x: (clientX - rect.left) * dpr,
    y: (clientY - rect.top) * dpr,
  };
}

function redrawStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  canvasWidth: number,
  canvasHeight: number,
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  for (const stroke of strokes) {
    if (stroke.points.length < 2) continue;
    ctx.beginPath();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width * (window.devicePixelRatio || 1);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.stroke();
  }
}

function isCanvasBlank(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d');
  if (!ctx) return true;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 0) return false;
  }
  return true;
}

/* ── Icons ── */

function UndoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7v6h6" />
      <path d="M3 13C5.333 7.667 9.6 5 16 5c4 0 7 1.667 9 5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

/* ── Component ── */

export default function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState<LineWidth>(2);
  const [strokeColor, setStrokeColor] = useState<StrokeColor>('#000000');
  const [isEmpty, setIsEmpty] = useState(true);

  // Refs for drawing loop (avoid stale closure in pointer handlers)
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Point[]>([]);
  const lineWidthRef = useRef<LineWidth>(2);
  const strokeColorRef = useRef<StrokeColor>('#000000');
  const strokesRef = useRef<Stroke[]>([]);

  // Keep refs in sync with state
  useEffect(() => {
    lineWidthRef.current = lineWidth;
  }, [lineWidth]);
  useEffect(() => {
    strokeColorRef.current = strokeColor;
  }, [strokeColor]);
  useEffect(() => {
    strokesRef.current = strokes;
  }, [strokes]);

  /* ── Canvas setup: DPR scaling ── */
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = container.clientWidth;
    const cssHeight = CANVAS_HEIGHT;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw existing strokes after resize
    redrawStrokes(ctx, strokesRef.current, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    setupCanvas();
    const observer = new ResizeObserver(setupCanvas);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [setupCanvas]);

  /* ── Drawing helpers ── */

  const startStroke = useCallback((point: Point) => {
    isDrawingRef.current = true;
    currentStrokeRef.current = [point];
    setIsDrawing(true);
    setCurrentStroke([point]);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.beginPath();
    ctx.strokeStyle = strokeColorRef.current;
    ctx.lineWidth = lineWidthRef.current * (window.devicePixelRatio || 1);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(point.x, point.y);
  }, []);

  const continueStroke = useCallback((point: Point) => {
    if (!isDrawingRef.current) return;
    currentStrokeRef.current = [...currentStrokeRef.current, point];

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }, []);

  const endStroke = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    setIsDrawing(false);

    const points = currentStrokeRef.current;
    if (points.length < 2) {
      // Single tap — draw a dot
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && points.length === 1) {
        const dpr = window.devicePixelRatio || 1;
        ctx.beginPath();
        ctx.arc(points[0].x, points[0].y, (lineWidthRef.current * dpr) / 2, 0, Math.PI * 2);
        ctx.fillStyle = strokeColorRef.current;
        ctx.fill();
      }
    }

    const newStroke: Stroke = {
      points,
      color: strokeColorRef.current,
      width: lineWidthRef.current,
    };

    const updated = [...strokesRef.current, newStroke];
    strokesRef.current = updated;
    setStrokes(updated);
    setIsEmpty(false);
    currentStrokeRef.current = [];
    setCurrentStroke([]);
  }, []);

  /* ── Mouse events ── */

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      startStroke(getCanvasPoint(canvas, e.clientX, e.clientY));
    },
    [startStroke],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      continueStroke(getCanvasPoint(canvas, e.clientX, e.clientY));
    },
    [continueStroke],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      endStroke();
    },
    [endStroke],
  );

  const handleMouseLeave = useCallback(() => {
    if (isDrawingRef.current) endStroke();
  }, [endStroke]);

  /* ── Touch events ── */

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault(); // prevent scroll while drawing
      const canvas = canvasRef.current;
      if (!canvas || e.touches.length === 0) return;
      const touch = e.touches[0];
      startStroke(getCanvasPoint(canvas, touch.clientX, touch.clientY));
    },
    [startStroke],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas || e.touches.length === 0) return;
      const touch = e.touches[0];
      continueStroke(getCanvasPoint(canvas, touch.clientX, touch.clientY));
    },
    [continueStroke],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      endStroke();
    },
    [endStroke],
  );

  /* ── Controls ── */

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokesRef.current = [];
    setStrokes([]);
    setIsEmpty(true);
  }, []);

  const handleUndo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const updated = strokesRef.current.slice(0, -1);
    strokesRef.current = updated;
    setStrokes(updated);
    redrawStrokes(ctx, updated, canvas.width, canvas.height);
    setIsEmpty(updated.length === 0);
  }, []);

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isCanvasBlank(canvas)) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  }, [onSave]);

  /* ── Render ── */

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {/* Color selector */}
        <div className="flex items-center gap-1.5">
          {STROKE_COLORS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-label={`Warna ${label}`}
              aria-pressed={strokeColor === value}
              onClick={() => setStrokeColor(value)}
              className={`h-6 w-6 rounded-full border-2 transition-all ${
                strokeColor === value
                  ? 'scale-110 border-accent shadow-sm'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              style={{ backgroundColor: value }}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200" aria-hidden="true" />

        {/* Line width selector */}
        <div className="flex items-center gap-1.5">
          {LINE_WIDTHS.map((w) => (
            <button
              key={w}
              type="button"
              aria-label={`Ketebalan ${w}px`}
              aria-pressed={lineWidth === w}
              onClick={() => setLineWidth(w)}
              className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                lineWidth === w
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <span
                className="block rounded-full"
                style={{
                  width: w + 4,
                  height: w,
                  backgroundColor: lineWidth === w ? '#2563EB' : '#94a3b8',
                }}
              />
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Undo */}
        <button
          type="button"
          onClick={handleUndo}
          disabled={strokes.length === 0}
          aria-label="Undo goresan terakhir"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <UndoIcon />
          Undo
        </button>

        {/* Clear */}
        <button
          type="button"
          onClick={handleClear}
          disabled={isEmpty}
          aria-label="Hapus semua goresan"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <TrashIcon />
          Hapus
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
        style={{ height: CANVAS_HEIGHT }}
      >
        {/* Empty state hint */}
        {isEmpty && !isDrawing && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="select-none text-sm text-slate-300">Tanda tangan di sini...</p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="block"
          style={{ touchAction: 'none', cursor: 'crosshair' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-label="Area menggambar tanda tangan"
          role="img"
        />
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Batal
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isEmpty}
          className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Gunakan Tanda Tangan
        </button>
      </div>
    </div>
  );
}
