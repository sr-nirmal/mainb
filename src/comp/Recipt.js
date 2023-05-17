import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import PieChart from './chart';
import "./receipt.css"
import './history.css'
import 'chart.js/auto';
import Subheading from './subheading';
import Label from './Label';

function Receipt(props) {

    const [name, setName] = useState(props.name)
    console.log(name)
    const [rec_array, setArr] = useState([])
    const [line_item, setLineitem] = useState([])
    //const [rec_array, setArr]= useState(['name_01_1', 'name_01_3'])
    //const [line_item, setLineitem]= useState(['Mineral Water', 'Egg Fried Rice', '9 Manchunanle', 'Masala Kulcha', 'Chicken Kadhai', 'Minit Mojito', 'Spicy Mexican', 'Large Thin Crust Chicken', 'Shawarma', 'JUICE AUGG Health', 'Your First Stop'])
    const [currentBill, setCurrentbill] = useState(props.name)
    const [currentState, setCurrentState] = useState(0)
    const [showPopup, setShowPopup] = useState(false);
    const [chartPopup, setChartpopup] = useState(null);
    const [reasonText, setReasonText] = useState('');
    const [isFetched, setIsfetched] = useState(0);
    function init() {
        if (isFetched === 0) {
            get_bills();

        }
    }
    const [counts, setCounts] = useState({ no: 0, moderate: 0, yes: 0 });
    useEffect(() => {
        console.log(rec_array);
    }, [rec_array]);

    function get_bills() {


        fetch('/get_reciepts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "name": props.name })
        })
            .then(response => response.json())
            .then(data => {
                console.log("hello");

                setArr(data.recipt);
                console.log(rec_array);
                setIsfetched(1)
                //console.log(data.recipt)
                // Handle the response from the server
            })

            .catch(error => {
                console.error('Error:', error);
            });
    }
    const lineItemScore = (bill) => {
        fetch('/get_lineitems_score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "rec_name": bill,'name':name })
        })
            .then(response => response.json())
            .then(data => {
                console.log("hello line_item " + bill);


                setChartpopup(data.score);
                console.log(chartPopup);

                //console.log(data.recipt)
                // Handle the response from the server
            })

            .catch(error => {
                console.error('Error:', error);
            });
    }
    
    const getLineitems = (bill) => {
        setCurrentbill(bill);
        console.log("currentBill" + currentBill)
        setLineitem([])
        fetch('/get_lineitems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "rec_name": bill, "name":name })
        })
        .then(response => response.json())
        .then(data => {
            console.log("hello line_item " + bill);
            setLineitem(data.line_items);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    


    const togglePopup = (text) => {
        setReasonText(text);
        setShowPopup(!showPopup);
    };
    useEffect(() => {
        init();
    }, []);
    const handleOptionChange = (event) => {

        setCurrentbill(event.target.value);
        console.log("currentBill => " + currentBill);
        getLineitems();

    };
    init();
    return (
        <div className="receipt-container">

            {/* <Subheading title="Attached receipts" description="Files that have been attached" /> */}
            {/* {currentState === 0 && (
                <div>

                </div>
            )}
            {currentState === 1 && (
                <div>
                </div>

            )} */}
            {/* <option value="">Select a file</option>     */}


            {currentBill !== "" && (
                <div className='scroll-receipt'>
                    <Subheading title="Receipt" description="Line items of the recepit" />
                    <div className='select-option'>
                        {/* <label for="options">Select an option:</label> */}
                        <select id="options" value={currentBill} onChange={(event) => getLineitems(event.target.value)}>
                            {rec_array.map((bills) => (
                                <option className='bill-sector' key={bills[0]} value={bills[0]}>
                                    {bills[0]}
                                </option>
                            ))}
                        </select>

                    </div>
                    <Label file_name="File name" score="Score" sustcolor="Sustainability" />

                    <div className="chld_cnt1 scrolls">
                        {console.log(line_item)}
                        {line_item.map((line, index) => (
                            <div key={index} className="line-item-container">
                                <p className='line-item'>
                                    {line[0]}
                                </p>
                                <p className='sustainability-score'>
                                    {line[1]}
                                </p>

                                {line[1] <= 3 && (
                                    <p className="su" onClick={() => lineItemScore(line[0])} style={{ color: 'rgb(255, 0, 0)' }}> Non-Sustainable</p>
                                )}
                                {line[1] <= 7 && line[1] > 3 && (
                                    <p className="sus" onClick={() => lineItemScore(line[0])}> Moderately-sustainable</p>
                                )}
                                {line[1] > 7 && (
                                    <p className="sustainable" onClick={() => lineItemScore(line[0])}> Sustainable</p>
                                )}
                                <p onClick={() => togglePopup(line[2])} className="reason">reason</p>
                            </div>
                        ))}
                        {/* <PieChart value1={counts.no} value2={counts.moderate} value3={counts.yes} /> */}
                        {/* <button onClick={() => setCurrentState(0)}>Back</button> */}
                    </div>
                </div>
            )
            }

            {
                showPopup && (
                    <div className="reason-popup">
                        <h4 className='reason-pop-title'>Reason</h4>
                        <p className="reason-pop-content">{reasonText}</p>
                        <button className='reason-pop-close' onClick={togglePopup}>X</button>
                    </div>
                )
            }


            {/* <button onClick={() => setIsfetched(0)}>Refresh</button> */}
        </div >

    );

}

export default Receipt; 
