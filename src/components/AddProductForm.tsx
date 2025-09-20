import React, { useEffect, useState } from "react";
import { Product, ProductType, ProductSizeQuantity, AdultSize, KidSize } from "../types/types";

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const adultSizes: AdultSize[] = ["S", "M", "L", "XL", "XXL"];
const kidSizes: KidSize[] = ["22", "24", "26", "28"];

const generateSeasons = (): string[] => {
  const seasons: string[] = [];
  for (let year = 1990; year <= 2025; year++) seasons.push(`${year}/${year + 1}`);
  return seasons;
};

const AddProductForm: React.FC<Props> = ({ products, setProducts }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<ProductType>(ProductType.SHIRT);
  const [sizes, setSizes] = useState<ProductSizeQuantity[]>([]);
  const [season, setSeason] = useState("2025/2026");
  const [playerName, setPlayerName] = useState("-");
  const [equipmentNumber, setEquipmentNumber] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    // initialize sizes depending on type
    const initial = (type === ProductType.KID_KIT ? kidSizes : adultSizes).map(s => ({ size: s, quantity: 0 }));
    setSizes(initial);
  }, [type]);

  const handleQuantityChange = (size: string, value: number) => {
    setSizes(prev => prev.map(p => (p.size === size ? { ...p, quantity: value } : p)));
  };

  const addProduct = () => {
    if (!name.trim()) {
      alert("Please enter product name");
      return;
    }
    const newProduct: Product = {
      id: Date.now().toString(),
      name: name.trim(),
      type,
      sizes,
      season,
      playerName: playerName || "-",
      equipmentNumber: Number(equipmentNumber) || 0,
      price: Number(price) || 0,
    };
    setProducts([...products, newProduct]);
    // reset
    setName("");
    setType(ProductType.SHIRT);
    setSeason("2025/2026");
    setPlayerName("-");
    setEquipmentNumber(0);
    setPrice(0);
    // sizes will reset via effect when type resets
  };

  return (
    <div>
      <h2>Add Product</h2>

      <div className="form-inline">
        <div className="form-group">
          <label>Product Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Real Madrid Home" />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={e => setType(e.target.value as ProductType)}>
            {Object.values(ProductType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ width: "100%" }}>
          <label>Sizes & Quantities</label>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
            {sizes.map(sq => (
              <div key={sq.size} style={{ display: "flex", flexDirection: "column", minWidth: 90 }}>
                <div style={{ fontWeight: 600 }}>{sq.size}</div>
                <input
                  type="number"
                  min={0}
                  value={sq.quantity}
                  onChange={e => handleQuantityChange(sq.size, Number(e.target.value || 0))}
                  style={{ padding: 6 }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Season</label>
          <select value={season} onChange={e => setSeason(e.target.value)}>
            {generateSeasons().map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Player Name</label>
          <input value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="e.g. Messi or -" />
        </div>

        <div className="form-group">
          <label>Equipment Number</label>
          <input type="number" min={0} value={equipmentNumber} onChange={e => setEquipmentNumber(Number(e.target.value || 0))} />
        </div>

        <div className="form-group">
          <label>Price (per unit)</label>
          <input type="number" min={0} value={price} onChange={e => setPrice(Number(e.target.value || 0))} />
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <button onClick={addProduct}>Add Product</button>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
