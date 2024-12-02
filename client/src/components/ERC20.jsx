import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import TransferHistory from "./TransferHistory";
import Dashboard from "./Dashboard";
import "../token.css";
import { ethers } from "ethers";

const { abi } = require("../MyToken.json");

function ERC20() {
  const [selectTransferAddress, setSelectTransferAddress] = useState("");
  const [readContract, setReadContract] = useState(null);
  const [writeContract, setWriteContract] = useState(null);
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [connectedAcc, setConnectedAcc] = useState("");
  const [connectedAccBalance, setConnectedBalance] = useState("");

  const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  useEffect(() => {
    const initContract = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accountsList = await provider.send("eth_requestAccounts", []);
          setAccounts(accountsList);

          setSelectTransferAddress(accountsList[1]);
          setConnectedAcc(accountsList[0]);

          const signer = await provider.getSigner();

          const readOnlyContract = new ethers.Contract(
            ContractAddress,
            abi,
            provider
          );
          setReadContract(readOnlyContract);

          const writeOnlyContract = new ethers.Contract(
            ContractAddress,
            abi,
            signer
          );
          setWriteContract(writeOnlyContract);
        } catch (error) {
          console.error("Error initializing contract:", error);
        }
      } else {
        alert("Please install MetaMask to interact with this app.");
      }
    };

    initContract();

    const savedHistory = JSON.parse(localStorage.getItem("TransactionHistory"));
    if (savedHistory) {
      setHistory(savedHistory);
    }
  }, []);

  useEffect(() => {
    const getConnectedBalance = async () => {
      if (readContract && connectedAcc) {
        try {
          const connectedBalance = await readContract.balanceOf(connectedAcc);
          setConnectedBalance(ethers.formatUnits(connectedBalance, 18));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    getConnectedBalance();
  }, [readContract, connectedAcc]);

  const transferToken = async () => {
    if (!writeContract) {
      alert("Contract not initialized");
      return;
    }
    try {
      const amountInUnits = ethers.parseUnits(amount, 18);
      const gasLimit = await writeContract.transfer.estimateGas(
        selectTransferAddress,
        amountInUnits
      );

      const tx = await writeContract.transfer(
        selectTransferAddress,
        amountInUnits,
        {
          gasLimit,
        }
      );
      await tx.wait();
      alert("Transfer successful!");

      const newTransaction = {
        to: selectTransferAddress,
        value: amountInUnits.toString(),
        timestamp: new Date().toLocaleString(),
      };

      const updatedHistory = [...history, newTransaction];
      setHistory(updatedHistory);
      localStorage.setItem("TransactionHistory", JSON.stringify(updatedHistory));
      setAmount("");

      const connectedBalance = await readContract.balanceOf(connectedAcc);
      setConnectedBalance(ethers.formatUnits(connectedBalance, 18));
    } catch (error) {
      console.error("Error transferring tokens:", error);
      alert("Transfer failed. Please check the console for details.");
    }
  };

  const deleteItem = (item) => {
    const confirmDelete = window.confirm(
      "Do you want to delete this transaction?"
    );
    if (confirmDelete) {
      const newHistory = history.filter(
        (historyItem) => historyItem.timestamp !== item.timestamp
      );
      setHistory(newHistory);
      localStorage.setItem("TransactionHistory", JSON.stringify(newHistory));
    }
  };

  const formatAddress = (addr) => `${addr.slice(0, 4)}....${addr.slice(-4)}`;

  return (
    <div className="main-container">
      <p className="connected-account">
        Connected Account: {connectedAcc || "Not connected"} | Balance:
        {connectedAccBalance || ""}
      </p>

      <Routes>
        <Route
          path="/dashboard"
          element={
            <Dashboard
              accounts={accounts}
              history={history}
              readContract={readContract}
              connectedAcc={connectedAcc}
            />
          }
        />
        <Route
          path="/erc20transfer"
          element={
            <div className="transfer-container">
              <div className="transfer">
                <h4>Transfer Token</h4>
                <div className="input">
                  <label>Select Recipient Account</label>
                  <select
                    value={selectTransferAddress}
                    onChange={(e) => setSelectTransferAddress(e.target.value)}
                  >
                    {accounts.map((acc, index) => (
                      <option key={index} value={acc}>
                        {formatAddress(acc)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input">
                  <label>Amount</label>
                  <input
                    type="text"
                    value={amount}
                    className="token-input"
                    placeholder="Enter Amount"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <button className="token-button" onClick={transferToken}>Transfer</button>
              </div>
            </div>
          }
        />
        <Route
          path="/transferhistory"
          element={
            <TransferHistory
              accounts={accounts}
              history={history}
              deleteItem={deleteItem}
              formatAddress={formatAddress}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default ERC20;
