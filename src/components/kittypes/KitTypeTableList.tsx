import React from 'react';
import { isDefaultKitType } from '../../constants/kitTypes';
import { KitType } from '../../types';

interface Props {
  kitTypes: KitType[];
  onEdit: (kitType: KitType) => void;
  onArchive: (id: string) => void;
  searchTerm?: string;
}

const KitTypeTableList: React.FC<Props> = ({ kitTypes, onEdit, onArchive, searchTerm = '' }) => {
  // Filter kit types based on search term
  const filteredKitTypes = kitTypes.filter((kitType) => kitType.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (kitTypes.length === 0) {
    return <p>No kit types available.</p>;
  }

  if (filteredKitTypes.length === 0 && searchTerm) {
    return <p>No kit types found matching "{searchTerm}".</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Kit Type Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredKitTypes.map((kt) => {
          const isDefault = isDefaultKitType(kt);

          return (
            <tr key={kt.id}>
              <td>{kt.name}</td>
              <td>
                {!isDefault && (
                  <button onClick={() => onEdit(kt)} className="btn btn-icon btn-success" title="Edit">
                    ✏️
                  </button>
                )}
                {!isDefault && (
                  <button onClick={() => onArchive(kt.id)} className="btn btn-icon btn-secondary" title="Archive">
                    📦
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default KitTypeTableList;
