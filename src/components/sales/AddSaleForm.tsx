import React, { useEffect, useState } from 'react';
import { Nameset, Product, Sale, Team } from '../../types';
import { getNamesetInfo } from '../../utils/utils';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  namesets: Nameset[];
  archivedNamesets: Nameset[];
  teams: Team[];
  archivedTeams: Team[];
}

const AddSaleForm: React.FC<Props> = ({
  products,
  setProducts,
  sales,
  setSales,
  namesets,
  archivedNamesets,
  teams,
  archivedTeams,
}) => {
  const [productId, setProductId] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [priceSold, setPriceSold] = useState<number>(0);
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState('');

  // when product changes, default size selection to first available size
  useEffect(() => {
    const p = products.find((pp) => pp.id === productId);
    if (p) {
      if (p.sizes && p.sizes.length > 0) {
        setSize(p.sizes[0].size);
      } else {
        setSize('');
      }
      // default priceSold to product.price
      setPriceSold(p?.price || 0);
    } else {
      setSize('');
      setPriceSold(0);
    }
  }, [productId, products]);

  const handleSale = () => {
    if (!productId) {
      alert('Select product');
      return;
    }
    if (!size) {
      alert('Select size');
      return;
    }
    if (quantity <= 0) {
      alert('Quantity must be > 0');
      return;
    }
    if (priceSold <= 0) {
      alert('Enter price');
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const sizeObj = product.sizes.find((sq) => sq.size === size);
    if (!sizeObj) {
      alert('Selected size not found');
      return;
    }
    if (sizeObj.quantity < quantity) {
      alert('Not enough stock for that size');
      return;
    }

    // decrement size quantity
    const updatedProducts = products.map((p) => {
      if (p.id !== productId) return p;
      return {
        ...p,
        sizes: p.sizes.map((sq) => (sq.size === size ? { ...sq, quantity: sq.quantity - quantity } : sq)),
      };
    });

    setProducts(updatedProducts);

    const newSale: Sale = {
      id: Date.now().toString(),
      productId,
      size,
      quantity,
      priceSold,
      customerName: customerName || 'N/A',
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
    };

    setSales([...sales, newSale]);

    // reset small fields
    setProductId('');
    setSize('');
    setQuantity(1);
    setPriceSold(0);
    setCustomerName('');
    setDate('');
  };

  return (
    <div className="form-inline">
      <div className="form-group">
        <label>Product</label>
        <select value={productId} onChange={(e) => setProductId(e.target.value)}>
          <option value="">Select product</option>
          {products.map((p) => {
            const namesetInfo = getNamesetInfo(p.namesetId, namesets, archivedNamesets);
            return (
              <option key={p.id} value={p.id}>
                {p.name} - {namesetInfo.playerName} #{namesetInfo.number > 0 ? namesetInfo.number : '-'}
              </option>
            );
          })}
        </select>
      </div>

      <div className="form-group">
        <label>Size</label>
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="">Select size</option>
          {products
            .find((p) => p.id === productId)
            ?.sizes.map((sq) => (
              <option key={sq.size} value={sq.size}>
                {sq.size} (stock: {sq.quantity})
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value || 1))} />
      </div>

      <div className="form-group">
        <label>Price Sold</label>
        <input type="number" min={0} value={priceSold} onChange={(e) => setPriceSold(Number(e.target.value || 0))} />
      </div>

      <div className="form-group">
        <label>Customer Name</label>
        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="form-button-container">
        <button onClick={handleSale} className="btn btn-success">
          Record Sale
        </button>
      </div>
    </div>
  );
};

export default AddSaleForm;
