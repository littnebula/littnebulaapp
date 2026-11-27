'use client';

import React, { useEffect, useState } from 'react';

export type Item = {
  id: string;
  label: string;
  location: 'pool' | 'box1' | 'box2';
};
type DragDropBoxesProps = {
  initialItems: Item[];
  onItemsChange?: (updatedItems: Item[]) => void;
};

export default function DragDropBoxes({
  initialItems,
  onItemsChange,
}: DragDropBoxesProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);

  // Sync internal state if the parent passes a new list of items
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(initialItems);
  }, [initialItems]);


  // 1. Store the ID of the dragged item
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  // 2. Allow dropping by preventing the browser's default behavior
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, boxId: string) => {
    e.preventDefault();
    if (hoveredBox !== boxId) {
      setHoveredBox(boxId);
    }
  };

  const handleDragLeave = () => {
    setHoveredBox(null);
  };

  // 3. Update the item's location when dropped
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetLocation: 'pool' | 'box1' | 'box2'
  ) => {
    e.preventDefault();
    setHoveredBox(null);

    const draggedItemId = e.dataTransfer.getData('text/plain');

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === draggedItemId ? { ...item, location: targetLocation } : item
      )
    );
  };

  // Helper to render draggable items inside a specific container
  const renderItems = (location: 'pool' | 'box1' | 'box2') => {
    return items
      .filter((item) => item.location === location)
      .map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          className="card mb-2 shadow-sm"
          style={{ cursor: 'grab' }}
        >
          <div className="card-body py-2 px-3 d-flex justify-content-between align-items-center">
            <span>{item.label}</span>
            <span className="badge bg-secondary">Drag</span>
          </div>
        </div>
      ));
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4">Sort Items Into Boxes</h3>

      {/* Unassigned Items Pool */}
      <div
        onDragOver={(e) => handleDragOver(e, 'pool')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 'pool')}
        className={`p-3 mb-4 border rounded ${
          hoveredBox === 'pool' ? 'bg-light border-primary' : 'bg-white'
        }`}
        style={{ minHeight: '100px' }}
      >
        <h6 className="text-muted mb-3">Available Items (Drag from here)</h6>
        <div className="d-flex flex-wrap gap-2">
          {items
            .filter((item) => item.location === 'pool')
            .map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                className="btn btn-outline-dark"
                style={{ cursor: 'grab' }}
              >
                {item.label}
              </div>
            ))}
        </div>
      </div>

      {/* Two Target Drop Boxes */}
      <div className="row g-4">
        {/* Box 1 */}
        <div className="col-md-6">
          <div
            onDragOver={(e) => handleDragOver(e, 'box1')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'box1')}
            className={`p-4 border border-2 rounded h-100 ${
              hoveredBox === 'box1'
              ? 'border-primary bg-dark bg-opacity-25' // Hover background
              : 'border-white bg-dark-subtle'       // Default background
            }`}
            style={{ minHeight: '150px', transition: 'all 0.2s ease' }}
          >
            {/* <h5 className="mb-3"  style={{ color: '#262626' }}>Left Partition</h5> */}
            {renderItems('box1')}
          </div>
        </div>

        {/* Box 2 */}
        <div className="col-md-6">
          <div
            onDragOver={(e) => handleDragOver(e, 'box2')}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'box2')}
            className={`p-4 border border-2 rounded h-100 ${
              hoveredBox === 'box2'
              ? 'border-primary bg-dark bg-opacity-25' // Hover background
              : 'border-white bg-dark-subtle'       // Default background
            }`}
            style={{ minHeight: '150px', transition: 'all 0.2s ease' }}
          >
            {/* <h5 className="mb-3" style={{ color: '#262626' }}>Right Partition</h5> */}
            {renderItems('box2')}
          </div>
        </div>
      </div>
    </div>
  );
}
