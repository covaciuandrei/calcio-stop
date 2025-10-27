import React from 'react';
import AddNewNamesetCard from './AddNewNamesetCard';
import ArchivedNamesetsCard from './ArchivedNamesetsCard';
import NamesetsTableListCard from './NamesetsTableListCard';
import SoldOutNamesetsCard from './SoldOutNamesetsCard';

const NamesetsPage: React.FC = () => {
  return (
    <div>
      {/* Add New Nameset Card */}
      <AddNewNamesetCard />

      {/* Namesets Table List Card */}
      <NamesetsTableListCard />

      {/* Sold Out Namesets Card */}
      <SoldOutNamesetsCard />

      {/* Archived Namesets Card */}
      <ArchivedNamesetsCard />
    </div>
  );
};

export default NamesetsPage;
