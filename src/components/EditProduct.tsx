import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product, ProductType, AdultSize, KidSize, ProductSizeQuantity } from "../types/types";

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

const EditProduct: React.FC<Props> = ({ products, setProducts }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id);
  const [name, setName] = useState("");
  const [type, setType] = useState<ProductType>(ProductType.SHIRT);
  const [sizes, setSizes] = useState<ProductSizeQuantity[]>([]);
  const [season, setSeason] = useState("2025/2026");
  const [playerName, setPlayerName] = useState("-");
  const [equipmentNumber, setEquipmentNumber] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setType(product.type);
    setSizes(product.sizes);
    setSeason(product.season);
    setPlayerName(product.playerName || "-");
    setEquipmentNumber(product.equipmentNumber || 0);
    setPrice(product.price || 0);
  }, [product]);

  useEffect(() => {
    // if type changed and sizes empty, initialize default sizes (but keep existing sizes if present)
    if (!product) return;
    if (!sizes || sizes.length === 0) {
      const initial = (type === ProductType.KID_KIT ? kidSizes : adultSizes).map(s => ({ size: s, quantity: 0 }));
      setSizes(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  if (!product) return <p>Product not found.</p>;

  const handleSizeQuantityChange = (size: string, qty: number) => {
    setSizes(prev => prev.map(sq => sq.size === size ? { ...sq, quantity: qty } : sq));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Enter product name");
      return;
    }
    const updated = products.map(p => p.id === product.id ? {
      ...p,
      name: name.trim(),
      type,
      sizes,
      season,
      playerName: playerName || "-",
      equipmentNumber: Number(equipmentNumber) || 0,
      price: Number(price) || 0,
    } : p);
    setProducts(updated);
    navigate("/");
  };

  return (
    <div className="card">
      <h2>Edit Product</h2>
      <div className="form-inline">

        <div className="form-group">
          <label>Product Name</label>
          <input value={name} onChange={e => setName(e.target.value)} />
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
                <input type="number" min={0} value={sq.quantity} onChange={e => handleSizeQuantityChange(sq.size, Number(e.target.value || 0))} />
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
          <input value={playerName} onChange={e => setPlayerName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Equipment Number</label>
          <input type="number" min={0} value={equipmentNumber} onChange={e => setEquipmentNumber(Number(e.target.value || 0))} />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input type="number" min={0} value={price} onChange={e => setPrice(Number(e.target.value || 0))} />
        </div>

        <div style={{ alignSelf: "flex-end" }}>
          <button onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
