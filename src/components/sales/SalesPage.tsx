import React from 'react';
import { Nameset, Product, Sale, Team } from '../../types';
import AddNewSaleCard from './AddNewSaleCard';
import SalesTableListCard from './SalesTableListCard';

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

const SalesPage: React.FC<Props> = ({
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
    <div>
      {/* Add New Sale Card */}
      <AddNewSaleCard
        products={products}
        setProducts={setProducts}
        sales={sales}
        setSales={setSales}
        namesets={namesets}
        archivedNamesets={archivedNamesets}
        teams={teams}
        archivedTeams={archivedTeams}
      />

      {/* Sales Table List Card */}
      <SalesTableListCard
        sales={sales}
        setSales={setSales}
        products={products}
        namesets={namesets}
        archivedNamesets={archivedNamesets}
        teams={teams}
        archivedTeams={archivedTeams}
      />
    </div>
  );
};

export default SalesPage;
