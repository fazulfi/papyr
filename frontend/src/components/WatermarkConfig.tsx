"use client";

import {
  applyTextPositionPreset,
  type WatermarkImageConfig,
  type WatermarkTextConfig,
} from "@/app/watermark/logic";

interface WatermarkConfigProps {
  tab: "text" | "image";
  textConfig: WatermarkTextConfig;
  imageConfig: WatermarkImageConfig;
  onTextConfigChange: (next: WatermarkTextConfig) => void;
  onImageConfigChange: (next: WatermarkImageConfig) => void;
}

const POSITION_OPTIONS = ["center", "diagonal", "top", "bottom"] as const;
const IMAGE_POSITION_OPTIONS = [
  "center",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  suffix: string;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-navy">
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span className="text-slate-500">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-accent"
      />
    </label>
  );
}

export default function WatermarkConfig({
  tab,
  textConfig,
  imageConfig,
  onTextConfigChange,
  onImageConfigChange,
}: WatermarkConfigProps) {
  if (tab === "text") {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="space-y-2 text-sm font-medium text-navy">
          <span>Teks watermark</span>
          <input
            type="text"
            maxLength={50}
            value={textConfig.text}
            onChange={(event) =>
              onTextConfigChange({ ...textConfig, text: event.target.value })
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Contoh: DOKUMEN RAHASIA"
          />
        </label>

        <SliderRow
          label="Font size"
          value={textConfig.fontSize}
          min={12}
          max={72}
          step={1}
          suffix="pt"
          onChange={(fontSize) => onTextConfigChange({ ...textConfig, fontSize })}
        />

        <SliderRow
          label="Opacity"
          value={Math.round(textConfig.opacity * 100)}
          min={10}
          max={100}
          step={1}
          suffix="%"
          onChange={(opacity) => onTextConfigChange({ ...textConfig, opacity: opacity / 100 })}
        />

        <SliderRow
          label="Rotation"
          value={textConfig.rotation}
          min={-45}
          max={45}
          step={1}
          suffix="°"
          onChange={(rotation) => onTextConfigChange({ ...textConfig, rotation })}
        />

        <label className="space-y-2 text-sm font-medium text-navy">
          <span>Warna</span>
          <input
            type="color"
            value={textConfig.color}
            onChange={(event) =>
              onTextConfigChange({ ...textConfig, color: event.target.value })
            }
            className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 p-1"
            aria-label="Warna watermark"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-navy">
          <span>Posisi</span>
          <select
            value={textConfig.position}
            onChange={(event) =>
              onTextConfigChange(
                applyTextPositionPreset(
                  textConfig,
                  event.target.value as WatermarkTextConfig["position"],
                ),
              )
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            {POSITION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="space-y-2 text-sm font-medium text-navy">
        <span>Opacity</span>
        <input
          type="range"
          min={10}
          max={100}
          value={Math.round(imageConfig.opacity * 100)}
          onChange={(event) =>
            onImageConfigChange({ ...imageConfig, opacity: Number(event.target.value) / 100 })
          }
          className="w-full accent-accent"
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-navy">
        <span>Posisi</span>
        <select
          value={imageConfig.position}
          onChange={(event) =>
            onImageConfigChange({
              ...imageConfig,
              position: event.target.value as WatermarkImageConfig["position"],
            })
          }
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          {IMAGE_POSITION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm font-medium text-navy">
        <span>Scale</span>
        <input
          type="range"
          min={10}
          max={100}
          value={Math.round(imageConfig.scale * 100)}
          onChange={(event) =>
            onImageConfigChange({ ...imageConfig, scale: Number(event.target.value) / 100 })
          }
          className="w-full accent-accent"
        />
      </label>

      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        Upload gambar watermark (PNG/JPG, maks 2MB) akan ditambahkan pada langkah berikutnya.
      </div>
    </div>
  );
}
