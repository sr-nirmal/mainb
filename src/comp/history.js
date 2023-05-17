import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import PieChart from './chart';
import "./receipt.css";
import "./history.css";
import 'chart.js/auto';
import Subheading from './subheading';
import Label from './Label';

function History(props) {

    const [name, setName] = useState(props.name)
    console.log(name)
    const [rec_array, setArr] = useState([])
    const [line_item, setLineitem] = useState([])
    //const [rec_array, setArr]= useState(['name_01_1', 'name_01_3'])
    //const [line_item, setLineitem]= useState(['Mineral Water', 'Egg Fried Rice', '9 Manchunanle', 'Masala Kulcha', 'Chicken Kadhai', 'Minit Mojito', 'Spicy Mexican', 'Large Thin Crust Chicken', 'Shawarma', 'JUICE AUGG Health', 'Your First Stop'])
    const [currentBill, setCurrentbill] = useState(props.name)
    const [currentState, setCurrentState] = useState(0)
    // const [selectedFileList, setSelectedFileList] = useState(props.name);
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

        setIsfetched(1);
        fetch('/get_reciepts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "name": name })
        })
            .then(response => response.json())
            .then(data => {
                console.log("hello");

                setArr(data.recipt);
                console.log(rec_array);
                //console.log(data.recipt)
                // Handle the response from the server
            })

            .catch(error => {
                console.error('Error:', error);
            });
    }
    const getLineitems = (bill) => {
        //function getLineitems(){  
        setCurrentState(1)
        //e.preventDefault();
        if (bill === currentBill) {
            console.log("in sync");
        }
        else {


            console.log("Bill -> " + bill)
            setCurrentbill(bill)
            console.log("line_items")
            console.log("currentBill" + currentBill)
            setLineitem([])
            fetch('/get_lineitems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "rec_name": bill ,'name': props.name})
            })
                .then(response => response.json())
                .then(data => {
                    console.log("hello line_item " + bill);


                    setLineitem(data.line_items);
                    console.log(line_item)

                    //console.log(data.recipt)
                    // Handle the response from the server
                })

                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }
    const deleteBill = (bill) => {
        //function getLineitems(){  
        //e.preventDefault(
        fetch('/delete_bill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "rec_name": bill, "name": props.name })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.response)
                setArr(data.response);
                console.log(rec_array);

                //setLineitem(data.response[1]);

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
            body: JSON.stringify({ "rec_name": bill,'name':props.name })
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
    console.log(currentBill)

    const togglePopup = (text) => {
        setReasonText(text);
        setShowPopup(!showPopup);
    };
    useEffect(() => {
        init();
    }, []);

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
            {currentState === 1 && (
                <div className='scroll-receipt'>
                    <Subheading title="Receipt" description="Line items of the recepit" />
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
                                    <p className="su" > Non-Sustainable</p>
                                )

                                }
                                {line[1] <= 7 && line[1] > 3 && (
                                    <p className="sus" > Moderately-sustainable</p>
                                )

                                }
                                {line[1] > 7 && (
                                    <p className="sustainable" > Sustainable</p>
                                )}
                                < p onClick={() => togglePopup(line[2])} className="reason">reason</p>
                            </div>
                        ))}
                        {/* <PieChart value1={counts.no} value2={counts.moderate} value3={counts.yes} /> */}

                    </div>
                    <button onClick={() => setCurrentState(0)} className='back'>Back</button>
                </div>
            )
            }
            {
                showPopup && (
                    <div className="popup">
                        <h4 className='pop-title'>Reason</h4>
                        <p className="pop-content">{reasonText}</p>
                        <button className='pop-close' onClick={togglePopup}>X</button>
                    </div>
                )
            }
            {
                chartPopup !== null && (
                    <div className="popup">
                        <PieChart className='pop-content' value1={chartPopup[0]} value2={chartPopup[1]} value3={chartPopup[2]} />
                        <button className='pop-close' onClick={() => setChartpopup(null)}>X</button>
                    </div>
                )
            }
            {
                currentState === 0 && (
                    <div className='scroll-receipt'>
                        <Subheading title="Attached receipts" description="Files that have been attached" />
                        <Label file_name="File name" sustcolor="Sustainablility" score="Score" date="Date uploaded" />
                        <div className="chld_cnt2 scrolls">
                            {rec_array.map((bills, index) => (
                                <div key={index} className="receipt">
                                    <div className='btn receipt-file-container'>
                                        <a className='receipt-name' onClick={() => getLineitems(bills[0])}> {bills[0]}</a>
                                        <a className='receipt-size'>20</a>
                                    </div>
                                    {/* <p className="btn"></p> */}

                                    <p onClick={() => lineItemScore(bills[0])} className='btn'>
                                        {bills[1]}
                                    </p>
                                    <p className="date">
                                        {bills[2]}
                                    </p>
                                    {bills[1] <= 3 && (
                                        <p className="su" onClick={() => lineItemScore(bills[0])} > Non-Sustainable</p>
                                    )

                                    }
                                    {bills[1] <= 7 && bills[1] > 3 && (
                                        <p className="sus" onClick={() => lineItemScore(bills[0])} > Moderately-sustainable</p>
                                    )

                                    }
                                    {bills[1] > 7 && (
                                        <p className="sustainable" onClick={() => lineItemScore(bills[0])}> Sustainable</p>
                                    )

                                    }
                                    {/* <button onClick ={() => lineItemScore(bills[0])}>G</button> */}
                                    <p onClick={() => deleteBill(bills[0])} className="btn1">
                                        Delete
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
            {/* <button onClick={() => setIsfetched(0)}>Refresh</button> */}
        </div >

    );

}

export default History; 
