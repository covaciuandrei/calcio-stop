import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const EditProduct: React.FC<Props> = ({
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);
  const [name, setName] = useState('');
  const [type, setType] = useState<ProductType>(ProductType.SHIRT);
  const [sizes, setSizes] = useState<ProductSizeQuantity[]>([]);
  const [selectedNamesetId, setSelectedNamesetId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setType(product.type);
    setSizes(product.sizes);
    setSelectedNamesetId(product.namesetId);
    setSelectedTeamId(product.teamId);
    setPrice(product.price || 0);
  }, [product]);

  useEffect(() => {
    // When product loads, set the sizes from the product
    if (product && product.sizes) {
      setSizes(product.sizes);
    }
  }, [product]);

  useEffect(() => {
    // Only update sizes when type changes AND we don't have existing sizes from the product
    if (!product || (product.sizes && product.sizes.length > 0)) return;

    const newSizes = type === ProductType.KID_KIT ? kidSizes : adultSizes;
    const initialSizes = newSizes.map((s) => ({ size: s, quantity: 0 }));
    setSizes(initialSizes);
  }, [type, product]);

  if (!product) return <p>Product not found.</p>;

  const handleSizeQuantityChange = (size: string, qty: number) => {
    setSizes((prev) => prev.map((sq) => (sq.size === size ? { ...sq, quantity: qty } : sq)));
  };

  const handleSave = () => {
    // Product notes are optional if a team is selected
    if (!name.trim() && !selectedTeamId) {
      alert('Please enter product notes or select a team');
      return;
    }
    const updated = products.map((p) =>
      p.id === product.id
        ? {
            ...p,
            name: name.trim() || '', // Allow empty notes if team is selected
            type,
            sizes,
            namesetId: selectedNamesetId,
            teamId: selectedTeamId,
            price: Number(price) || 0,
          }
        : p
    );
    setProducts(updated);
  };

  return (
    <div className="card">
      <h1 className="section-header">Edit Product</h1>
      <div className="form-inline">
        <div className="form-group">
          <label>Select a team</label>
          <TeamPicker
            teams={teams}
            setTeams={setTeams}
            selectedTeamId={selectedTeamId}
            onTeamSelect={setSelectedTeamId}
            placeholder="Select a team (optional)"
          />
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
                  onChange={(e) => handleSizeQuantityChange(sq.size, Number(e.target.value || 0))}
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
            placeholder="Select a nameset (optional)"
          />
        </div>

        <div className="form-group">
          <label>Price (per unit)</label>
          <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value || 0))} />
        </div>

        <div className="form-button-container">
          <button onClick={handleSave} className="btn btn-success">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
