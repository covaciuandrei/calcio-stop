import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdultSize, KidSize, Nameset, Product, ProductSizeQuantity, ProductType } from '../types/types';
import NamesetPicker from './NamesetPicker';
interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
}

const adultSizes: AdultSize[] = ['S', 'M', 'L', 'XL', 'XXL'];
const kidSizes: KidSize[] = ['22', '24', '26', '28'];

const EditProduct: React.FC<Props> = ({ products, setProducts, namesets, setNamesets }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);
  const [name, setName] = useState('');
  const [type, setType] = useState<ProductType>(ProductType.SHIRT);
  const [sizes, setSizes] = useState<ProductSizeQuantity[]>([]);
  const [selectedNamesetId, setSelectedNamesetId] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setType(product.type);
    setSizes(product.sizes);
    setSelectedNamesetId(product.namesetId);
    setPrice(product.price || 0);
  }, [product]);

  useEffect(() => {
    // if type changed and sizes empty, initialize default sizes (but keep existing sizes if present)
    if (!product) return;
    if (!sizes || sizes.length === 0) {
      const initial = (type === ProductType.KID_KIT ? kidSizes : adultSizes).map((s) => ({ size: s, quantity: 0 }));
      setSizes(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  if (!product) return <p>Product not found.</p>;

  const handleSizeQuantityChange = (size: string, qty: number) => {
    setSizes((prev) => prev.map((sq) => (sq.size === size ? { ...sq, quantity: qty } : sq)));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Enter product name');
      return;
    }
    const updated = products.map((p) =>
      p.id === product.id
        ? {
            ...p,
            name: name.trim(),
            type,
            sizes,
            namesetId: selectedNamesetId,
            price: Number(price) || 0,
          }
        : p
    );
    setProducts(updated);
    navigate('/');
  };

  return (
    <div className="card">
      <h1 className="section-header">Edit Product</h1>
      <div className="form-inline">
        <div className="form-group">
          <label>Product Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
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

        <NamesetPicker
          namesets={namesets}
          setNamesets={setNamesets}
          selectedNamesetId={selectedNamesetId}
          onNamesetSelect={setSelectedNamesetId}
          placeholder="Select a nameset (optional)"
        />

        <div className="form-group">
          <label>Price</label>
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
