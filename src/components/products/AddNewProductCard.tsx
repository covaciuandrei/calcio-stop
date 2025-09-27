import React from 'react';
import { Nameset, Product, Team } from '../../types';
import AddProductForm from './AddProductForm';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  archivedTeams: Team[];
  setArchivedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const AddNewProductCard: React.FC<Props> = ({
  products,
  setProducts,
  namesets,
  setNamesets,
  archivedNamesets,
  setArchivedNamesets,
  teams,
  setTeams,
  archivedTeams,
  setArchivedTeams,
}) => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New Product</span>
      </div>
      <div className="card-content">
        <AddProductForm
          products={products}
          setProducts={setProducts}
          namesets={namesets}
          setNamesets={setNamesets}
          archivedNamesets={archivedNamesets}
          setArchivedNamesets={setArchivedNamesets}
          teams={teams}
          setTeams={setTeams}
          archivedTeams={archivedTeams}
          setArchivedTeams={setArchivedTeams}
        />
      </div>
    </div>
  );
};

export default AddNewProductCard;
