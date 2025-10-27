import React from 'react';
import { useArchivedKitTypes, useKitTypesList } from '../../stores';
import { Nameset } from '../../types';
import { getKitTypeInfo } from '../../utils/utils';

interface Props {
  namesets: Nameset[];
  onEdit: (n: Nameset) => void;
  onDelete?: (id: string) => void;
  onArchive: (id: string) => void;
  searchTerm?: string;
  isReadOnly?: boolean;
}

const NamesetTableList: React.FC<Props> = ({
  namesets,
  onEdit,
  onDelete,
  onArchive,
  searchTerm = '',
  isReadOnly = false,
}) => {
  // Get data from stores
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();

  // Check if nameset is out of stock
  const isOutOfStock = (nameset: { quantity: number }) => {
    return nameset.quantity === 0;
  };

  // Filter namesets based on search term
  const filteredNamesets = namesets.filter(
    (nameset) =>
      (nameset.playerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (nameset.season || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (nameset.number || '').toString().includes(searchTerm)
  );

  if (namesets.length === 0) {
    return <p>No namesets available.</p>;
  }

  if (filteredNamesets.length === 0 && searchTerm) {
    return <p>No namesets found matching "{searchTerm}".</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Number</th>
          <th>Season</th>
          <th>Kit Type</th>
          <th>Quantity</th>
          <th>Price</th>
          {!isReadOnly && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {filteredNamesets.map((n) => (
          <tr key={n.id} className={isOutOfStock(n) ? 'out-of-stock-row' : ''}>
            <td>
              {n.playerName}
              {isOutOfStock(n) && <div className="out-of-stock-badge">OUT OF STOCK</div>}
            </td>
            <td>{n.number}</td>
            <td>{n.season}</td>
            <td>{getKitTypeInfo(n.kitTypeId, kitTypes, archivedKitTypes)}</td>
            <td className="quantity-display">{n.quantity}</td>
            <td className="price-display">{n.price.toFixed(2)} RON</td>
            {!isReadOnly && (
              <td>
                <button onClick={() => onEdit(n)} className="btn btn-icon btn-success" title="Edit">
                  ✏️
                </button>
                <button onClick={() => onArchive(n.id)} className="btn btn-icon btn-secondary" title="Archive">
                  📦
                </button>
                {onDelete && (
                  <button onClick={() => onDelete(n.id)} className="btn btn-icon btn-danger" title="Delete">
                    🗑️
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NamesetTableList;
