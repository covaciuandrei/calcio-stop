import React from 'react';
import AddNewNamesetCard from './AddNewNamesetCard';
import ArchivedNamesetsCard from './ArchivedNamesetsCard';
import NamesetsTableListCard from './NamesetsTableListCard';

const NamesetsPage: React.FC = () => {
  return (
    <div>
      {/* Add New Nameset Card */}
      <AddNewNamesetCard />

      {/* Namesets Table List Card */}
      <NamesetsTableListCard />

      {/* Archived Namesets Card */}
      <ArchivedNamesetsCard />
    </div>
  );
};

export default NamesetsPage;
