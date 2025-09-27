import React from 'react';
import { Nameset } from '../../types';
import AddNewNamesetCard from './AddNewNamesetCard';
import ArchivedNamesetsCard from './ArchivedNamesetsCard';
import NamesetsTableListCard from './NamesetsTableListCard';

interface Props {
  namesets: Nameset[];
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
}

const NamesetsPage: React.FC<Props> = ({ namesets, setNamesets, archivedNamesets, setArchivedNamesets }) => {
  return (
    <div>
      {/* Add New Nameset Card */}
      <AddNewNamesetCard namesets={namesets} setNamesets={setNamesets} />

      {/* Namesets Table List Card */}
      <NamesetsTableListCard
        namesets={namesets}
        setNamesets={setNamesets}
        archivedNamesets={archivedNamesets}
        setArchivedNamesets={setArchivedNamesets}
      />

      {/* Archived Namesets Card */}
      <ArchivedNamesetsCard
        namesets={namesets}
        setNamesets={setNamesets}
        archivedNamesets={archivedNamesets}
        setArchivedNamesets={setArchivedNamesets}
      />
    </div>
  );
};

export default NamesetsPage;
