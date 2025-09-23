import React, { useState } from 'react';
import { Nameset, Product, ProductSizeQuantity, ProductType, Team } from '../types/types';
import { getNamesetInfo, getTeamInfo } from '../utils/utils';
import NamesetPicker from './NamesetPicker';
import TeamPicker from './TeamPicker';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  archivedProducts: Product[];
  setArchivedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  archivedTeams: Team[];
  setArchivedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const ProductList: React.FC<Props> = ({
  products,
  setProducts,
  archivedProducts,
  setArchivedProducts,
  namesets,
  setNamesets,
  archivedNamesets,
  setArchivedNamesets,
  teams,
  setTeams,
  archivedTeams,
  setArchivedTeams,
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<ProductType>(ProductType.SHIRT);
  const [editSizes, setEditSizes] = useState<ProductSizeQuantity[]>([]);
  const [editSelectedNamesetId, setEditSelectedNamesetId] = useState<string | null>(null);
  const [editSelectedTeamId, setEditSelectedTeamId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  const deleteProduct = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const productToArchive = products.find((p) => p.id === id);
    if (productToArchive) {
      setArchivedProducts((prev) => [...prev, productToArchive]);
    }
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditType(product.type);
    setEditSizes(product.sizes);
    setEditSelectedNamesetId(product.namesetId);
    setEditSelectedTeamId(product.teamId);
    setEditPrice(product.price || 0);
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;

    // Product notes are optional if a team is selected
    if (!editName.trim() && !editSelectedTeamId) {
      alert('Please enter product notes or select a team');
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: editName.trim() || '',
              type: editType,
              sizes: editSizes,
              namesetId: editSelectedNamesetId,
              teamId: editSelectedTeamId,
              price: Number(editPrice) || 0,
            }
          : p
      )
    );
    setEditingProduct(null);
  };

  const handleSizeQuantityChange = (size: string, qty: number) => {
    setEditSizes((prev) => prev.map((sq) => (sq.size === size ? { ...sq, quantity: qty } : sq)));
  };

  return (
    <div>
      {products.length === 0 ? (
        <p>No products available.</p>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
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
                  <button onClick={() => handleEditClick(p)} className="btn btn-warning">
                    Edit
                  </button>
                  <button onClick={() => deleteProduct(p.id)} className="btn btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingProduct && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Product</h3>

            <label>
              Select a team:
              <TeamPicker
                teams={teams}
                setTeams={setTeams}
                selectedTeamId={editSelectedTeamId}
                onTeamSelect={setEditSelectedTeamId}
                placeholder="Select a team (optional)"
              />
            </label>

            <label>
              Type:
              <select value={editType} onChange={(e) => setEditType(e.target.value as ProductType)}>
                {Object.values(ProductType).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Product Notes {editSelectedTeamId ? '(optional)' : ''}:
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder={editSelectedTeamId ? 'e.g. Home, Away, Third (optional)' : 'e.g. Real Madrid Home'}
              />
            </label>

            <label>
              Sizes & Quantities:
              <div className="size-quantity-grid" style={{ marginTop: '10px' }}>
                {editSizes.map((sq) => (
                  <div key={sq.size} className="size-quantity-item">
                    <div className="size-quantity-label">{sq.size}</div>
                    <input
                      type="number"
                      min={0}
                      value={sq.quantity}
                      onChange={(e) => handleSizeQuantityChange(sq.size, Number(e.target.value || 0))}
                      className="size-quantity-input"
                    />
                  </div>
                ))}
              </div>
            </label>

            <label>
              Select a nameset:
              <NamesetPicker
                namesets={namesets}
                setNamesets={setNamesets}
                selectedNamesetId={editSelectedNamesetId}
                onNamesetSelect={setEditSelectedNamesetId}
                placeholder="Select a nameset (optional)"
              />
            </label>

            <label>
              Price (per unit):
              <input
                type="number"
                min={0}
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value || 0))}
              />
            </label>

            <div className="modal-buttons">
              <button onClick={handleSaveEdit} className="btn btn-success">
                Save
              </button>
              <button onClick={() => setEditingProduct(null)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
