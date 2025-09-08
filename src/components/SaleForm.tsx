import React, { useState } from "react";
import { Product, Sale } from "../types/types";

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
}

const SaleForm: React.FC<Props> = ({
  products,
  setProducts,
  sales,
  setSales,
}) => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [priceSold, setPriceSold] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState("");

  const handleSale = () => {
    if (!productId || quantity <= 0 || priceSold <= 0) {
      alert("Please fill all required fields");
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;
    if (product.quantity < quantity) {
      alert("Not enough stock");
      return;
    }

    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, quantity: p.quantity - quantity } : p
    );
    setProducts(updatedProducts);

    const newSale: Sale = {
      id: Date.now().toString(),
      productId,
      quantity,
      priceSold,
      customerName,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
    };
    setSales([...sales, newSale]);

    setProductId("");
    setQuantity(1);
    setPriceSold(0);
    setCustomerName("");
    setDate("");
  };

  return (
    <div>
      <h2>Record Sale</h2>
      <div className="form-inline">
        <div className="form-group">
          <label>Product</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - {p.type} - {p.size} ({p.season}) - {p.playerName} #
                {p.equipmentNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Price Sold</label>
          <input
            type="number"
            value={priceSold}
            onChange={(e) => setPriceSold(Number(e.target.value))}
            placeholder="e.g. 55"
          />
        </div>

        <div className="form-group">
          <label>Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button onClick={handleSale}>Record Sale</button>
      </div>
    </div>
  );
};

export default SaleForm;
