import { type ChangeEvent, type ReactNode, useEffect, useState } from "react";

import { cn } from "../utils/cn";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Slider } from "./slider";

export interface OKLCHColor {
  l: number; // Lightness: 0-1
  c: number; // Chroma: 0-0.4 (typical range)
  h: number; // Hue: 0-360
}

interface ColorInputProps {
  label?: ReactNode;
  value: string; // OKLCH string like "oklch(0.5 0.2 180)"
  onChange: (value: string) => void;
  className?: string;
  compact?: boolean;
}

const OKLCH_REGEX = /oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)/;

// Parse OKLCH string to components
function parseOKLCH(oklchString: string): OKLCHColor {
  const match = oklchString.match(OKLCH_REGEX);
  if (!match) {
    return { l: 0.5, c: 0.1, h: 0 };
  }

  const l = Math.max(0, Math.min(1, Number.parseFloat(match[1])));
  const c = Math.max(0, Math.min(0.4, Number.parseFloat(match[2])));
  const h = Number.parseFloat(match[3]) % 360;

  return { l, c, h: h < 0 ? h + 360 : h };
}

// Validate OKLCH string
function isValidOKLCH(oklchString: string): boolean {
  const match = oklchString.match(OKLCH_REGEX);
  if (!match) {
    return false;
  }

  const l = Number.parseFloat(match[1]);
  const c = Number.parseFloat(match[2]);
  const h = Number.parseFloat(match[3]);

  return l >= 0 && l <= 1 && c >= 0 && c <= 0.4 && h >= 0 && h <= 360;
}

// Convert OKLCH components to string
function formatOKLCH({ l, c, h }: OKLCHColor): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
}

