import React from 'react';
import { Nameset, Product, Team } from '../../types';
import AddNewProductCard from './AddNewProductCard';
import ArchivedProductsCard from './ArchivedProductsCard';
import ProductsTableListCard from './ProductsTableListCard';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  archivedProducts: Product[];
  setArchivedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  archivedTeams: Team[];
  setArchivedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

const ProductsPage: React.FC<Props> = ({
  products,
  setProducts,
  archivedProducts,
  setArchivedProducts,
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
    <div>
      {/* Add New Product Card */}
      <AddNewProductCard
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

      {/* Products Table List Card */}
      <ProductsTableListCard
        products={products}
        setProducts={setProducts}
        archivedProducts={archivedProducts}
        setArchivedProducts={setArchivedProducts}
        namesets={namesets}
        setNamesets={setNamesets}
        archivedNamesets={archivedNamesets}
        setArchivedNamesets={setArchivedNamesets}
        teams={teams}
        setTeams={setTeams}
        archivedTeams={archivedTeams}
        setArchivedTeams={setArchivedTeams}
      />

      {/* Archived Products Card */}
      <ArchivedProductsCard
        archivedProducts={archivedProducts}
        namesets={namesets}
        archivedNamesets={archivedNamesets}
        teams={teams}
        archivedTeams={archivedTeams}
      />
    </div>
  );
};

export default ProductsPage;
