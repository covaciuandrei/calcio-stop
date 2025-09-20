import React from 'react';
import { Nameset, Product } from '../types/types';
import { getNamesetInfo } from '../utils/utils';

interface Props {
  archivedProducts: Product[];
  namesets: Nameset[];
}

const ArchivedProducts: React.FC<Props> = ({ archivedProducts, namesets }) => {
  return (
    <div>
      <h2>Archived Products</h2>
      {archivedProducts.length === 0 ? (
        <p>No archived products.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Sizes & Quantities</th>
              <th>Season</th>
              <th>Player</th>
              <th>Number</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {archivedProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>
                  {p.sizes.map((sq) => (
                    <div key={sq.size}>
                      {sq.size}: {sq.quantity}
                    </div>
                  ))}
                </td>
                <td>
                  {(() => {
                    const namesetInfo = getNamesetInfo(p.namesetId, namesets);
                    return namesetInfo.season;
                  })()}
                </td>
                <td>
                  {(() => {
                    const namesetInfo = getNamesetInfo(p.namesetId, namesets);
                    return namesetInfo.playerName;
                  })()}
                </td>
                <td>
                  {(() => {
                    const namesetInfo = getNamesetInfo(p.namesetId, namesets);
                    return namesetInfo.number > 0 ? namesetInfo.number : '-';
                  })()}
                </td>
                <td>{p.price.toFixed ? p.price.toFixed(2) : p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ArchivedProducts;
