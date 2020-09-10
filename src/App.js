import React, { Component, useState } from 'react';
import './App.css';
import Papa from 'papaparse';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ReactDOM from 'react-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Col, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Chart from 'chart.js';
import Carousel from 'react-bootstrap/Carousel';
import covidOne from './covid1.jpg';
import covidTwo from './covid2.png';
import covidThree from './covid3.png';
import { ComposableMap, ZoomableGroup, Geographies, Geography, Markers, Marker } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { geoAlbersUsa } from 'd3-geo';
import ReactTooltip from 'react-tooltip';

const US_TOPO_JSON = require('./us-states.json');

const PROJECTION_CONFIG = {
  scale: 350,
  center: [38.093881, -102.698245]
};

// Red Variants
const COLOR_RANGE = [
  '#a4de02',
  '#ffc72c',
  '#ff6900',
  '#782618'
];

const DEFAULT_COLOR = '#EEE';

const getRandomInt = () => {
  return parseInt(Math.random() * 100);
};

const geographyStyle = {
  default: {
    outline: 'none'
  },
  hover: {
    fill: '#ccc',
    transition: 'all 250ms',
    outline: 'none'
  },
  pressed: {
    outline: 'none'
  }
};

// will generate random heatmap data on every call
const getHeatMapData = (getDataOfTheDay) => {
  if(getDataOfTheDay != null){
    console.log("entro");
    console.log(getDataOfTheDay[0][3]);
    return [
      { id: '01', state: 'Alabama', stateCases: getDataOfTheDay[0][3] },
      { id: '02', state: 'Alaska', stateCases: getDataOfTheDay[1][3] },
      { id: '04', state: 'Arizona', stateCases: getDataOfTheDay[2][3]},
      { id: '05', state: 'Arkansas', stateCases: getDataOfTheDay[3][3] },
      { id: '06', state: 'California', stateCases: getDataOfTheDay[4][3] },
      { id: '08', state: 'Colorado', stateCases: getDataOfTheDay[5][3] },
      { id: '09', state: 'Connecticut', stateCases: getDataOfTheDay[6][3] },
      { id: '10', state: 'Delaware', stateCases: getDataOfTheDay[7][3] },
      { id: '11', state: 'District of Columbia', stateCases: getDataOfTheDay[8][3] },
      { id: '12', state: 'Florida', stateCases: getDataOfTheDay[9][3] },
      { id: '13', state: 'Georgia', stateCases: getDataOfTheDay[10][3] },
      //{ id: '14', state: 'Guam', stateCases: getRandomInt() },
      { id: '15', state: 'Hawaii', stateCases: getDataOfTheDay[11][3] },
      { id: '16', state: 'Idaho', stateCases: getDataOfTheDay[12][3] },
      { id: '17', state: 'Illinois', stateCases: getDataOfTheDay[13][3] },
      { id: '18', state: 'Indiana', stateCases: getDataOfTheDay[14][3] },
      { id: '19', state: 'Iowa', stateCases: getRandomInt() },
      { id: '20', state: 'Kansas', stateCases: 59 },
      { id: '21', state: 'Kentucky', stateCases: 59 },
      { id: '22', state: 'Louisiana', stateCases: getRandomInt() },
      { id: '23', state: 'Maine', stateCases: getRandomInt() },
      { id: '24', state: 'Maryland', stateCases: getRandomInt() },
      { id: '25', state: 'Massachussetts', stateCases: getRandomInt() },
      { id: '26', state: 'Michigan', stateCases: getRandomInt() },
      { id: '27', state: 'Minnesota', stateCases: 14 },
      { id: '28', state: 'Mississippi', stateCases: getRandomInt() },
      { id: '29', state: 'Missouri', stateCases: 15 },
      { id: '30', state: 'Montana', stateCases: 17 },
      { id: '31', state: 'Nebraska', stateCases: 17 },
      { id: '32', state: 'Nevada', stateCases: getDataOfTheDay[32][3] },
      { id: '33', state: 'New Hampshire', stateCases: getRandomInt() },
      { id: '34', state: 'New Jersey', stateCases: 19 },
      { id: '35', state: 'New Mexico', stateCases: 20 },
      { id: '36', state: 'New York', stateCases: 59 },
      { id: '37', state: 'North Carolina', stateCases: 25 },
      { id: '38', state: 'North Dakota', stateCases: getRandomInt() },
      //{ id: '39', state: 'Northern Mariana Islands', stateCases: getRandomInt() },
      { id: '39', state: 'Ohio', stateCases: getRandomInt() },
      { id: '40', state: 'Oklahoma', stateCases: getRandomInt() },
      { id: '41', state: 'Oregon', stateCases: getRandomInt() },
      { id: '42', state: 'Pennsylvania', stateCases: getRandomInt() },
      //{ id: '43', state: 'Puerto Rico', stateCases: getRandomInt() },
      { id: '44', state: 'Rhode Island', stateCases: getRandomInt() },
      { id: '45', state: 'South Carolina', stateCases: getRandomInt() },
      { id: '46', state: 'South Dakota', stateCases: getRandomInt() },
      { id: '47', state: 'Tennessee', stateCases: getRandomInt() },
      { id: '48', state: 'Texas', stateCases: getRandomInt() },
      { id: '49', state: 'Utah', stateCases: getRandomInt() },
      { id: '50', state: 'Vermont', stateCases: getRandomInt() },
      //{ id: '51', state: 'United States Virgin Islands', stateCases: getRandomInt() },
      { id: '51', state: 'Virginia', stateCases: getRandomInt() },
      { id: '53', state: 'Washington', stateCases: getRandomInt() },
      { id: '54', state: 'West Virginia', stateCases: getRandomInt() },
      { id: '55', state: 'Wisconsin', stateCases: getRandomInt() },
      { id: '56', state: 'Wyoming', stateCases: getRandomInt() }
    ];
  } 
  else{
    return [
      { id: '01', state: 'Alabama', stateCases: 8 },
      { id: '02', state: 'Alaska', stateCases: getRandomInt() },
      { id: '04', state: 'Arizona', stateCases: getRandomInt() },
      { id: '05', state: 'Arkansas', stateCases: getRandomInt() },
      { id: '06', state: 'California', stateCases: getRandomInt() },
      { id: '08', state: 'Colorado', stateCases: 21 },
      { id: '09', state: 'Connecticut', stateCases: 22 },
      { id: '10', state: 'Delaware', stateCases: getRandomInt() },
      { id: '11', state: 'District of Columbia', stateCases: 24 },
      { id: '12', state: 'Florida', stateCases: 26 },
      { id: '13', state: 'Georgia', stateCases: 27 },
      //{ id: '14', state: 'Guam', stateCases: getRandomInt() },
      { id: '15', state: 'Hawaii', stateCases: getRandomInt() },
      { id: '16', state: 'Idaho', stateCases: getRandomInt() },
      { id: '17', state: 'Illinois', stateCases: getRandomInt() },
      { id: '18', state: 'Indiana', stateCases: 59 },
      { id: '19', state: 'Iowa', stateCases: getRandomInt() },
      { id: '20', state: 'Kansas', stateCases: 59 },
      { id: '21', state: 'Kentucky', stateCases: 59 },
      { id: '22', state: 'Louisiana', stateCases: getRandomInt() },
      { id: '23', state: 'Maine', stateCases: getRandomInt() },
      { id: '24', state: 'Maryland', stateCases: getRandomInt() },
      { id: '25', state: 'Massachussetts', stateCases: getRandomInt() },
      { id: '26', state: 'Michigan', stateCases: getRandomInt() },
      { id: '27', state: 'Minnesota', stateCases: 14 },
      { id: '28', state: 'Mississippi', stateCases: getRandomInt() },
      { id: '29', state: 'Missouri', stateCases: 15 },
      { id: '30', state: 'Montana', stateCases: 17 },
      { id: '31', state: 'Nebraska', stateCases: 17 },
      { id: '32', state: 'Nevada', stateCases: getRandomInt() },
      { id: '33', state: 'New Hampshire', stateCases: getRandomInt() },
      { id: '34', state: 'New Jersey', stateCases: 19 },
      { id: '35', state: 'New Mexico', stateCases: 20 },
      { id: '36', state: 'New York', stateCases: 59 },
      { id: '37', state: 'North Carolina', stateCases: 25 },
      { id: '38', state: 'North Dakota', stateCases: getRandomInt() },
      //{ id: '39', state: 'Northern Mariana Islands', stateCases: getRandomInt() },
      { id: '39', state: 'Ohio', stateCases: getRandomInt() },
      { id: '40', state: 'Oklahoma', stateCases: getRandomInt() },
      { id: '41', state: 'Oregon', stateCases: getRandomInt() },
      { id: '42', state: 'Pennsylvania', stateCases: getRandomInt() },
      //{ id: '43', state: 'Puerto Rico', stateCases: getRandomInt() },
      { id: '44', state: 'Rhode Island', stateCases: getRandomInt() },
      { id: '45', state: 'South Carolina', stateCases: getRandomInt() },
      { id: '46', state: 'South Dakota', stateCases: getRandomInt() },
      { id: '47', state: 'Tennessee', stateCases: getRandomInt() },
      { id: '48', state: 'Texas', stateCases: getRandomInt() },
      { id: '49', state: 'Utah', stateCases: getRandomInt() },
      { id: '50', state: 'Vermont', stateCases: getRandomInt() },
      //{ id: '51', state: 'United States Virgin Islands', stateCases: getRandomInt() },
      { id: '51', state: 'Virginia', stateCases: getRandomInt() },
      { id: '53', state: 'Washington', stateCases: getRandomInt() },
      { id: '54', state: 'West Virginia', stateCases: getRandomInt() },
      { id: '55', state: 'Wisconsin', stateCases: getRandomInt() },
      { id: '56', state: 'Wyoming', stateCases: getRandomInt() }
    ];
  }
};

