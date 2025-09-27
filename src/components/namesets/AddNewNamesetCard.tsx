import React from 'react';
import { Nameset } from '../../types';
import AddNamesetForm from './AddNamesetForm';

interface Props {
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
}

const AddNewNamesetCard: React.FC<Props> = ({ namesets, setNamesets }) => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New Nameset</span>
      </div>
      <div className="card-content">
        <AddNamesetForm namesets={namesets} setNamesets={setNamesets} />
      </div>
    </div>
  );
};

export default AddNewNamesetCard;
