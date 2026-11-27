'use client';

import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

export interface DropdownOption {
  id: number;
  label: string;
}

interface CheckboxDropdownProps {
  options: DropdownOption[];
  selectedIds: number[];
  onChange: (updatedIds: number[]) => void;
  placeholder?: string;
}

export default function CheckboxDropdown({
  options,
  selectedIds,
  onChange,
  placeholder = 'Select options',
}: CheckboxDropdownProps) {
  const handleToggle = (id: number) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];

    onChange(updated);
  };

  return (
    <Dropdown autoClose="outside">
      <Dropdown.Toggle variant="outline-secondary" id="dropdown-int-checkbox">
        {selectedIds.length > 0 ? `${selectedIds.length} selected` : placeholder}
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-2" style={{ minWidth: '220px' }}>
        {options.map((option) => (
          <div key={option.id} className="px-2 py-1">
            <Form.Check
              type="checkbox"
              id={`dropdown-option-${option.id}`}
              label={option.label}
              checked={selectedIds.includes(option.id)}
              onChange={() => handleToggle(option.id)}
            />
          </div>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