const file = require('./usstates.csv');
var statesList = [];
states();

function states() {
  var justStates = [];
  var confirmedCases = [];
  var confirmedDeaths = [];
  var completeData = [];
  Papa.parse(file, {
    download: true,
    step: result => {
      if (result.data[0] === '2020-08-22') {
        justStates.push(result.data[1]);
          confirmedCases.push(parseInt(result.data[3]));
          confirmedDeaths.push(parseInt(result.data[4]));
      }
      if (result.data[0] !== "date") {
        completeData.push(result.data);
      }
      
    },
    complete: result => {
      postReceive(justStates, confirmedCases, confirmedDeaths, completeData);
    }
  });
}

function makeRandomColor() {
  var c = '';
  while (c.length < 6) {
    c += (Math.random()).toString(16).substr(-6).substr(-1)
  }
  return '#' + c;
}

function createDropdownComponent(statesList, sumCases, sumDeaths, sortByCases, sortByState) {
  var element = (
    <DropdownButton as={ButtonGroup} key={'states'} id={`statesButton`} variant={'danger'} title={'Select a state'}>
      <Dropdown.Item eventKey="allStates">All States</Dropdown.Item>
      {Object.entries(statesList).map(([key, value], i) => (
        <Dropdown.Item eventKey={key} onClick={() => handleEvent(key, sumCases, sumDeaths, sortByCases, sortByState)}>{value}</Dropdown.Item>
      ))}
    </DropdownButton>
  );
  return element;
}

