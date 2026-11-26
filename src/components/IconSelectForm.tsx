'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { ICON_DICTIONARY } from './DynamicIconDisplay';

interface IconSelectProps {
  name: string;
  value?: string;
  onChange?: (iconName: string) => void;
  columns?: number;
  maxHeight?: string;
  maxWidth?: string;
}

export default function IconSelect({
  name,
  value = 'home',
  onChange,
  columns = 12,
  maxHeight = '220px',
  maxWidth = '100%',
}: IconSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate directly from the `value` prop during render (no duplicate state or useEffect)
  const iconKeys = Object.keys(ICON_DICTIONARY);
  const selectedOption =
    iconKeys.find((ico) => ico === value) || 'helpcircle';
  const SelectedIcon = ICON_DICTIONARY[selectedOption];

  // Close dropdown when clicking outside (valid use of Effect for external DOM events)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (iconName: string) => {
    setIsOpen(false);
    if (onChange) {
      onChange(iconName);
    }
  };

  // Chunk icons into rows for the <table> layout
  const rows: string[][] = [];
  for (let i = 0; i < iconKeys.length; i += columns) {
    rows.push(iconKeys.slice(i, i + columns));
  }

  return (
    <div className="dropdown" ref={dropdownRef}>
      {/* Hidden input bound directly to `value` */}
      <input type="hidden" name={name} value={value} />

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        className="btn btn-outline-secondary d-flex align-items-center justify-content-between gap-2 bg-dark text-light"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        style={{ minWidth: '140px' }}
      >
        <span className="d-flex align-items-center gap-2 bg-dark text-light">
          {SelectedIcon && <SelectedIcon size={18} />}
          <span className="text-capitalize">{selectedOption}</span>
        </span>
        <ChevronDown size={16} />
      </button>

      {/* Scrollable Dropdown Menu containing the Table */}
      {isOpen && (
        <div
          className="dropdown-menu show p-2 shadow-sm bg-dark text-light overflow-auto"
          style={{
            maxHeight,
            maxWidth,
            zIndex: 1050,
          }}
        >
          <table className="table table-borderless table-sm mb-0 bg-dark text-light">
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((item) => {
                    const IconComponent = ICON_DICTIONARY[item];
                    const isSelected = item === value;

                    return (
                      <td
                        key={item}
                        className="p-1 text-center"
                        style={{ background: '#000000' }}
                      >
                        <button
                          type="button"
                          title={item}
                          onClick={() => handleSelect(item)}
                          className={`btn btn-sm d-flex align-items-center justify-content-center p-2 ${
                            isSelected ? 'btn-primary' : 'btn-outline-dark text-light'
                          }`}
                        >
                          <IconComponent size={20} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
