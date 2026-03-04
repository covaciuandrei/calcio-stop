import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNamesetImagesMapDebounced } from '../../hooks/useNamesetImages';
import { useArchivedKitTypes, useKitTypesList, useNamesetsActions, useNamesetsStore } from '../../stores';
import { Nameset } from '../../types';
import { getKitTypeInfo } from '../../utils/utils';

interface Props {
  archivedNamesets: Nameset[];
  searchTerm?: string;
  onClearSearch?: () => void;
}

const ArchivedNamesets: React.FC<Props> = ({ archivedNamesets, searchTerm = '', onClearSearch }) => {
  // Get store actions and state
  const { restoreNameset, deleteNameset } = useNamesetsActions();
  const { error, clearError } = useNamesetsStore();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicRoute = !location.pathname.startsWith('/admin');

  const namesetIds = archivedNamesets.map((n) => n.id);
  const { imagesMap } = useNamesetImagesMapDebounced(namesetIds, 500);

  const handleNamesetClick = (namesetId: string) => {
    navigate(isPublicRoute ? `/namesets/${namesetId}` : `/admin/namesets/${namesetId}`);
  };
  const handleRestore = (id: string) => {
    restoreNameset(id);
    onClearSearch?.(); // Clear search after action
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this nameset?')) return;
    deleteNameset(id);
    onClearSearch?.(); // Clear search after action
  };

  // Filter namesets based on search term
  const filteredNamesets = archivedNamesets.filter(
    (nameset) =>
      (nameset.playerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (nameset.season || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (nameset.number || '').toString().includes(searchTerm)
  );

  if (archivedNamesets.length === 0) {
    return <p>No archived namesets available.</p>;
  }

  if (filteredNamesets.length === 0 && searchTerm) {
    return <p>No archived namesets found matching "{searchTerm}".</p>;
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
            <th>Image</th>
            <th>Player</th>
            <th>Number</th>
            <th>Season</th>
            <th>Kit Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredNamesets.map((n) => {
            const namesetImages = imagesMap[n.id] || [];
            const primaryImage = namesetImages.find((img) => img.isPrimary) || namesetImages[0];

            return (
              <tr key={n.id} className="nameset-row" onClick={() => handleNamesetClick(n.id)} style={{ cursor: 'pointer' }}>
                <td
                  className="nameset-image-preview"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNamesetClick(n.id);
                  }}
                  title="Click to view nameset details"
                >
                  {primaryImage ? (
                    <img
                      src={primaryImage.thumbnailUrl || primaryImage.imageUrl}
                      alt={n.playerName || 'Nameset image'}
                      className="nameset-thumbnail"
                    />
                  ) : (
                    <div className="no-image-placeholder">📷</div>
                  )}
                </td>
                <td>{n.playerName}</td>
                <td>{n.number}</td>
                <td>{n.season}</td>
                <td>{getKitTypeInfo(n.kitTypeId, kitTypes, archivedKitTypes)}</td>
                <td className="price-display">{n.quantity}</td>
                <td className="price-display">{n.price.toFixed(2)} RON</td>
                <td>{n.location || '-'}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleRestore(n.id)} className="btn btn-icon btn-success" title="Restore">
                    ↩️
                  </button>
                  <button onClick={() => handleDelete(n.id)} className="btn btn-icon btn-danger" title="Delete Forever">
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ArchivedNamesets;
