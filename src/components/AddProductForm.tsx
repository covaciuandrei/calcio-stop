import React, { useEffect, useState } from 'react';
import { AdultSize, KidSize, Nameset, Product, ProductSizeQuantity, ProductType, Team } from '../types/types';
import NamesetPicker from './NamesetPicker';
import TeamPicker from './TeamPicker';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  archivedTeams: Team[];
  setArchivedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const adultSizes: AdultSize[] = ['S', 'M', 'L', 'XL', 'XXL'];
const kidSizes: KidSize[] = ['22', '24', '26', '28'];

const AddProductForm: React.FC<Props> = ({
  products,
  setProducts,
  namesets,
  setNamesets,
  archivedNamesets,
  setArchivedNamesets,
  teams,
  setTeams,
  archivedTeams,
  setArchivedTeams,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<ProductType>(ProductType.SHIRT);
  const [sizes, setSizes] = useState<ProductSizeQuantity[]>([]);
  const [selectedNamesetId, setSelectedNamesetId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    // initialize sizes depending on type
    const initial = (type === ProductType.KID_KIT ? kidSizes : adultSizes).map((s) => ({ size: s, quantity: 0 }));
    setSizes(initial);
  }, [type]);

  const handleQuantityChange = (size: string, value: number) => {
    setSizes((prev) => prev.map((p) => (p.size === size ? { ...p, quantity: value } : p)));
  };

  const addProduct = () => {
    // Product notes are optional if a team is selected
    if (!name.trim() && !selectedTeamId) {
      alert('Please enter product notes or select a team');
      return;
    }

    // Calculate total quantity of all sizes in the product
    const totalProductQuantity = sizes.reduce((total, sizeQty) => total + sizeQty.quantity, 0);

    if (totalProductQuantity <= 0) {
      alert('Please add at least one item to the product');
      return;
    }

    // Check if nameset has available quantity
    if (selectedNamesetId) {
      const selectedNameset = namesets.find((n) => n.id === selectedNamesetId);
      if (selectedNameset && selectedNameset.quantity < totalProductQuantity) {
        alert(
          `Selected nameset only has ${selectedNameset.quantity} available, but you're trying to add ${totalProductQuantity} items`
        );
        return;
      }
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: name.trim() || '', // Allow empty notes if team is selected
      type,
      sizes,
      namesetId: selectedNamesetId,
      teamId: selectedTeamId,
      price: Number(price) || 0,
    };

    setProducts([...products, newProduct]);

    // Decrement nameset quantity by the total product quantity if a nameset was selected
    if (selectedNamesetId) {
      setNamesets((prevNamesets) =>
        prevNamesets.map((n) =>
          n.id === selectedNamesetId ? { ...n, quantity: Math.max(0, n.quantity - totalProductQuantity) } : n
        )
      );
    }

    // reset
    setName('');
    setType(ProductType.SHIRT);
    setSelectedNamesetId(null);
    setSelectedTeamId(null);
    setPrice(0);
    // sizes will reset via effect when type resets
  };

  return (
    <div className="form-inline">
      <div className="form-group">
        <label>Select a team</label>
        <TeamPicker
          teams={teams}
          setTeams={setTeams}
          selectedTeamId={selectedTeamId}
          onTeamSelect={setSelectedTeamId}
          placeholder="Ex: Real Madrid"
        />{' '}
      </div>

      <div className="form-group">
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as ProductType)}>
          {Object.values(ProductType).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Product Notes {selectedTeamId ? '(optional)' : ''}</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={selectedTeamId ? 'e.g. Home, Away, Third (optional)' : 'e.g. Real Madrid Home'}
        />
      </div>

      <div className="form-group" style={{ width: '100%' }}>
        <label>Sizes & Quantities</label>
        <div className="size-quantity-grid">
          {sizes.map((sq) => (
            <div key={sq.size} className="size-quantity-item">
              <div className="size-quantity-label">{sq.size}</div>
              <input
                type="number"
                min={0}
                value={sq.quantity}
                onChange={(e) => handleQuantityChange(sq.size, Number(e.target.value || 0))}
                className="size-quantity-input"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Select a nameset</label>
        <NamesetPicker
          namesets={namesets}
          setNamesets={setNamesets}
          selectedNamesetId={selectedNamesetId}
          onNamesetSelect={setSelectedNamesetId}
          placeholder="Ex: Messi 10"
        />{' '}
      </div>

      <div className="form-group">
        <label>Price (per unit)</label>
        <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value || 0))} />
      </div>

      <div className="form-button-container">
        <button onClick={addProduct} className="btn btn-success">
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProductForm;
