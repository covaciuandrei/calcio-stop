import React, { useState } from 'react';
import {
  useArchivedBadges,
  useArchivedKitTypes,
  useArchivedNamesets,
  useBadgesList,
  useKitTypesList,
  useNamesetsList,
  useTeamsList,
} from '../../stores';
import { Product } from '../../types';
import { getNamesetInfo } from '../../utils/utils';
import './ProductFilters.css';

export interface ProductFiltersState {
  team: string;
  type: string;
  kitType: string;
  sizes: string[];
  season: string;
  player: string;
  number: string;
  badge: string;
  priceMin: string;
  priceMax: string;
}

interface ProductFiltersProps {
  products: Product[];
  onFiltersChange: (filters: ProductFiltersState) => void;
  onReset: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ products, onFiltersChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFiltersState>({
    team: '',
    type: '',
    kitType: '',
    sizes: [],
    season: '',
    player: '',
    number: '',
    badge: '',
    priceMin: '',
    priceMax: '',
  });

  // Get data from stores
  const teams = useTeamsList();
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();

  // Get unique values for filter options
  const uniqueTypes = Array.from(new Set(products.map((p) => p.type)));
  const uniqueSizes = Array.from(new Set(products.flatMap((p) => p.sizes.map((s) => s.size))));
  const uniqueSeasons = Array.from(
    new Set(
      products
        .map((p) => {
          const namesetInfo = getNamesetInfo(p.namesetId, namesets, archivedNamesets);
          return namesetInfo.season;
        })
        .filter(Boolean)
    )
  );

  const handleFilterChange = (key: keyof ProductFiltersState, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size) ? filters.sizes.filter((s) => s !== size) : [...filters.sizes, size];
    handleFilterChange('sizes', newSizes);
  };

  const handleReset = () => {
    const resetFilters: ProductFiltersState = {
      team: '',
      type: '',
      kitType: '',
      sizes: [],
      season: '',
      player: '',
      number: '',
      badge: '',
      priceMin: '',
      priceMax: '',
    };
    setFilters(resetFilters);
    onReset();
  };

  const hasActiveFilters = Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <div className="product-filters">
      <div className="filter-controls">
        <button
          className={`filter-toggle-btn ${hasActiveFilters ? 'has-filters' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          Filter{' '}
          {hasActiveFilters &&
            `(${Object.values(filters).filter((v) => (Array.isArray(v) ? v.length > 0 : v !== '')).length})`}
        </button>
        {hasActiveFilters && (
          <button className="reset-filters-btn" onClick={handleReset}>
            Reset
          </button>
        )}
      </div>

      {isOpen && (
        <div className="filters-inline">
          <div className="filters-grid">
            {/* Basic Product Info - Most Important */}
            <div className="filter-group">
              <label>Team</label>
              <select value={filters.team} onChange={(e) => handleFilterChange('team', e.target.value)}>
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Type</label>
              <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                <option value="">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Kit Type</label>
              <select value={filters.kitType} onChange={(e) => handleFilterChange('kitType', e.target.value)}>
                <option value="">All Kit Types</option>
                {kitTypes.map((kitType) => (
                  <option key={kitType.id} value={kitType.name}>
                    {kitType.name}
                  </option>
                ))}
                {archivedKitTypes.map((kitType) => (
                  <option key={kitType.id} value={kitType.name}>
                    {kitType.name} (Archived)
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range - Important for shopping */}
            <div className="filter-group price-range">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                />
              </div>
            </div>

            {/* Sizes - Important for shopping */}
            <div className="filter-group">
              <label>Sizes</label>
              <div className="sizes-checkboxes">
                {uniqueSizes.sort().map((size) => (
                  <label key={size} className="size-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nameset Details */}
            <div className="filter-group">
              <label>Season</label>
              <select value={filters.season} onChange={(e) => handleFilterChange('season', e.target.value)}>
                <option value="">All Seasons</option>
                {uniqueSeasons.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Player</label>
              <input
                type="text"
                placeholder="Search player..."
                value={filters.player}
                onChange={(e) => handleFilterChange('player', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Number</label>
              <input
                type="number"
                placeholder="Number"
                value={filters.number}
                onChange={(e) => handleFilterChange('number', e.target.value)}
              />
            </div>

            {/* Badge - Less commonly used */}
            <div className="filter-group">
              <label>Badge</label>
              <select value={filters.badge} onChange={(e) => handleFilterChange('badge', e.target.value)}>
                <option value="">All Badges</option>
                {badges.map((badge) => (
                  <option key={badge.id} value={badge.name}>
                    {badge.name}
                  </option>
                ))}
                {archivedBadges.map((badge) => (
                  <option key={badge.id} value={badge.name}>
                    {badge.name} (Archived)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
