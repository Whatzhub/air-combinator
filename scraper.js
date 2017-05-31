const querystring = require('querystring');
const fs = require('fs');

const Helpers = require('./modules/helpers');
const OTATable = require('./modules/otaTable');
const CSVModel = require('./model/csvModel');

const FlightRaja = require('./otas/flightRaja');
const Flight365 = require('./otas/flight365');
const ExpediaSG = require('./otas/expediaSG');
const HelloWorld = require('./otas/helloWorld');


// Define user query params (standalone scraper usage only)
const origin = 'SYD';
const destination = 'PEK';
const departDate = '2017-05-28';
const returnDate = '2017-05-30';


// THE SCRAPING ENGINE
var Scraper = {};

console.log('Running Fares Scraping.\n');

Scraper.scrape = function (reqBody) {

    return new Promise((resolve, reject) => {
        // Declare request params
        let origin = reqBody.origin;
        let destination = reqBody.destination;
        let departDate = reqBody.departDate;
        let returnDate = reqBody.returnDate;

        // Map user-selected otas vs. actual scraping otas
        let selectedOtas = reqBody.selectedOtas;
        let supportedOtas = [{
                name: 'FlightRaja',
                selected: false,
                index: 0
            },
            {
                name: 'Flight365',
                selected: false,
                index: 0
            },
            {
                name: 'HelloWorld',
                selected: false,
                index: 0
            }
        ];
        selectedOtas.forEach((i, el) => {
            supportedOtas.forEach((j, el2) => {
                if (i == j.name) {
                    j.selected = true;
                    j.index = el
                }
            });
        });

        // Store as convenient names
        let isFlightRajaSelected = supportedOtas[0].selected;
        let flightRajaIndex = supportedOtas[0].index;
        let isFlight365Selected = supportedOtas[1].selected;
        let flight365Index = supportedOtas[1].index;
        let isHelloWorldSelected = supportedOtas[2].selected;
        let helloWorldIndex = supportedOtas[2].index;

        // STEP 1 - Fares Scraping
        Promise.all([
                (isFlightRajaSelected) ? Helpers.downloadWithHttpsXml(FlightRaja, FlightRaja.body(origin, destination, departDate, returnDate)) : null,
                (isFlight365Selected) ? Helpers.downloadWithHttps(Flight365, Flight365.body(origin, destination, departDate, returnDate)) : null,
                (isHelloWorldSelected) ? Helpers.downloadWithRequestLib(HelloWorld, HelloWorld.body(origin, destination, departDate, returnDate)) : null
                // Helpers.downloadWithHttps(ExpediaSG)
            ])
            .then(dataArr => {

                // STEP 2 - Save results as JSON
                console.log('Fares Scraping done.\n');
                console.log('Writing JSON copies...\n');
                console.log(JSON.stringify(supportedOtas));

                if (isFlightRajaSelected) {
                    var flightRajaData = dataArr[0];
                }
                if (isFlight365Selected) {
                    var flight365Data = dataArr[1];
                }
                if (isHelloWorldSelected) {
                    var helloWorldData = JSON.stringify((dataArr[2].data.result));
                }

                Promise.all([
                        (isFlightRajaSelected) ? Helpers.writeFile('./json/FlightRaja.json', flightRajaData) : null,
                        (isFlight365Selected) ? Helpers.writeFile('./json/Flight365.json', flight365Data) : null,
                        (isHelloWorldSelected) ? Helpers.writeFile('./json/HelloWorld.json', helloWorldData) : null
                        // Helpers.writeFile('./json/ExpediaSG.json', dataArr[2]),
                    ])
                    .then(_ => {

                        // STEP 3 - Transform JSON to CSV
                        console.log('JSON writes done.\n');
                        console.log('Transforming into CSV...\n');

                        Promise.all([
                                (isFlightRajaSelected) ? FlightRaja.jsonToCSV(flightRajaData, origin, destination, departDate, returnDate) : null,
                                (isFlight365Selected) ? Flight365.jsonToCSV(flight365Data, origin, destination, departDate, returnDate) : null,
                                (isHelloWorldSelected) ? HelloWorld.jsonToCSV(helloWorldData, origin, destination, departDate, returnDate) : null
                                // Expedia work still pending
                            ])
                            .then(dataArr2 => {

                                // STEP 4 - Save results as one CSV
                                console.log('Joining CSVs...\n');

                                if (isFlightRajaSelected) {
                                    var flightRajaCSV = dataArr2[0];
                                }
                                if (isFlight365Selected) {
                                    var flight365CSV = dataArr2[1];
                                }
                                if (isHelloWorldSelected) {
                                    var helloWorldCSV = dataArr2[2];
                                }

                                let joinedArr = [CSVModel].concat(
                                    (isFlightRajaSelected) ? flightRajaCSV : [],
                                    (isFlight365Selected) ? flight365CSV : [],
                                    (isHelloWorldSelected) ? helloWorldCSV : []
                                );

                                let finalCSV = joinedArr.map(i => i.join(',')).join('\n');
                                Helpers.writeFile('./csv/allOTAs.csv', finalCSV)
                                    .then(_3 => {
                                        console.log('All processes successfully done!');
                                        resolve(joinedArr);
                                    })
                                    .catch(err => console.log(56, err) && reject(err));
                            })
                            .catch(err => console.log(58, err) && reject(err));
                    })
                    .catch(err => console.log(62, err) && reject(err));
            })
            .catch(err => console.log(64, err) && reject(err));
    });

};


module.exports = Scraper;