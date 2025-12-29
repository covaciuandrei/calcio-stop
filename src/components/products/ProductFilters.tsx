import React, { useState } from 'react';
import {
  useArchivedNamesets,
  useBadgesList,
  useKitTypesList,
  useLeaguesList,
  useNamesetsList,
  useTeamsList,
} from '../../stores';
import { useAuth } from '../../stores/authStore';
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
  leagues: string[];
  priceMin: string;
  priceMax: string;
  totalMin: string;
  totalMax: string;
  onSale: string; // 'all', 'on-sale', 'not-on-sale'
}

interface ProductFiltersProps {
  products: Product[];
  onFiltersChange: (filters: ProductFiltersState) => void;
  onReset: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ products, onFiltersChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin' && isAuthenticated;

  const [filters, setFilters] = useState<ProductFiltersState>({
    team: '',
    type: '',
    kitType: '',
    sizes: [],
    season: '',
    player: '',
    number: '',
    badge: '',
    leagues: [],
    priceMin: '',
    priceMax: '',
    totalMin: '',
    totalMax: '',
    onSale: 'all',
  });

  // Get data from stores
  const teams = useTeamsList();
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const kitTypes = useKitTypesList();
  const badges = useBadgesList();
  const leagues = useLeaguesList();

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

  const handleLeagueToggle = (leagueId: string) => {
    const newLeagues = filters.leagues.includes(leagueId)
      ? filters.leagues.filter((id) => id !== leagueId)
      : [...filters.leagues, leagueId];
    handleFilterChange('leagues', newLeagues);
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
      leagues: [],
      priceMin: '',
      priceMax: '',
      totalMin: '',
      totalMax: '',
      onSale: 'all',
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
            {/* Row 1: Team & Type */}
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

            {/* Row 2: Kit Type - Full width */}
            <div className="filter-group">
              <label>Kit Type</label>
              <select value={filters.kitType} onChange={(e) => handleFilterChange('kitType', e.target.value)}>
                <option value="">All Kit Types</option>
                {kitTypes.map((kitType) => (
                  <option key={kitType.id} value={kitType.name}>
                    {kitType.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 3: Price Range - Full width */}
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

            {/* Row 3.5: Total Quantity Range - Full width (Admin only) */}
            {isAdmin && (
              <div className="filter-group price-range">
                <label>Total Quantity Range</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.totalMin}
                    onChange={(e) => handleFilterChange('totalMin', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.totalMax}
                    onChange={(e) => handleFilterChange('totalMax', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Row 4: Sizes - Full width */}
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

            {/* Row 5: Season & Badge */}
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
              <label>Badge</label>
              <select value={filters.badge} onChange={(e) => handleFilterChange('badge', e.target.value)}>
                <option value="">All Badges</option>
                {badges.map((badge) => (
                  <option key={badge.id} value={badge.name}>
                    {badge.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 6: Leagues - Full width */}
            <div className="filter-group">
              <label>Leagues</label>
              <div className="sizes-checkboxes">
                {leagues.map((league) => (
                  <label
                    key={league.id}
                    className="size-checkbox"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.leagues.includes(league.id)}
                      onChange={() => handleLeagueToggle(league.id)}
                      style={{
                        width: '14px',
                        height: '14px',
                        margin: 0,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1 }}>{league.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Row 7: Player & Number */}
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

            {/* Row 8: On Sale Filter - Radio Buttons */}
            <div className="filter-group">
              <label className="sale-status-label">Sale Status</label>
              <div className="sale-status-options">
                <label className="sale-status-radio-label">
                  <input
                    type="radio"
                    name="onSale"
                    value="all"
                    checked={filters.onSale === 'all'}
                    onChange={(e) => handleFilterChange('onSale', e.target.value)}
                    className="sale-status-radio"
                  />
                  <span>All Products</span>
                </label>
                <label className="sale-status-radio-label">
                  <input
                    type="radio"
                    name="onSale"
                    value="on-sale"
                    checked={filters.onSale === 'on-sale'}
                    onChange={(e) => handleFilterChange('onSale', e.target.value)}
                    className="sale-status-radio"
                  />
                  <span>On Sale</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
