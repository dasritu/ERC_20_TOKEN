import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './Dashboard.css'; 

function Dashboard({ accounts, history, readContract, connectedAcc }) {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [balance, setBalance] = useState(null);
  const [total, setTotal] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false); 

  useEffect(() => {
    if (accounts.length > 0) {
      setSelectedAccount(accounts[0]);
      checkBalance(accounts[0]); 
    }
  }, [accounts, readContract]); 

  const checkBalance = async (address) => {
    if (!readContract) {
      console.log("Contract not initialized");
      return;
    }
    if (!address) {
      console.log("Address not valid");
      return;
    }
    try {
      setLoadingBalance(true);
      const totalSupply = await readContract.balanceOf(address);
      const formattedBalance = ethers.formatUnits(totalSupply, 18);
      setBalance(formattedBalance);
      setLoadingBalance(false); 
    } catch (error) {
      console.log("Error fetching data", error);
      alert("Failed to fetch");
      setBalance("Error");
      setLoadingBalance(false); 
    }
  };

  const totalBalance = async () => {
    try {
      const total = await history.reduce((acc, tx) => {
        return acc + parseFloat(ethers.formatUnits(tx.value, 18));
      }, 0);
      return total;
    } catch (error) {
      console.log("Error calculating total balance:", error);
    }
  };

  useEffect(() => {
    const fetchTotalBalance = async () => {
      const tBalance = await totalBalance();
      setTotal(tBalance);
    };
    fetchTotalBalance();
  }, [history]);

  useEffect(() => {
    if (selectedAccount) {
      checkBalance(selectedAccount); 
    }
  }, [selectedAccount]);

  return (
    <div className="dashboard-container">
      <h2 className="title">Dashboard</h2>
      <p className="info">
        <strong>Connected Account:</strong> {connectedAcc || "Not connected"}
      </p>
      <p className="info">
        <strong>Total Accounts:</strong> {accounts.length}
      </p>
      <p className="info">
        <strong>Total Transfers:</strong> {history.length}
      </p>
      <p className="info">
        <strong>Total Amount of Token Transfer:</strong> {total ? total : 0} MTK
      </p>

      <div className="select-account">
        <label>Select Account To Check Balance</label>
        <select
          className="account-dropdown"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
        >
          {accounts.map((acc, index) => (
            <option key={index} value={acc}>
              {acc.slice(0, 6)}...{acc.slice(-4)}
            </option>
          ))}
        </select>
      </div>

      <div className="balance-container">
        <p>
          {loadingBalance ? (
            <span>Loading...</span> 
          ) : (
            balance && <h4 className="balance"><strong>Balance:</strong> {balance} MTK</h4>
          )}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
