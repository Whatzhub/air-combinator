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

                FlightRaja.jsonToCSV(dataArr[0], 'SYD', 'PEK')
                    .then(rows => {
                        let csvData = rows.map(i => i.join(',')).join('\n');
                        Helpers.writeFile('./csv/FlightRaja.csv', csvData);
                    })
                    .then(_2 => {
                        console.log('Joining CSVs...\n');
                        // STEP 4 - Join all CSV as one

                        return console.log('All processes done!');
                    })
                    .catch(err => console.log(30, err));

                return 1;
            })
            .catch(err => console.log(36, err));
    })
    .catch(err => console.log(41, err));



// NOTE: TESTING

// Helpers.downloadWithRequestLib(HelloWorld)
//     .then(data => {
//         var a = JSON.stringify((data.data.result));
//         // console.log(a);
//         console.log(38, a);
//         Helpers.writeFile('./json/HelloWorld.json', a),
//             console.log('Fares Scraper ended...');
//     })
//     .catch(err => console.log(36, err));