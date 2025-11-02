import React, { useState, useRef, useEffect } from 'react';
import './ProductFilters.css';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | '';

interface ProductSortProps {
  onSortChange: (sortOption: SortOption) => void;
}

const ProductSort: React.FC<ProductSortProps> = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('');
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSortSelect = (sortOption: SortOption) => {
    setSelectedSort(sortOption);
    onSortChange(sortOption);
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedSort('');
    onSortChange('');
  };

  const getSortLabel = () => {
    switch (selectedSort) {
      case 'name-asc':
        return 'Name (A-Z)';
      case 'name-desc':
        return 'Name (Z-A)';
      case 'price-asc':
        return 'Price (Low-High)';
      case 'price-desc':
        return 'Price (High-Low)';
      default:
        return 'Sort';
    }
  };

  return (
    <div className="product-filters" ref={sortRef}>
      <div className="filter-controls">
        <button
          className={`filter-toggle-btn ${selectedSort ? 'has-filters' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {getSortLabel()}
        </button>
        {selectedSort && (
          <button className="reset-filters-btn" onClick={handleReset}>
            Reset
          </button>
        )}
      </div>

      {isOpen && (
        <div className="filters-inline" style={{ minWidth: '220px', maxWidth: '280px' }}>
          <div className="filter-group">
            <label>Sort by Name</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                className={`sort-option-btn ${selectedSort === 'name-asc' ? 'active' : ''}`}
                onClick={() => handleSortSelect('name-asc')}
                style={{ flex: 1 }}
              >
                A-Z
              </button>
              <button
                className={`sort-option-btn ${selectedSort === 'name-desc' ? 'active' : ''}`}
                onClick={() => handleSortSelect('name-desc')}
                style={{ flex: 1 }}
              >
                Z-A
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label>Sort by Price</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                className={`sort-option-btn ${selectedSort === 'price-asc' ? 'active' : ''}`}
                onClick={() => handleSortSelect('price-asc')}
                style={{ flex: 1 }}
              >
                Low-High
              </button>
              <button
                className={`sort-option-btn ${selectedSort === 'price-desc' ? 'active' : ''}`}
                onClick={() => handleSortSelect('price-desc')}
                style={{ flex: 1 }}
              >
                High-Low
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSort;

