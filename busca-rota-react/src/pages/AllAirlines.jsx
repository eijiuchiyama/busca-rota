import React from 'react';
import BackToMenuButton from '../components/BackToMenuButton';

function AllAirlines() {
  return (
    <div>
      <BackToMenuButton />
      <h1>All Airlines</h1>
      <p>Here you can find a list of all airlines.</p>
      {/* Additional content such as a list of airlines can be added here */}
    </div>
  );
}

export default AllAirlines;