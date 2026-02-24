import React, { useState } from 'react';
import BalanceCardImage from '../../../../assets/BalanceCard.svg';
import { getStoredUserProfile } from "../../../../utility/session";

const BalanceCard = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false); // Initially hidden
  const profile = getStoredUserProfile() || { wallet_amount: "0" };
  const walletAmount = Number(profile.wallet_amount || 0);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <>
      <div className="px-6 py-3 flex flex-row justify-between">
        <p className="font-poppins text-[#6C6060] text-[14px]">Available Balance</p>
        <img src={BalanceCardImage} alt="Image not found" />
      </div>
      <div className="px-6 py-4" onClick={toggleBalanceVisibility} style={{ cursor: 'pointer' }}>
        <p className="font-poppins font-bold text-[#6C6060] text-[28px]">
          {isBalanceVisible ? `PKR ${walletAmount.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}` : '****'}
        </p>
        <p className="font-poppins text-[#6C6060] text-[12px]">{isBalanceVisible ? 'Tap to hide balance' : 'Tap to show balance'}</p>
      </div>
    </>
  );
};

export default BalanceCard;
