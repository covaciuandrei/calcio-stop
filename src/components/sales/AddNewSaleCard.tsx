import React from 'react';
import { Nameset, Product, Sale, Team } from '../../types';
import AddSaleForm from './AddSaleForm';

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

const AddNewSaleCard: React.FC<Props> = ({
  products,
  setProducts,
  sales,
  setSales,
  namesets,
  archivedNamesets,
  teams,
  archivedTeams,
}) => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Record New Sale</span>
      </div>
      <div className="card-content">
        <AddSaleForm
          products={products}
          setProducts={setProducts}
          sales={sales}
          setSales={setSales}
          namesets={namesets}
          archivedNamesets={archivedNamesets}
          teams={teams}
          archivedTeams={archivedTeams}
        />
      </div>
    </div>
  );
};

export default AddNewSaleCard;