// Convert OKLCH to RGB for preview (simplified approximation)
function oklchToRgb({ l, c, h }: OKLCHColor): string {
  // This is a simplified conversion for preview purposes
  // In a real implementation, you'd use a proper color space conversion library
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // Convert to RGB (very simplified approximation for preview)
  const r = Math.max(0, Math.min(1, l + a * 0.4));
  const g = Math.max(0, Math.min(1, l - a * 0.2 - b * 0.2));
  const blue = Math.max(0, Math.min(1, l - b * 0.4));

  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(blue * 255)})`;
}

const RGB_REGEX = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;

// Convert RGB to hex for native color input
function rgbToHex(rgb: string): string {
  const match = rgb.match(RGB_REGEX);
  if (!match) {
    return "#000000";
  }

  const r = Number.parseInt(match[1], 10);
  const g = Number.parseInt(match[2], 10);
  const b = Number.parseInt(match[3], 10);

  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      })
      .join("")
  );
}

// Convert hex to approximate OKLCH (very simplified)
function hexToOklch(hex: string): OKLCHColor {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;

  // Very simplified conversion - just for basic color picking
  const l = (r + g + b) / 3;
  const c = Math.sqrt((r - l) ** 2 + (g - l) ** 2 + (b - l) ** 2) * 0.5;
  const h = (Math.atan2(g - l, r - l) * 180) / Math.PI;

  return {
    l: Math.max(0, Math.min(1, l)),
    c: Math.max(0, Math.min(0.4, c)),
    h: h < 0 ? h + 360 : h,
  };
}

export function ColorInput({
  label,
  value,
  onChange,
  className,
  compact = false,
}: ColorInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const color = parseOKLCH(value);
  const previewColor = oklchToRgb(color);

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleLightnessChange = (lightness: number | readonly number[]) => {
    const values = Array.isArray(lightness) ? lightness : [lightness];
    const newColor = { ...color, l: values[0] / 100 };
    onChange(formatOKLCH(newColor));
  };

  const handleChromaChange = (chromaValue: number | readonly number[]) => {
    const values = Array.isArray(chromaValue) ? chromaValue : [chromaValue];
    const newColor = { ...color, c: values[0] / 100 };
    onChange(formatOKLCH(newColor));
  };

  const handleHueChange = (hueValue: number | readonly number[]) => {
    const values = Array.isArray(hueValue) ? hueValue : [hueValue];
    const newColor = { ...color, h: values[0] };
    onChange(formatOKLCH(newColor));
  };

  const handleDirectInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Only call onChange if the value is valid
    if (!newValue || isValidOKLCH(newValue)) {
      onChange(newValue);
    }
  };

  const handleInputBlur = () => {
    // Reset to last valid value on blur if current input is invalid
    if (inputValue && !isValidOKLCH(inputValue)) {
      setInputValue(value);
    }
  };

  const handleColorPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const oklchColor = hexToOklch(hex);
    onChange(formatOKLCH(oklchColor));
  };

  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        <Button
          className="h-7 w-full min-w-0 justify-between gap-2 px-2"
          onClick={() => setIsExpanded(!isExpanded)}
          size="sm"
          variant="outline"
        >
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="size-3 flex-shrink-0 rounded border border-border/50"
              style={{ backgroundColor: previewColor }}
            />
            <span className="truncate text-xs">{label}</span>
          </div>
          <span className="w-24 flex-shrink-0 text-right font-mono text-muted-foreground text-xs">
            {value.replace("oklch(", "").replace(")", "")}
          </span>
        </Button>

        {isExpanded && (
          <div className="space-y-2 rounded-md bg-muted/30 p-2">
            <div className="flex items-center gap-2">
              <div
                className="size-4 flex-shrink-0 rounded border border-border"
                style={{ backgroundColor: previewColor }}
              />
              <Input
                className={cn(
                  "h-7 flex-1 font-mono text-xs",
                  inputValue && !isValidOKLCH(inputValue)
                    ? "border-red-500 focus:border-red-500"
                    : ""
                )}
                onBlur={handleInputBlur}
                onChange={handleDirectInput}
                placeholder="oklch(0.5 0.2 180)"
                value={inputValue}
              />
              <input
                className="size-7 cursor-pointer rounded border border-border bg-transparent"
                onChange={handleColorPickerChange}
                title="Color picker"
                type="color"
                value={rgbToHex(previewColor)}
              />
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Lightness</span>
                  <span className="font-mono text-xs">
                    {(color.l * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  max={100}
                  min={0}
                  onValueChange={handleLightnessChange}
                  step={1}
                  value={[color.l * 100]}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Chroma</span>
                  <span className="font-mono text-xs">
                    {(color.c * 100).toFixed(0)}%
                  </span>
                </div>
                <Slider
                  max={40}
                  min={0}
                  onValueChange={handleChromaChange}
                  step={1}
                  value={[color.c * 100]}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Hue</span>
                  <span className="font-mono text-xs">
                    {color.h.toFixed(0)}°
                  </span>
                </div>
                <Slider
                  max={360}
                  min={0}
                  onValueChange={handleHueChange}
                  step={1}
                  value={[color.h]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && <Label className="font-medium text-sm">{label}</Label>}

      <div className="flex items-center gap-3">
        <button
          aria-label="Expand color input"
          className="size-8 cursor-pointer rounded-md border border-border shadow-sm transition-transform hover:scale-105"
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsExpanded(!isExpanded);
            }
          }}
          style={{ backgroundColor: previewColor }}
          type="button"
        />
        <Input
          className={cn(
            "flex-1 font-mono text-xs",
            inputValue && !isValidOKLCH(inputValue)
              ? "border-red-500 focus:border-red-500"
              : ""
          )}
          onBlur={handleInputBlur}
          onChange={handleDirectInput}
          placeholder="oklch(0.5 0.2 180)"
          value={inputValue}
        />
        <input
          className="size-8 cursor-pointer rounded-md border border-border bg-transparent"
          onChange={handleColorPickerChange}
          title="Color picker"
          type="color"
          value={rgbToHex(previewColor)}
        />
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Lightness</span>
            <span className="font-mono text-xs">
              {(color.l * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            max={100}
            min={0}
            onValueChange={handleLightnessChange}
            step={1}
            value={[color.l * 100]}
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Chroma</span>
            <span className="font-mono text-xs">
              {(color.c * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            max={40}
            min={0}
            onValueChange={handleChromaChange}
            step={1}
            value={[color.c * 100]}
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Hue</span>
            <span className="font-mono text-xs">{color.h.toFixed(0)}°</span>
          </div>
          <Slider
            max={360}
            min={0}
            onValueChange={handleHueChange}
            step={1}
            value={[color.h]}
          />
        </div>
      </div>
    </div>
  );
}
