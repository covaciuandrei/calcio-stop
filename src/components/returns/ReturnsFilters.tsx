import React from 'react';
import '../sales/SalesFilters.css';

interface Props {
  startDate: string;
  endDate: string;
  saleType: string;
  onFiltersChange: (filters: { startDate: string; endDate: string; saleType: 'OLX' | 'IN-PERSON' | '' }) => void;
  onReset: () => void;
}

const ReturnsFilters: React.FC<Props> = ({ startDate, endDate, saleType, onFiltersChange, onReset }) => {
  const handleSaleTypeChange = (value: string) => {
    const typedValue: 'OLX' | 'IN-PERSON' | '' = value === 'OLX' || value === 'IN-PERSON' ? value : '';
    onFiltersChange({ startDate, endDate, saleType: typedValue });
  };

  return (
    <div className="sales-filters">
      <div className="filter-group">
        <label htmlFor="start-date">Start Date:</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => {
            const typedSaleType: 'OLX' | 'IN-PERSON' | '' =
              saleType === 'OLX' || saleType === 'IN-PERSON' ? saleType : '';
            onFiltersChange({ startDate: e.target.value, endDate, saleType: typedSaleType });
          }}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="end-date">End Date:</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => {
            const typedSaleType: 'OLX' | 'IN-PERSON' | '' =
              saleType === 'OLX' || saleType === 'IN-PERSON' ? saleType : '';
            onFiltersChange({ startDate, endDate: e.target.value, saleType: typedSaleType });
          }}
        />
      </div>
      <div className="filter-group">
        <label htmlFor="sale-type">Sale Type:</label>
        <select id="sale-type" value={saleType} onChange={(e) => handleSaleTypeChange(e.target.value)}>
          <option value="">All</option>
          <option value="OLX">OLX</option>
          <option value="IN-PERSON">IN-PERSON</option>
        </select>
      </div>
      <button onClick={onReset} className="btn btn-secondary">
        Reset
      </button>
    </div>
  );
};

export default ReturnsFilters;
