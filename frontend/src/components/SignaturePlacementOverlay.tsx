'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SignaturePlacement } from '@/app/sign/logic';
import {
  calculateDragDelta,
  clamp,
  clampToBounds,
  createDefaultPlacement,
  createPlacementId,
  filterPlacementsByPage,
  normalizePlacement,
  relativeToScreen,
  screenToRelative,
} from '@/app/sign/placement-logic';

interface SignaturePlacementOverlayProps {
  signatureImage: string | null;
  currentPage: number;
  totalPages: number;
  placements: SignaturePlacement[];
  defaultWidth?: number;
  defaultHeight?: number;
  onChange: (placements: SignaturePlacement[]) => void;
}

type ResizeCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type InteractionState =
  | {
      type: 'drag';
      placementId: string;
      lastClientX: number;
      lastClientY: number;
    }
  | {
      type: 'resize';
      placementId: string;
      corner: ResizeCorner;
      lastClientX: number;
      lastClientY: number;
    }
  | null;

const HANDLE_CLASS = 'absolute h-4 w-4 rounded-full border-2 border-white bg-accent shadow-sm';

export default function SignaturePlacementOverlay({
  signatureImage,
  currentPage,
  totalPages,
  placements,
  defaultWidth = 0.25,
  defaultHeight = 0.1,
  onChange,
}: SignaturePlacementOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const interactionRef = useRef<InteractionState>(null);
  const [isPressed, setIsPressed] = useState(false);
  const pagePlacements = useMemo(
    () => filterPlacementsByPage(placements, currentPage),
    [placements, currentPage],
  );

  const updatePlacement = useCallback(
    (placementId: string, updater: (placement: SignaturePlacement) => SignaturePlacement) => {
      onChange(
        placements.map((placement) =>
          placement.id === placementId ? normalizePlacement(updater(placement)) : placement,
        ),
      );
    },
    [onChange, placements],
  );

  const createPlacementAtPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!signatureImage) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const point = screenToRelative(
        clientX - rect.left,
        clientY - rect.top,
        rect.width,
        rect.height,
      );
      const placement = normalizePlacement({
        ...createDefaultPlacement(currentPage, defaultWidth, defaultHeight),
        id: createPlacementId(),
        page: currentPage,
        x: clamp(point.x - defaultWidth / 2, 0, 1 - defaultWidth),
        y: clamp(point.y - defaultHeight / 2, 0, 1 - defaultHeight),
        width: defaultWidth,
        height: defaultHeight,
      });
      onChange([...placements, placement]);
    },
    [currentPage, defaultHeight, defaultWidth, onChange, placements, signatureImage],
  );

  const finishInteraction = useCallback(() => {
    interactionRef.current = null;
    setIsPressed(false);
  }, []);

  const handleGlobalMove = useCallback(
    (clientX: number, clientY: number) => {
      const interaction = interactionRef.current;
      const container = containerRef.current;
      if (!interaction || !container) return;

      const rect = container.getBoundingClientRect();
      const { dx, dy } = calculateDragDelta(
        interaction.lastClientX,
        interaction.lastClientY,
        clientX,
        clientY,
        rect.width,
        rect.height,
      );

      if (interaction.type === 'drag') {
        updatePlacement(interaction.placementId, (placement) => {
          const next = clampToBounds(
            placement.x + dx,
            placement.y + dy,
            placement.width,
            placement.height,
          );
          return { ...placement, ...next };
        });
      }

      if (interaction.type === 'resize') {
        updatePlacement(interaction.placementId, (placement) => {
          let nextX = placement.x;
          let nextY = placement.y;
          let nextWidth = placement.width;
          let nextHeight = placement.height;

          if (interaction.corner === 'top-left') {
            nextX += dx;
            nextY += dy;
            nextWidth -= dx;
            nextHeight -= dy;
          }

          if (interaction.corner === 'top-right') {
            nextY += dy;
            nextWidth += dx;
            nextHeight -= dy;
          }

          if (interaction.corner === 'bottom-left') {
            nextX += dx;
            nextWidth -= dx;
            nextHeight += dy;
          }

          if (interaction.corner === 'bottom-right') {
            nextWidth += dx;
            nextHeight += dy;
          }

          const bounded = clampToBounds(nextX, nextY, nextWidth, nextHeight);
          return { ...placement, ...bounded };
        });
      }

      interactionRef.current = { ...interaction, lastClientX: clientX, lastClientY: clientY };
    },
    [updatePlacement],
  );

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (!interactionRef.current) return;
      event.preventDefault();
      handleGlobalMove(event.clientX, event.clientY);
    }

    function handleMouseUp() {
      if (!interactionRef.current) return;
      finishInteraction();
    }

    function handleTouchMove(event: TouchEvent) {
      if (!interactionRef.current || event.touches.length === 0) return;
      event.preventDefault();
      const touch = event.touches[0];
      handleGlobalMove(touch.clientX, touch.clientY);
    }

    function handleTouchEnd() {
      if (!interactionRef.current) return;
      finishInteraction();
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [finishInteraction, handleGlobalMove]);

  const startDrag = useCallback((placementId: string, clientX: number, clientY: number) => {
    interactionRef.current = {
      type: 'drag',
      placementId,
      lastClientX: clientX,
      lastClientY: clientY,
    };
    setIsPressed(true);
  }, []);

  const startResize = useCallback(
    (placementId: string, corner: ResizeCorner, clientX: number, clientY: number) => {
      interactionRef.current = {
        type: 'resize',
        placementId,
        corner,
        lastClientX: clientX,
        lastClientY: clientY,
      };
      setIsPressed(true);
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10"
      style={{ touchAction: 'none' }}
      onMouseDown={(event) => {
        if (event.target !== event.currentTarget || !signatureImage) return;
        event.preventDefault();
        createPlacementAtPoint(event.clientX, event.clientY);
      }}
      onTouchStart={(event) => {
        if (event.target !== event.currentTarget || !signatureImage || event.touches.length === 0)
          return;
        event.preventDefault();
        const touch = event.touches[0];
        createPlacementAtPoint(touch.clientX, touch.clientY);
      }}
      aria-label={`Overlay penempatan tanda tangan halaman ${currentPage}`}
    >
      {!signatureImage && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl bg-white/95 px-3 py-2 text-center text-xs text-slate-500 shadow-sm ring-1 ring-slate-200">
          Buat atau upload tanda tangan dulu, lalu tap halaman untuk menempatkannya.
        </div>
      )}

      {signatureImage && pagePlacements.length === 0 && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl bg-white/95 px-3 py-2 text-center text-xs text-slate-500 shadow-sm ring-1 ring-slate-200">
          Tap atau klik halaman untuk menambahkan signature. Geser dan ubah ukuran lewat sudut.
        </div>
      )}

      {pagePlacements.map((placement, index) => {
        const box = {
          left: `${placement.x * 100}%`,
          top: `${placement.y * 100}%`,
          width: `${placement.width * 100}%`,
          height: `${placement.height * 100}%`,
        };
        const badgePosition = relativeToScreen(placement.x, placement.y, 100, 100);

        return (
          <div
            key={placement.id}
            className={`absolute ${isPressed ? 'select-none' : ''}`}
            style={box}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={`Signature ${index + 1} di halaman ${currentPage}`}
              className="group relative h-full w-full cursor-move overflow-visible rounded-xl border-2 border-accent/70 bg-accent/10 shadow-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-accent/40"
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                startDrag(placement.id, event.clientX, event.clientY);
              }}
              onTouchStart={(event) => {
                if (event.touches.length === 0) return;
                event.preventDefault();
                event.stopPropagation();
                const touch = event.touches[0];
                startDrag(placement.id, touch.clientX, touch.clientY);
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') {
                  event.preventDefault();
                  updatePlacement(placement.id, (current) => ({
                    ...current,
                    ...clampToBounds(current.x - 0.01, current.y, current.width, current.height),
                  }));
                }
                if (event.key === 'ArrowRight') {
                  event.preventDefault();
                  updatePlacement(placement.id, (current) => ({
                    ...current,
                    ...clampToBounds(current.x + 0.01, current.y, current.width, current.height),
                  }));
                }
                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  updatePlacement(placement.id, (current) => ({
                    ...current,
                    ...clampToBounds(current.x, current.y - 0.01, current.width, current.height),
                  }));
                }
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  updatePlacement(placement.id, (current) => ({
                    ...current,
                    ...clampToBounds(current.x, current.y + 0.01, current.width, current.height),
                  }));
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={signatureImage ?? undefined}
                alt="Preview tanda tangan"
                className="pointer-events-none h-full w-full object-contain"
                draggable={false}
              />
              <div
                className="pointer-events-none absolute -top-7 left-0 rounded-full bg-navy px-2 py-1 text-[10px] font-semibold text-white shadow-sm"
                style={{ left: `${badgePosition.left}%`, top: `${badgePosition.top}%` }}
              >
                Hlm {placement.page}
              </div>

              {(
                [
                  ['top-left', '-left-2 -top-2 cursor-nwse-resize'],
                  ['top-right', '-right-2 -top-2 cursor-nesw-resize'],
                  ['bottom-left', '-bottom-2 -left-2 cursor-nesw-resize'],
                  ['bottom-right', '-bottom-2 -right-2 cursor-nwse-resize'],
                ] as [ResizeCorner, string][]
              ).map(([corner, positionClass]) => (
                <button
                  key={corner}
                  type="button"
                  aria-label={`Ubah ukuran dari sudut ${corner}`}
                  className={`${HANDLE_CLASS} ${positionClass}`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    startResize(placement.id, corner, event.clientX, event.clientY);
                  }}
                  onTouchStart={(event) => {
                    if (event.touches.length === 0) return;
                    event.preventDefault();
                    event.stopPropagation();
                    const touch = event.touches[0];
                    startResize(placement.id, corner, touch.clientX, touch.clientY);
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      {signatureImage && totalPages > 1 && (
        <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
          Halaman {currentPage}/{totalPages}
        </div>
      )}
    </div>
  );
}
