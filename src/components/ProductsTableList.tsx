import React from 'react';
import { Nameset, Product, Team } from '../types/types';
import { getNamesetInfo, getTeamInfo } from '../utils/utils';

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  searchTerm?: string;
  namesets: Nameset[];
  archivedNamesets: Nameset[];
  teams: Team[];
  archivedTeams: Team[];
}

const ProductsTableList: React.FC<Props> = ({
  products,
  onEdit,
  onDelete,
  searchTerm = '',
  namesets,
  archivedNamesets,
  teams,
  archivedTeams,
}) => {
  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const teamInfo = getTeamInfo(product.teamId, teams, archivedTeams);
    const namesetInfo = getNamesetInfo(product.namesetId, namesets, archivedNamesets);
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teamInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      namesetInfo.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      namesetInfo.season.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm)
    );
  });

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
          <th>Sizes & Quantities</th>
          <th>Season</th>
          <th>Player</th>
          <th>Number</th>
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
            <td className="price-display">${p.price.toFixed ? p.price.toFixed(2) : p.price}</td>
            <td>
              <button onClick={() => onEdit(p)} className="btn btn-warning">
                Edit
              </button>
              <button onClick={() => onDelete(p.id)} className="btn btn-danger">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductsTableList;
