'use client';

import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  const presetColors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#ef4444', // red
    '#f59e0b', // orange
    '#10b981', // green
    '#06b6d4', // cyan
    '#6366f1', // indigo
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Palette className="w-4 h-4 mr-2" />
          <div
            className="w-4 h-4 rounded border border-gray-300 mr-2"
            style={{ backgroundColor: color }}
          />
          Theme Color
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <HexColorPicker color={color} onChange={onChange} />
          <div className="grid grid-cols-4 gap-2">
            {presetColors.map((preset) => (
              <button
                key={preset}
                className="w-full h-8 rounded border-2 hover:scale-110 transition-transform"
                style={{
                  backgroundColor: preset,
                  borderColor: color === preset ? '#000' : 'transparent',
                }}
                onClick={() => {
                  onChange(preset);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
