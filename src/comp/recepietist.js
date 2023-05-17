import React, { useState } from 'react';
import Subheading from './subheading';

function ReceiptList(props) {
  const [rec_array, setArr] = useState(props.rec_array);

  const deleteBill = (bill) => {
    fetch('/delete_bill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "rec_name": bill })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setArr(data.bills)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  return (
    <div className="receipt-container">
      <Subheading title="Attached receipts" description="Files that have been attached" />
      <div className="grid-header">
        <p className="file-name">File name</p>
        <p className="date-uploaded">Date uploaded</p>
      </div>
      <div className="chld_cnt2">
        {rec_array.map((bills, index) => (
          <div key={index} className="receipt">
            <p onClick={() => props.getLineitems(bills[0])} className="btn">
              {bills[0]} -- {bills[1]}
            </p>
            <p onClick={() => deleteBill(bills[0])} className="btn1">
              Delete
            </p>
          </div>
        ))}
      </div>
      <button onClick={() => props.setIsfetched(0)}>Refresh</button>
    </div>
  );
}

export default ReceiptList;
