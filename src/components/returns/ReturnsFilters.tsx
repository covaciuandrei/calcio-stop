import React from 'react';
import '../sales/SalesFilters.css';
import DateInput from '../shared/DateInput';

interface Props {
  startDate: string;
  endDate: string;
  saleType: string;
  onFiltersChange: (filters: {
    startDate: string;
    endDate: string;
    saleType: 'OLX' | 'IN-PERSON' | 'VINTED' | '';
  }) => void;
  onReset: () => void;
}

const ReturnsFilters: React.FC<Props> = ({ startDate, endDate, saleType, onFiltersChange, onReset }) => {
  const handleSaleTypeChange = (value: string) => {
    const typedValue: 'OLX' | 'IN-PERSON' | 'VINTED' | '' =
      value === 'OLX' || value === 'IN-PERSON' || value === 'VINTED' ? value : '';
    onFiltersChange({ startDate, endDate, saleType: typedValue });
  };

  return (
    <div className="sales-filters">
      <div className="filter-group">
        <label htmlFor="start-date">Start Date:</label>
        <DateInput
          id="start-date"
          value={startDate}
          onChange={(value) => {
            const typedSaleType: 'OLX' | 'IN-PERSON' | 'VINTED' | '' =
              saleType === 'OLX' || saleType === 'IN-PERSON' || saleType === 'VINTED' ? saleType : '';
            onFiltersChange({ startDate: value, endDate, saleType: typedSaleType });
          }}
          placeholder="dd/mm/yyyy"
        />
      </div>
      <div className="filter-group">
        <label htmlFor="end-date">End Date:</label>
        <DateInput
          id="end-date"
          value={endDate}
          onChange={(value) => {
            const typedSaleType: 'OLX' | 'IN-PERSON' | 'VINTED' | '' =
              saleType === 'OLX' || saleType === 'IN-PERSON' || saleType === 'VINTED' ? saleType : '';
            onFiltersChange({ startDate, endDate: value, saleType: typedSaleType });
          }}
          placeholder="dd/mm/yyyy"
        />
      </div>
      <div className="filter-group">
        <label htmlFor="sale-type">Sale Type:</label>
        <select id="sale-type" value={saleType} onChange={(e) => handleSaleTypeChange(e.target.value)}>
          <option value="">All</option>
          <option value="OLX">OLX</option>
          <option value="IN-PERSON">IN-PERSON</option>
          <option value="VINTED">Vinted</option>
        </select>
      </div>
      <button onClick={onReset} className="btn btn-secondary">
        Reset
      </button>
    </div>
  );
};

export default ReturnsFilters;
