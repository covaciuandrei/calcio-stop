import React, { useEffect, useState } from 'react';
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

const AddProductForm: React.FC<Props> = ({ products, setProducts, namesets, setNamesets }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<ProductType>(ProductType.SHIRT);
  const [sizes, setSizes] = useState<ProductSizeQuantity[]>([]);
  const [selectedNamesetId, setSelectedNamesetId] = useState<string | null>(null);
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
    if (!name.trim()) {
      alert('Please enter product name');
      return;
    }
    const newProduct: Product = {
      id: Date.now().toString(),
      name: name.trim(),
      type,
      sizes,
      namesetId: selectedNamesetId,
      price: Number(price) || 0,
    };
    setProducts([...products, newProduct]);
    // reset
    setName('');
    setType(ProductType.SHIRT);
    setSelectedNamesetId(null);
    setPrice(0);
    // sizes will reset via effect when type resets
  };

  return (
    <div>
      <h2>Add Product</h2>

      <div className="form-inline">
        <div className="form-group">
          <label>Product Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Real Madrid Home" />
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

        <div style={{ width: '100%' }}>
          <label>Sizes & Quantities</label>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
            {sizes.map((sq) => (
              <div
                key={sq.size}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 90,
                }}
              >
                <div style={{ fontWeight: 600 }}>{sq.size}</div>
                <input
                  type="number"
                  min={0}
                  value={sq.quantity}
                  onChange={(e) => handleQuantityChange(sq.size, Number(e.target.value || 0))}
                  style={{ padding: 6 }}
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
          <label>Price (per unit)</label>
          <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value || 0))} />
        </div>

        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={addProduct}>Add Product</button>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
