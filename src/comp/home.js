import React, { useState, useRef } from 'react';
import Slider from "react-slick";
import PieChart from './chart';
import LineChart from './lineChart';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'chart.js/auto';
import './home.css';

function Home(props) {
    const [slideCharts, setSlideCharts] = useState(false);
    const [isFetched, setIsfetched] = useState(0);
    const [scoreArr, setArr] = useState([]);
    const [dates, setDates] = useState([]);
    const [scores, setscores] = useState([]);

    const lineChartData = dates.map((date, index) => {
      return { x: date, y: scores[index] };
    });
  
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    function init() {
        if (isFetched === 0) {
            fetch1();
        }
    }
    function fetch1() {
        setIsfetched(1)
        fetch('/get_reciepts_score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "name": props.name })
        })
            .then(response => response.json())
            .then(data => {
                console.log("exe")
                setArr(data.score);
                setDates(data.date);
                setscores(data.score);
                console.log("Rec_array" + data.score);

                //console.log(data.recipt)
                // Handle the response from the server
            })

            .catch(error => {
                console.error('Error:', error);
            });
    }
    init();
    // console.log("array -> "+rec_array)
    console.log("counts -> " + scoreArr);
    return (
      <div className="home-container">
      {/* {props.name} */}
      <Slider {...settings}>
        <div>
        <a>Linechart</a>
        <LineChart dates={dates} scores={scores} />
        </div>
        <div>
        <a>Doughutchart</a>
          <PieChart value1={scoreArr[0]} value2={scoreArr[1]} value3={scoreArr[2]} />
        </div>
      </Slider>
      {/* <button className="refresh-button" onClick = {() => setIsfetched(0)}>Refresh</button> */}
    </div>
    );
}
export default Home;
