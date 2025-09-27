import React from 'react';
import { Badge } from '../types/types';
import AddBadgeForm from './AddBadgeForm';

interface Props {
  badges: Badge[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
}

const AddNewBadgeCard: React.FC<Props> = ({ badges, setBadges }) => {
  return (
    <div className="card">
      <div className="card-header mini-header mini-header-green">
        <span>Add New Badge</span>
      </div>
      <div className="card-content">
        <AddBadgeForm badges={badges} setBadges={setBadges} />
      </div>
    </div>
  );
};

export default AddNewBadgeCard;
