import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Nameset, Product, ProductSizeQuantity, ProductType, Team } from '../../types';
import NamesetPicker from '../namesets/NamesetPicker';
import styles from '../shared/Form.module.css';
import TeamPicker from '../teams/TeamPicker';

interface Props {
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const EditProductModal: React.FC<Props> = ({
  editingProduct,
  setEditingProduct,
  setProducts,
  namesets,
  setNamesets,
  teams,
  setTeams,
}) => {
  const [name, setName] = useState(editingProduct?.name || '');
  const [type, setType] = useState<ProductType>(editingProduct?.type || ProductType.SHIRT);
  const [sizes, setSizes] = useState<ProductSizeQuantity[]>(editingProduct?.sizes || []);
  const [selectedNamesetId, setSelectedNamesetId] = useState<string | null>(editingProduct?.namesetId || null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(editingProduct?.teamId || null);
  const [price, setPrice] = useState<number>(editingProduct?.price || 0);

  // Update state when editingProduct changes
  React.useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setType(editingProduct.type);
      setSizes(editingProduct.sizes);
      setSelectedNamesetId(editingProduct.namesetId);
      setSelectedTeamId(editingProduct.teamId);
      setPrice(editingProduct.price || 0);
    }
  }, [editingProduct]);

  const handleSaveEdit = () => {
    if (!editingProduct) return;

    // Product notes are optional if a team is selected
    if (!name.trim() && !selectedTeamId) {
      alert('Please enter product notes or select a team');
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: name.trim() || '',
              type,
              sizes,
              namesetId: selectedNamesetId,
              teamId: selectedTeamId,
              price: Number(price) || 0,
            }
          : p
      )
    );
    setEditingProduct(null);
  };

  const handleSizeQuantityChange = (size: string, qty: number) => {
    setSizes((prev) => prev.map((sq) => (sq.size === size ? { ...sq, quantity: qty } : sq)));
  };

  if (!editingProduct) return null;

  return createPortal(
    <div className="modal">
      <div className={`modal-content ${styles.modalContentScrollable}`}>
        <h3>Edit Product</h3>

        <label>
          Select a team:
          <TeamPicker
            teams={teams}
            setTeams={setTeams}
            selectedTeamId={selectedTeamId}
            onTeamSelect={setSelectedTeamId}
            placeholder="Select a team (optional)"
          />
        </label>

        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value as ProductType)}>
            {Object.values(ProductType).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label>
          Product Notes {selectedTeamId ? '(optional)' : ''}:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={selectedTeamId ? 'e.g. Home, Away, Third (optional)' : 'e.g. Real Madrid Home'}
          />
        </label>

        <label>
          Sizes & Quantities:
          <div className={`size-quantity-grid ${styles.sizeQuantityGrid}`}>
            {sizes.map((sq) => (
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
            selectedNamesetId={selectedNamesetId}
            onNamesetSelect={setSelectedNamesetId}
            placeholder="Select a nameset (optional)"
          />
        </label>

        <label>
          Price (per unit):
          <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value || 0))} />
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
    </div>,
    document.body
  );
};

export default EditProductModal;
