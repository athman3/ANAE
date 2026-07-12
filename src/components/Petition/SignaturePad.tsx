'use client';

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useTranslations } from 'next-intl';

export interface SignaturePadHandle {
  isEmpty: () => boolean;
  toDataURL: () => string;
  clear: () => void;
}

interface SignaturePadProps {
  disabled?: boolean;
}

const CANVAS_ASPECT_RATIO = 3; // width / height — 3:1

const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(
  ({ disabled = false }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const hasStrokes = useRef(false);
    const t = useTranslations('petition');

    const getCtx = useCallback((): CanvasRenderingContext2D | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      const dpr = window.devicePixelRatio || 1;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2 * dpr;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      return ctx;
    }, []);

    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      const wrapper = wrapperRef.current;
      if (!canvas || !wrapper) return;

      const cssWidth = wrapper.clientWidth;
      if (cssWidth === 0) return; // layout not ready yet, skip

      const dpr = window.devicePixelRatio || 1;
      const cssHeight = Math.round(cssWidth / CANVAS_ASPECT_RATIO);

      // Only resize if dimensions actually changed to avoid unnecessary clears
      const newPhysicalWidth = cssWidth * dpr;
      const newPhysicalHeight = cssHeight * dpr;
      if (canvas.width === newPhysicalWidth && canvas.height === newPhysicalHeight) return;

      canvas.width = newPhysicalWidth;
      canvas.height = newPhysicalHeight;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      hasStrokes.current = false;
    }, []);

    const getPos = useCallback((e: PointerEvent): { x: number; y: number } => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      return {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
      };
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      const wrapper = wrapperRef.current;
      if (!canvas || !wrapper) return;

      resizeCanvas();

      const observer = new ResizeObserver(() => {
        resizeCanvas();
      });
      observer.observe(wrapper);

      const onPointerDown = (e: PointerEvent) => {
        if (disabled) return;
        e.preventDefault();
        canvas.setPointerCapture(e.pointerId);
        isDrawing.current = true;
        hasStrokes.current = true;
        const ctx = getCtx();
        if (!ctx) return;
        const { x, y } = getPos(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDrawing.current || disabled) return;
        e.preventDefault();
        const ctx = getCtx();
        if (!ctx) return;
        const { x, y } = getPos(e);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      };

      const onPointerUp = () => {
        isDrawing.current = false;
      };

      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerUp);

      return () => {
        observer.disconnect();
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('pointercancel', onPointerUp);
      };
    }, [disabled, getCtx, getPos, resizeCanvas]);

    const clearCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      hasStrokes.current = false;
    }, []);

    useImperativeHandle(ref, () => ({
      isEmpty: () => !hasStrokes.current,
      toDataURL: () => canvasRef.current?.toDataURL('image/png') ?? '',
      clear: clearCanvas,
    }));

    return (
      <div ref={wrapperRef} className="w-full flex flex-col gap-2">
        <canvas
          ref={canvasRef}
          className="touch-none rounded-md border border-border bg-white cursor-crosshair block w-full"
          style={{ opacity: disabled ? 0.5 : 1 }}
          aria-label={t('form.signatureLabel')}
        />
        <button
          type="button"
          onClick={clearCanvas}
          disabled={disabled}
          className="self-end text-sm text-muted-foreground hover:text-foreground underline disabled:opacity-50"
        >
          {t('form.clearSignature')}
        </button>
      </div>
    );
  }
);

SignaturePad.displayName = 'SignaturePad';
export default SignaturePad;