function handleEvent(key, sumCases, sumDeaths, sortByCases, sortByState) {
  createCardConfirmedCases(sortByState[parseInt(key)].cases);
  createCardConfirmedDeaths(sortByState[parseInt(key)].deaths);
  createCasesAndDeathsTable(sortByState[parseInt(key)]);
}

function createCardConfirmedCases(sumCases) {
  var cardConfirmedCases = (
    <Card bg={'warning'} style={{ width: '10rem' }}>
      <Card.Header style={{ fontSize: "14px" }}> Confirmed Cases </Card.Header>
      <Card.Body>
        <Card.Title> {sumCases} </Card.Title>
      </Card.Body>
    </Card>
  );
  ReactDOM.render(cardConfirmedCases, document.getElementById("cardConfirmedCases"));
}

function createCardConfirmedDeaths(sumDeaths) {
  var cardConfirmedDeaths = (
    <Card bg={'danger'} style={{ width: '10rem' }}>
      <Card.Header style={{ fontSize: "14px", color: "white" }}> Confirmed Deaths </Card.Header>
      <Card.Body>
        <Card.Title style={{ color: "white" }}> {sumDeaths} </Card.Title>
      </Card.Body>
    </Card>
  );
  ReactDOM.render(cardConfirmedDeaths, document.getElementById("cardConfirmedDeaths"));
}

function createCasesAndDeathsTable(sortByCases) {
  if (sortByCases.length > 1) {
    var casesAndDeathsTable = (
      <div>
        {sortByCases.map((value) => (
          <ListGroup>
            <ListGroup.Item variant="dark">{value.state}</ListGroup.Item>
            <ListGroup.Item variant="warning">Confirmed: {value.cases} </ListGroup.Item>
            <ListGroup.Item variant="danger">Deaths: {value.deaths} </ListGroup.Item>
          </ListGroup>
        ))}
      </div>
    )
  }
  else {
    var casesAndDeathsTable = (
      <ListGroup>
        <ListGroup.Item variant="dark">{sortByCases.state}</ListGroup.Item>
        <ListGroup.Item variant="warning">Confirmed: {sortByCases.cases} </ListGroup.Item>
        <ListGroup.Item variant="danger">Deaths: {sortByCases.deaths} </ListGroup.Item>
      </ListGroup>
    )
  }

  ReactDOM.render(casesAndDeathsTable, document.getElementById("casesAndDeaths"));
}

