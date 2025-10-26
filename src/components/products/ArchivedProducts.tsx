import React from 'react';
import {
  useArchivedBadges,
  useArchivedKitTypes,
  useArchivedNamesets,
  useArchivedTeams,
  useBadgesList,
  useKitTypesList,
  useNamesetsList,
  useProductsActions,
  useProductsStore,
  useTeamsList,
} from '../../stores';
import { Product } from '../../types';
import { getBadgeInfo, getKitTypeInfo, getNamesetInfo, getTeamInfo } from '../../utils/utils';

interface Props {
  archivedProducts: Product[];
  searchTerm?: string;
  onClearSearch?: () => void;
}

const ArchivedProducts: React.FC<Props> = ({ archivedProducts, searchTerm = '', onClearSearch }) => {
  // Get data from stores
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();
  const { restoreProduct, deleteProduct } = useProductsActions();
  const { error, clearError } = useProductsStore();

  const handleRestore = (id: string) => {
    restoreProduct(id);
    onClearSearch?.(); // Clear search after action
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      deleteProduct(id);
      onClearSearch?.(); // Clear search after action
    }
  };

  // Filter products based on search term
  const filteredProducts = archivedProducts.filter(
    (product) =>
      (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (archivedProducts.length === 0) {
    return <p>No archived products.</p>;
  }

  if (filteredProducts.length === 0 && searchTerm) {
    return <p>No archived products found matching "{searchTerm}".</p>;
  }

  return (
    <div>
      {error && (
        <div
          className="error-message"
          style={{
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
          }}
        >
          {error}
          <button
            onClick={clearError}
            style={{ marginLeft: '0.5rem', background: 'none', border: 'none', fontSize: '1.2em', cursor: 'pointer' }}
            title="Clear error"
          >
            ×
          </button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Notes</th>
            <th>Type</th>
            <th>Kit Type</th>
            <th>Sizes & Quantities</th>
            <th>Season</th>
            <th>Player</th>
            <th>Number</th>
            <th>Badge</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id}>
              <td>{getTeamInfo(p.teamId, teams, archivedTeams)}</td>
              <td>{p.name || '-'}</td>
              <td>{p.type}</td>
              <td>{getKitTypeInfo(p.kitTypeId, kitTypes, archivedKitTypes)}</td>
              <td>
                <div className="size-quantity-display">
                  {p.sizes.map((sq) => (
                    <div key={sq.size} className="size-quantity-item">
                      {sq.size}: {sq.quantity}
                    </div>
                  ))}
                </div>
              </td>
              <td>
                {(() => {
                  const namesetInfo = getNamesetInfo(p.namesetId, namesets, archivedNamesets);
                  return namesetInfo.season;
                })()}
              </td>
              <td>
                {(() => {
                  const namesetInfo = getNamesetInfo(p.namesetId, namesets, archivedNamesets);
                  return namesetInfo.playerName;
                })()}
              </td>
              <td>
                {(() => {
                  const namesetInfo = getNamesetInfo(p.namesetId, namesets, archivedNamesets);
                  return namesetInfo.number > 0 ? namesetInfo.number : '-';
                })()}
              </td>
              <td>{getBadgeInfo(p.badgeId, badges, archivedBadges)}</td>
              <td className="price-display">${p.price.toFixed ? p.price.toFixed(2) : p.price}</td>
              <td>
                <button onClick={() => handleRestore(p.id)} className="btn btn-icon btn-success" title="Restore">
                  ↩️
                </button>
                <button onClick={() => handleDelete(p.id)} className="btn btn-icon btn-danger" title="Delete Forever">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArchivedProducts;
