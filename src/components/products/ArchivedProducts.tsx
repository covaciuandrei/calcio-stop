import React from 'react';
import { useArchivedNamesets, useArchivedTeams, useNamesetsList, useTeamsList } from '../../stores';
import { Product } from '../../types';
import { getNamesetInfo, getTeamInfo } from '../../utils/utils';

interface Props {
  archivedProducts: Product[];
}

const ArchivedProducts: React.FC<Props> = ({ archivedProducts }) => {
  // Get data from stores
  const namesets = useNamesetsList();
  const archivedNamesets = useArchivedNamesets();
  const teams = useTeamsList();
  const archivedTeams = useArchivedTeams();
  return (
    <div>
      {archivedProducts.length === 0 ? (
        <p>No archived products.</p>
      ) : (
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
            </tr>
          </thead>
          <tbody>
            {archivedProducts.map((p) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ArchivedProducts;
