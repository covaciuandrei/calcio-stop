import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Nameset } from "../types/types";

interface Props {
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  onAdd?: (newNameset: Nameset) => void; // optional callback
}

const generateSeasons = (): string[] => {
  const seasons: string[] = [];
  for (let year = 1990; year <= 2025; year++) {
    seasons.push(`${year}/${year + 1}`);
  }
  return seasons;
};

const AddNamesetForm: React.FC<Props> = ({ namesets, setNamesets, onAdd }) => {
  const [playerName, setPlayerName] = useState("");
  const [number, setNumber] = useState<number | "">("");
  const [season, setSeason] = useState("2025/2026");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return alert("Player name cannot be empty");
    if (number === "" || number < 1) return alert("Number must be positive");

    const newNameset: Nameset = {
      id: uuidv4(),
      playerName: playerName.trim(),
      number: Number(number),
      season,
    };

    setNamesets([...namesets, newNameset]);
    if (onAdd) onAdd(newNameset); // optional callback
    // ✅ No navigate here
    setPlayerName("");
    setNumber("");
    setSeason("2025/2026");
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h4>Add Nameset</h4>
      <input
        type="text"
        placeholder="Player Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Number (positive)"
        min={1}
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value) || "")}
        required
      />
      <select value={season} onChange={(e) => setSeason(e.target.value)}>
        {generateSeasons().map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button type="submit" className="btn">
        Save
      </button>
    </form>
  );
};

export default AddNamesetForm;
