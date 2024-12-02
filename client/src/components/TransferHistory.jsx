import React from "react";
import { ethers } from "ethers";

function TransferHistory({ accounts, history, deleteItem, formatAddress }) {
  const [isModal, setModal] = React.useState(false);
  const [selectHistory, setSelectHistory] = React.useState("");

  const openModal = (acc) => {
    setSelectHistory(acc);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setSelectHistory("");
  };

  const filteredHistory = history.filter((item) => item.to === selectHistory);

  return (
    <>
    <h3>Select Account to view History</h3>
    <div className="transfer-history">
      
      {accounts.map((acc, index) => (
        <div key={index} style={{margin:"10px"}}>
          <button className = "token-button" onClick={() => openModal(acc)}>{formatAddress(acc)}</button>
        </div>
      ))}

      {isModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Transaction History for {formatAddress(selectHistory)}</h3>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => (
                <div key={index} className="transaction-item">
                  <p>
                    <b>Recipient:</b> {item.to}
                  </p>
                  <p>
                    <b>Amount: </b>
                    {ethers.formatUnits(item.value, 18)} MTK
                  </p>
                  <p>
                    <b>Date:</b> {item.timestamp}
                  </p>
                  <button onClick={() => deleteItem(item)}>Delete</button>
                </div>
              ))
            ) : (
              <p>No transactions found for this account.</p>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default TransferHistory;
