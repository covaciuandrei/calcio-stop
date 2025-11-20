import React, { useCallback, useEffect, useRef, useState } from 'react';
import './SalesFilters.css';

interface SalesFiltersProps {
  startDate: string;
  endDate: string;
  saleType: 'OLX' | 'IN-PERSON' | '';
  onFiltersChange: (filters: { startDate: string; endDate: string; saleType: 'OLX' | 'IN-PERSON' | '' }) => void;
  onReset: () => void;
}

const SalesFilters: React.FC<SalesFiltersProps> = ({ startDate, endDate, saleType, onFiltersChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [localFilters, setLocalFilters] = useState({
    startDate,
    endDate,
    saleType,
  });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update local state when props change (only if different to prevent loops)
  useEffect(() => {
    if (
      localFilters.startDate !== startDate ||
      localFilters.endDate !== endDate ||
      localFilters.saleType !== saleType
    ) {
      setLocalFilters({ startDate, endDate, saleType });
    }
    // Intentional: localFilters is not included to prevent infinite loop - we only update when props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, saleType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Debounced filter change handler
  const debouncedFilterChange = useCallback(
    (newFilters: { startDate: string; endDate: string; saleType: 'OLX' | 'IN-PERSON' | '' }) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onFiltersChange(newFilters);
      }, 500); // 500ms debounce
    },
    [onFiltersChange]
  );

  const handleFilterChange = (key: keyof typeof localFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    // Debounce date changes, but immediately apply sale type changes
    if (key === 'saleType') {
      onFiltersChange({
        startDate: newFilters.startDate,
        endDate: newFilters.endDate,
        saleType: newFilters.saleType as 'OLX' | 'IN-PERSON' | '',
      });
    } else {
      debouncedFilterChange({
        startDate: newFilters.startDate,
        endDate: newFilters.endDate,
        saleType: newFilters.saleType as 'OLX' | 'IN-PERSON' | '',
      });
    }
  };

  // Handle blur events for date inputs (apply immediately when user leaves the field)
  const handleDateBlur = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onFiltersChange({
      startDate: localFilters.startDate,
      endDate: localFilters.endDate,
      saleType: localFilters.saleType as 'OLX' | 'IN-PERSON' | '',
    });
  };

  const handleReset = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const resetFilters = {
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0],
      saleType: '' as const,
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  const activeFiltersCount = (saleType ? 1 : 0) + (startDate || endDate ? 1 : 0);

  return (
    <div className="sales-filters-container" ref={containerRef}>
      <div className="filter-controls">
        <button
          className={`filter-toggle-btn ${isOpen ? 'active' : ''} ${activeFiltersCount > 0 ? 'has-filters' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          title="Filter sales"
        >
          Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>
        {activeFiltersCount > 0 && (
          <button className="reset-filters-btn" onClick={handleReset}>
            Reset
          </button>
        )}
      </div>

      {isOpen && (
        <div className="filters-inline">
          <div className="sales-filter-section">
            <label>Date Range</label>

            {/* Quick Month/Year Selectors */}
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 'var(--space-3)' }}
            >
              <div>
                <label style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Month</label>
                <select
                  value={new Date(localFilters.startDate || new Date()).getMonth()}
                  onChange={(e) => {
                    const month = parseInt(e.target.value);
                    const currentYear = new Date(localFilters.startDate || new Date()).getFullYear();
                    const startOfMonth = new Date(currentYear, month, 1);
                    const endOfMonth = new Date(currentYear, month + 1, 0);
                    const newFilters = {
                      startDate: startOfMonth.toISOString().split('T')[0],
                      endDate: endOfMonth.toISOString().split('T')[0],
                      saleType: localFilters.saleType as 'OLX' | 'IN-PERSON' | '',
                    };
                    setLocalFilters(newFilters);
                    // Clear debounce and apply immediately
                    if (debounceTimerRef.current) {
                      clearTimeout(debounceTimerRef.current);
                    }
                    onFiltersChange(newFilters);
                  }}
                  className="sales-filter-input"
                >
                  <option value="0">January</option>
                  <option value="1">February</option>
                  <option value="2">March</option>
                  <option value="3">April</option>
                  <option value="4">May</option>
                  <option value="5">June</option>
                  <option value="6">July</option>
                  <option value="7">August</option>
                  <option value="8">September</option>
                  <option value="9">October</option>
                  <option value="10">November</option>
                  <option value="11">December</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Year</label>
                <select
                  value={new Date(localFilters.startDate || new Date()).getFullYear()}
                  onChange={(e) => {
                    const year = parseInt(e.target.value);
                    const currentMonth = new Date(localFilters.startDate || new Date()).getMonth();
                    const startOfMonth = new Date(year, currentMonth, 1);
                    const endOfMonth = new Date(year, currentMonth + 1, 0);
                    const newFilters = {
                      startDate: startOfMonth.toISOString().split('T')[0],
                      endDate: endOfMonth.toISOString().split('T')[0],
                      saleType: localFilters.saleType as 'OLX' | 'IN-PERSON' | '',
                    };
                    setLocalFilters(newFilters);
                    // Clear debounce and apply immediately
                    if (debounceTimerRef.current) {
                      clearTimeout(debounceTimerRef.current);
                    }
                    onFiltersChange(newFilters);
                  }}
                  className="sales-filter-input"
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - 5 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Detailed Date Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Start Date</label>
                <input
                  type="date"
                  value={localFilters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  onBlur={handleDateBlur}
                  className="sales-filter-input"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>End Date</label>
                <input
                  type="date"
                  value={localFilters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  onBlur={handleDateBlur}
                  className="sales-filter-input"
                />
              </div>
            </div>
          </div>

          <div className="sales-filter-section">
            <label>Sale Type</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="saleType"
                  value=""
                  checked={localFilters.saleType === ''}
                  onChange={(e) => handleFilterChange('saleType', e.target.value)}
                  style={{ width: '14px', height: '14px', margin: 0, flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.875rem' }}>All</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="saleType"
                  value="IN-PERSON"
                  checked={localFilters.saleType === 'IN-PERSON'}
                  onChange={(e) => handleFilterChange('saleType', e.target.value)}
                  style={{ width: '14px', height: '14px', margin: 0, flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.875rem' }}>In-Person</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="saleType"
                  value="OLX"
                  checked={localFilters.saleType === 'OLX'}
                  onChange={(e) => handleFilterChange('saleType', e.target.value)}
                  style={{ width: '14px', height: '14px', margin: 0, flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.875rem' }}>OLX</span>
              </label>
            </div>
          </div>

          <div className="sales-filters-actions">
            <button onClick={handleReset} className="sales-filter-reset-btn">
              Reset to Current Month
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesFilters;
