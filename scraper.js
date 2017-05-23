const querystring = require('querystring');
const fs = require('fs');

const Helpers = require('./modules/helpers');
const OTATable = require('./modules/otaTable');
const CSVModel = require('./model/csvModel');

const FlightRaja = require('./otas/flightRaja');
const Flight365 = require('./otas/flight365');
const ExpediaSG = require('./otas/expediaSG');
const HelloWorld = require('./otas/helloWorld');

// THE SCRAPING ENGINE

// STEP 1 - Fares Scraping
console.log('Running Fares Scraping.\n');

Promise.all([
        Helpers.downloadWithHttpsXml(FlightRaja),
        Helpers.downloadWithHttps(Flight365)
        // Helpers.downloadWithHttps(ExpediaSG),
        // Helpers.downloadWithRequestLib(HelloWorld)
    ])
    .then(dataArr => {

        // STEP 2 - Save results as JSON
        console.log('Fares Scraping done.\n');
        console.log('Writing JSON copies...\n');
        // let dataSetA = JSON.stringify((dataArr[3].data.result));

        Promise.all([
                Helpers.writeFile('./json/FlightRaja.json', dataArr[0]),
                Helpers.writeFile('./json/Flight365.json', dataArr[1])
                // Helpers.writeFile('./json/ExpediaSG.json', dataArr[2]),
                // Helpers.writeFile('./json/HelloWorld.json', dataSetA)
            ])
            .then(_ => {

                // STEP 3 - Transform JSON to CSV
                console.log('JSON writes done.\n');
                console.log('Transforming into CSV...\n');

                Promise.all([
                        FlightRaja.jsonToCSV(dataArr[0], 'SYD', 'PEK'),
                        Flight365.jsonToCSV(dataArr[1], 'SYD', 'PEK')
                    ])
                    .then(dataArr => {

                        // STEP 4 - Save results as one CSV
                        console.log('Joining CSVs...\n');

                        let joinedArr = [CSVModel].concat(dataArr[0], dataArr[1]);
                        let finalArrRows = joinedArr.map(i => i.join(',')).join('\n');
                        Helpers.writeFile('./csv/allOTAs.csv', finalArrRows);

                        return console.log('All processes successfully done!');
                    })
                    .catch(err => console.log(58, err));
            })
            .catch(err => console.log(62, err));
    })
    .catch(err => console.log(64, err));