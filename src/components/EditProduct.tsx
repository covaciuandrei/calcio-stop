import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product, ProductType, AdultSize, KidSize } from "../types/types";

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const EditProduct: React.FC<Props> = ({ products, setProducts }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  const [name, setName] = useState(product?.name || "");
  const [type, setType] = useState<ProductType>(product?.type || ProductType.SHIRT);
  const [size, setSize] = useState(product?.size || "");
  const [quantity, setQuantity] = useState(product?.quantity || 0);
  const [season, setSeason] = useState(product?.season || "2025/2026");
  const [playerName, setPlayerName] = useState(product?.playerName || "-");
  const [equipmentNumber, setEquipmentNumber] = useState<number | "">(product?.equipmentNumber || "");

  const generateSeasons = (): string[] => {
    const seasons: string[] = [];
    for (let year = 1990; year <= 2025; year++) {
      seasons.push(`${year}/${year + 1}`);
    }
    return seasons;
  };

  const getSizeOptions = () => {
    if (type === ProductType.KID_KIT) return Object.values(KidSize);
    return Object.values(AdultSize);
  };

  const handleSave = () => {
    if (!name || !size) return;

    const updatedProducts = products.map((p) =>
      p.id === id
        ? {
            ...p,
            name,
            type,
            size,
            quantity,
            season,
            playerName: playerName || "-",
            equipmentNumber: Number(equipmentNumber) || 0,
          }
        : p
    );

    setProducts(updatedProducts);
    navigate("/");
  };

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="card">
      <h2>Edit Product</h2>
      <div className="form-inline">
        <div className="form-group">
          <label>Product Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as ProductType)}>
            {Object.values(ProductType).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Select size</option>
            {getSizeOptions().map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>

        <div className="form-group">
          <label>Season</label>
          <select value={season} onChange={(e) => setSeason(e.target.value)}>
            {generateSeasons().map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Player Name</label>
          <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Equipment Number</label>
          <input type="number" min={1} value={equipmentNumber} onChange={(e) => setEquipmentNumber(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))} />
        </div>

        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditProduct;
