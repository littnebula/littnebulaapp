'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { ICON_DICTIONARY } from './DynamicIconDisplay';

interface IconSelectProps {
  name: string;
  value?: string;
  onChange?: (iconName: string) => void;
  columns?: number;
}

export default function IconSelect({
  name,
  value = 'home',
  onChange,
  columns = 12,
}: IconSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<string>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the currently selected icon component
  const selectedOption =
    Object.keys(ICON_DICTIONARY).find((ico) => ico === selectedName) || 'helpcircle';
    // ICON_OPTIONS.find((item) => item.name === selectedName) || ICON_OPTIONS[0];
  const SelectedIcon = ICON_DICTIONARY[selectedOption];

  // Close dropdown when clicking outside
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
    setSelectedName(iconName);
    setIsOpen(false);
    if (onChange) {
      onChange(iconName);
    }
  };

  // Chunk icons into rows for the <table> layout
  const rows: string[][] = [];
  for (let i = 0; i < Object.keys(ICON_DICTIONARY).length; i += columns) {
    rows.push(Object.keys(ICON_DICTIONARY).slice(i, i + columns));
  }

  return (
    <div className="dropdown" ref={dropdownRef}>
      {/* Hidden input so it works seamlessly with native HTML forms */}
      <input type="hidden" name={name} value={selectedName} />

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        className="btn btn-outline-secondary d-flex align-items-center justify-content-between gap-2 bg-dark text-light"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        style={{ minWidth: '140px' }}
      >
        <span className="d-flex align-items-center gap-2 bg-dark text-light">
          <SelectedIcon size={18} />
          <span className="text-capitalize">{selectedOption}</span>
        </span>
        <ChevronDown size={16} />
      </button>

      {/* Dropdown Menu containing the Table */}
      {isOpen && (
        <div
          className="dropdown-menu show p-2 shadow-sm bg-dark text-light"
          style={{ minWidth: 'max-content' }}
        >
          <table className="table table-borderless table-sm mb-0 bg-dark text-light">
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((item) => {
                    const IconComponent = ICON_DICTIONARY[item];
                    const isSelected = item === selectedName;

                    return (
                      <td key={item} className="p-1 text-center"
                      style={{background: "#000000"}}>
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
