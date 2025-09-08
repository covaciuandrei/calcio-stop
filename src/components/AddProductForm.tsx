import React, { useState } from "react";
import { Product, ProductType, AdultSize, KidSize } from "../types/types";

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const AddProductForm: React.FC<Props> = ({ products, setProducts }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<ProductType>(ProductType.SHIRT);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [season, setSeason] = useState("2025/2026");
  const [playerName, setPlayerName] = useState("-");
  const [equipmentNumber, setEquipmentNumber] = useState<number | "">("");

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

  const addProduct = () => {
    if (!name || !size) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      type,
      size,
      quantity,
      season,
      playerName: playerName || "-",
      equipmentNumber: Number(equipmentNumber) || 0,
    };

    setProducts([...products, newProduct]);

    // Reset form
    setName("");
    setType(ProductType.SHIRT);
    setSize("");
    setQuantity(0);
    setSeason("2025/2026");
    setPlayerName("-");
    setEquipmentNumber("");
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
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} placeholder="e.g. 10" />
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
          <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="e.g. Messi" />
        </div>

        <div className="form-group">
          <label>Equipment Number</label>
          <input type="number" min={1} value={equipmentNumber} onChange={(e) => setEquipmentNumber(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))} placeholder="e.g. 10" />
        </div>

        <button onClick={addProduct}>Add Product</button>
      </div>
    </div>
  );
};

export default AddProductForm;
