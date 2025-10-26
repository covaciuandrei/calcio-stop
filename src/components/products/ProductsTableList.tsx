import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useArchivedBadges,
  useArchivedKitTypes,
  useArchivedNamesets,
  useArchivedTeams,
  useBadgesList,
  useKitTypesList,
  useNamesetsList,
  useTeamsList,
} from '../../stores';
import { Product } from '../../types';
import { getBadgeInfo, getKitTypeInfo, getNamesetInfo, getTeamInfo } from '../../utils/utils';

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  searchTerm?: string;
  isReadOnly?: boolean;
}

const ProductsTableList: React.FC<Props> = ({ products, onEdit, onDelete, searchTerm = '', isReadOnly = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if this is a public route
  const isPublicRoute = location.pathname.startsWith('/public');

  // Get data from stores
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  const kitTypes = useKitTypesList();
  const archivedKitTypes = useArchivedKitTypes();
  const badges = useBadgesList();
  const archivedBadges = useArchivedBadges();

  // Check if product is out of stock
  const isOutOfStock = (product: Product) => {
    return product.sizes.every((size) => size.quantity === 0);
  };

  // Get stock status for a given quantity
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'NO STOCK';
    if (quantity <= 2) return 'LOW STOCK';
    return 'IN STOCK';
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const teamInfo = getTeamInfo(product.teamId, teams, archivedTeams);
    const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
    const badgeInfo = getBadgeInfo(product.badgeId, badges, archivedBadges);
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teamInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      namesetInfo.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      namesetInfo.season.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badgeInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm)
    );
  });

  // Handle product row click
  const handleProductClick = (productId: string) => {
    const isPublicRoute = location.pathname.startsWith('/public');
    navigate(isPublicRoute ? `/public/products/${productId}` : `/products/${productId}`);
  };

  if (products.length === 0) {
    return <p>No products available.</p>;
  }

  if (filteredProducts.length === 0 && searchTerm) {
    return <p>No products found matching "{searchTerm}".</p>;
  }

  return (
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
          {!isReadOnly && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {filteredProducts.map((p) => (
          <tr
            key={p.id}
            className={`product-row ${isOutOfStock(p) ? 'out-of-stock-row' : ''}`}
            onClick={() => handleProductClick(p.id)}
            style={{ cursor: 'pointer' }}
          >
            <td>
              {getTeamInfo(p.teamId, teams, archivedTeams)}
              {isOutOfStock(p) && (
                <div
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginTop: '4px',
                    display: 'inline-block',
                  }}
                >
                  OUT OF STOCK
                </div>
              )}
            </td>
            <td>{p.name || '-'}</td>
            <td>{p.type}</td>
            <td>{getKitTypeInfo(p.kitTypeId, kitTypes, archivedKitTypes)}</td>
            <td>
              <div className="size-quantity-display">
                {p.sizes.map((sq) => {
                  const stockStatus = getStockStatus(sq.quantity);
                  const isOutOfStock = sq.quantity === 0;
                  const isLowStock = sq.quantity > 0 && sq.quantity <= 2;

                  return (
                    <div
                      key={sq.size}
                      className={`size-quantity-item ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}`}
                    >
                      {sq.size}: {isPublicRoute ? stockStatus : sq.quantity}
                    </div>
                  );
                })}
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
            {!isReadOnly && (
              <td onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onEdit(p)} className="btn btn-icon btn-success" title="Edit">
                  ✏️
                </button>
                <button onClick={() => onDelete(p.id)} className="btn btn-icon btn-secondary" title="Archive">
                  📦
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductsTableList;
