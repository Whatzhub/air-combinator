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

// Define user query params
const origin = 'SYD';
const destination = 'PEK';
const departDate = '2017-05-28';
const returnDate = '2017-05-30';

// STEP 1 - Fares Scraping
console.log('Running Fares Scraping.\n');

Promise.all([
        Helpers.downloadWithHttpsXml(FlightRaja, FlightRaja.body(origin, destination, departDate, returnDate)),
        Helpers.downloadWithHttps(Flight365, Flight365.body(origin, destination, departDate, returnDate)),
        Helpers.downloadWithRequestLib(HelloWorld, HelloWorld.body(origin, destination, departDate, returnDate))
        // Helpers.downloadWithHttps(ExpediaSG)
    ])
    .then(dataArr => {

        // STEP 2 - Save results as JSON
        console.log('Fares Scraping done.\n');
        console.log('Writing JSON copies...\n');

        let flightRajaData = dataArr[0]
        let flight365Data = dataArr[1];
        let helloWorldData = JSON.stringify((dataArr[2].data.result));

        Promise.all([
                Helpers.writeFile('./json/FlightRaja.json', flightRajaData),
                Helpers.writeFile('./json/Flight365.json', flight365Data),
                Helpers.writeFile('./json/HelloWorld.json', helloWorldData)
                // Helpers.writeFile('./json/ExpediaSG.json', dataArr[2]),
            ])
            .then(_ => {

                // STEP 3 - Transform JSON to CSV
                console.log('JSON writes done.\n');
                console.log('Transforming into CSV...\n');

                Promise.all([
                        FlightRaja.jsonToCSV(flightRajaData, origin, destination, departDate, returnDate),
                        Flight365.jsonToCSV(flight365Data, origin, destination, departDate, returnDate),
                        HelloWorld.jsonToCSV(helloWorldData, origin, destination, departDate, returnDate)
                        // Expedia pending
                    ])
                    .then(dataArr2 => {

                        // STEP 4 - Save results as one CSV
                        console.log('Joining CSVs...\n');

                        let flightRajaCSV = dataArr2[0];
                        let flight365CSV = dataArr2[1];
                        let helloWorldCSV = dataArr2[2];

                        let joinedArr = [CSVModel].concat(flightRajaCSV, flight365CSV, helloWorldCSV);
                        let finalCSV = joinedArr.map(i => i.join(',')).join('\n');
                        Helpers.writeFile('./csv/allOTAs.csv', finalCSV);

                        return console.log('All processes successfully done!');
                    })
                    .catch(err => console.log(58, err));
            })
            .catch(err => console.log(62, err));
    })
    .catch(err => console.log(64, err));