function createDoughnut(sumCases, sumPoblation) {
  var ctx = document.getElementById('donut').getContext('2d');
  var donut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Confirmed Cases', 'US poblation'],
      datasets: [{
        label: 'COVID cases',
        data: [sumCases, sumPoblation],
        backgroundColor: [
          'rgba(255, 206, 86, 0.5)',
          'rgba(54, 162, 235, 0.5)'
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }]
    }
  });

}

function createPieChart(justCases, justColors, justStates) {
  var pie = document.getElementById('pieChart').getContext('2d');
  var pieChart = new Chart(pie, {
    type: 'pie',
    data: {
      labels: justStates,
      datasets: [{
        label: 'COVID cases per state',
        data: justCases,
        backgroundColor: justColors
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function createLineChart(justDays, justCasesByDay) {
  var lineChart = document.getElementById('lineChart').getContext('2d');
  var myLineChart = new Chart(lineChart, {
    type: 'line',
    data: {
      labels: justDays,
      datasets: [{
        label: 'Accumulated cases per day',
        data: justCasesByDay
      }]
    }
  });
}

function postReceive(justStates, confirmedCase, confirmedDeath, data) {
  statesList = justStates;
  var sumCases = confirmedCase.reduce((acc, value) => acc + value, 0);
  var sumDeaths = confirmedDeath.reduce((acc, value) => acc + value, 0);

  var dataForTable = [];
  for(var i = 1; i < data.length; i++){
    if (data[i][0] === '2020-08-22') {
      dataForTable.push(data[i]);
    }
  }
  console.log("alsmdlakm");
  console.log(dataForTable);
  ////////////////merge Cases
  var map = new Map();
  var groups = [].concat(1);
  var mergeCases = dataForTable.reduce((r, o) => {
    groups.reduce((m, k, i, { length }) => {
      var child;
      if (m.has(o[k])) return m.get(o[k]);
      if (i + 1 === length) {
        child = Object
          .assign(...groups.map(k => ({ [k]: o[k] })), { [3]: 0 });
        r.push(child);
      } else {
        child = new Map();
      }
      m.set(o[k], child);
      return child;
    }, map)[3] += +o[3];
    return r;
  }, [])

  /////////get cases By Day
  var map = new Map();
  var groups = [].concat(0);
  var mergeCasesByDay = dataForTable.reduce((r, o) => {
    groups.reduce((m, k, i, { length }) => {
      var child;
      if (m.has(o[k])) return m.get(o[k]);
      if (i + 1 === length) {
        child = Object
          .assign(...groups.map(k => ({ [k]: o[k] })), { [3]: 0 });
        r.push(child);
      } else {
        child = new Map();
      }
      m.set(o[k], child);
      return child;
    }, map)[3] += +o[3];
    return r;
  }, [])

  ////////////mergeDeaths
  var map = new Map();
  var groups = [].concat(1);
  var mergeDeaths = dataForTable.reduce((r, o) => {
    groups.reduce((m, k, i, { length }) => {
      var child;
      if (m.has(o[k])) return m.get(o[k]);
      if (i + 1 === length) {
        child = Object
          .assign(...groups.map(k => ({ [k]: o[k] })), { [4]: 0 });
        r.push(child);
      } else {
        child = new Map();
      }
      m.set(o[k], child);
      return child;
    }, map)[4] += +o[4];
    return r;
  }, [])

  /////////get final data
  var element = {};
  var casesAndDeaths = [];
  for (var i = 0; i < mergeCases.length; i++) {
    element = {};
    element.state = mergeCases[i]["1"];
    element.cases = mergeCases[i]["3"];
    element.deaths = mergeDeaths[i]["4"];
    casesAndDeaths.push(element);
  }

  //////get data by day
  var element = {};
  var casesByDay = [];
  for (var i = 0; i < mergeCasesByDay.length; i++) {
    element = {};
    element.dayByDay = mergeCasesByDay[i]["0"];
    element.casesByDay = mergeCasesByDay[i]["3"];
    casesByDay.push(element);
  }

  var getDataOfTheDay = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === '2020-08-22') {
      getDataOfTheDay.push(data[i]);
    } 
  }

  /////////sort by cases
  var sortByCases =
    casesAndDeaths.sort((a, b) => {
      if (a.cases < b.cases) {
        return 1
      } else {
        return -1
      }
    });

  createCardConfirmedCases(sumCases);
  createCardConfirmedDeaths(sumDeaths);
  createCasesAndDeathsTable(sortByCases);
  createDoughnut(sumCases, 331640000);

  var sortByState =
    casesAndDeaths.sort((a, b) => {
      if (a.state < b.state) {
        return -1
      } else {
        return 1
      }
    });

  var justDays = [];
  var justCasesByDay = [];
  for (var i = 50; i < casesByDay.length; i++) {
    justDays.push(casesByDay[i].dayByDay);
    justCasesByDay.push(casesByDay[i].casesByDay);
  };

  createLineChart(justDays, justCasesByDay);

  var justCases = [];
  for (var i = 0; i < sortByState.length; i++) {
    justCases.push(sortByState[i].cases);
  };

  var justColors = [];
  for (var i = 0; i < 55; i++) {
    justColors.push(makeRandomColor());
  };

  getHeatMapData(getDataOfTheDay);
  createPieChart(justCases, justColors, justStates);

  console.log("cases");
  console.log(getDataOfTheDay);
  var element = createDropdownComponent(statesList, sumCases, sumDeaths, sortByCases, sortByState);
  ReactDOM.render(element, document.getElementById("id"));
}

function App() {
  const [tooltipContent, setTooltipContent] = useState('');
  const [data, setData] = useState(getHeatMapData());

  const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: 0,
    max: data.reduce((max, item) => (item.stateCases > max ? item.stateCases : max), 0)
  };

  const colorScale = scaleQuantile()
    .domain(data.map(d => d.stateCases))
    .range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { value: 'NA' }) => {
    return () => {
      setTooltipContent(`${geo.properties.name}: ${current.stateCases}`);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent('');
  };

  const onChangeButtonClick = () => {
    setData(getHeatMapData());
  };

  return (
    <div>
      <div id="id" className="Top"></div>
      <Row>
        <Col>
          <div className="Card">
            <Row>
              <Col>
                <div id="cardConfirmedCases"></div>
              </Col>
              <Col>
                <div id="cardConfirmedDeaths"></div>
              </Col>
            </Row>
          </div>
          <br></br>
          <div className="Table">
            <Row>
              <Col>
                <div id="casesAndDeaths"></div>
              </Col>
            </Row>
          </div>
          <br></br>
          <div>
            <Row>
              <Col>
                <canvas id="donut" width="100" height="90"></canvas>
              </Col>
            </Row>
          </div>
        </Col>
        <Col>
          <Row>
            <Col>
              <div className="map-container">
              <ReactTooltip>{tooltipContent}</ReactTooltip>
                <ComposableMap projectionConfig={{
                  scale: 750,
                  center: [78.9629, 22.5937] // always in [East Latitude, North Longitude]
                }}
                  projection="geoMercator"
                  height={1120}
                  data-tip="">
                  <ZoomableGroup center={[-97, 40]} disablePanning>
                    <Geographies geography={US_TOPO_JSON}>
                      {({ geographies }) =>
                        geographies.map(geo => {
                          const cur = data.find(s => s.id === geo.id);
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={cur ? colorScale(cur.stateCases) : DEFAULT_COLOR}
                              style={geographyStyle}
                              onMouseEnter={onMouseEnter(geo, cur)}
                              onMouseLeave={onMouseLeave}
                            />
                          );
                        })
                      }
                    </Geographies>
                  </ ZoomableGroup>
                </ComposableMap>
              </div>

            </Col>
          </Row>
          <Row>
            <Col>
              <canvas id="lineChart" width="100" height="100"></canvas>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col>
              <canvas id="pieChart" width="100" height="180"></canvas>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col>
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={covidOne}
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3>Mitos</h3>
                    <p style={{ backgroundColor: '#000000' }}>Mitos más difundidos sobre COVID-19.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={covidTwo}
                    alt="Second slide"
                  />
                  <Carousel.Caption>
                    <h3>Coronavirus</h3>
                    <p style={{ backgroundColor: '#000000' }}>Cómo se comparan las muertes por covid-19 con las mayores causas de mortalidad.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={covidThree}
                    alt="Third slide"
                  />
                  <Carousel.Caption>
                    <h3>COVID</h3>
                    <p style={{ backgroundColor: '#000000' }}>Preguntas y respuestas útiles sobre el coronavirus.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </Col>
          </Row>
        </Col>
      </Row>

    </div>
  );
}

export default App;
