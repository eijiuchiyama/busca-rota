import React from 'react';
import BackToMenuButton from '../components/BackToMenuButton';

function AllAirports() {
  return (
    <div>
      <BackToMenuButton />
      <h1>All Airports</h1>
      <p>List of all airports will be displayed here.</p>
      {/* You can add a component to fetch and display the airports data */}
    </div>
  );
}

export default AllAirports;