import React from 'react';

const Objection = ({booking}) => {
  if (!booking) {
    return null; // or a loader or placeholder
  }

  const {
    partner_remarks
  } = booking;


  return (
    <div className="">
    </div>
  );
};

export default Objection;
