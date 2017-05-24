const moment = require('moment');

const FlightRaja = {
    host: 'www.via.id',
    path: '/apiv2/flight/search?&flowType=NODE&ajax=true&jsonData=true',

    method: 'POST',
    headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Cache-Control': 'no-cache',
        'Via-Access-Token': 'c51b5435-cec6-4de2-b133-419139122a02',
        'X-Requested-With': 'XMLHttpRequest'
    },
    body: "{\"sectorInfos\":[{\"src\":{\"code\":\"SYD\",\"name\":\"Sydney Kingsford Smith Arpt\",\"country\":\"Australia\",\"city\":\"Sydney\"},\"dest\":{\"code\":\"PEK\",\"name\":\"Beijing Capital Arpt\",\"country\":\"China\",\"city\":\"Beijing\"},\"date\":\"2017-05-25\",\"debug\":false},{\"src\":{\"code\":\"PEK\",\"name\":\"Beijing Capital Arpt\",\"country\":\"China\",\"city\":\"Beijing\"},\"dest\":{\"code\":\"SYD\",\"name\":\"Sydney Kingsford Smith Arpt\",\"country\":\"Australia\",\"city\":\"Sydney\"},\"date\":\"2017-05-28\",\"debug\":false}],\"class\":\"ALL\",\"paxCount\":{\"adt\":1,\"chd\":0,\"inf\":0},\"route\":\"ALL\",\"disc\":false,\"multiCity\":false,\"senior\":false,\"special\":false,\"domestic\":false,\"isOfflineSearch\":false,\"isPaxWiseCommission\":false,\"prefAirlines\":[{\"code\":\"GDS\"}]}",
    jsonToCSV: function (data, departCode, returnCode, departDate, returnDate) {
        let jsonData = JSON.parse(data);
        let dc = departCode; // 'SYD'
        let rc = returnCode; // 'PEK'
        let dd = departDate;
        let rd = returnDate;
        let market = dc + rc;
        let dataArr = [];
        let rowIndex = 0;
        let returnIndex = 0;
        let journeys = jsonData.combinedJourneys;

        return new Promise((resolve, reject) => {
            journeys.forEach((i, el) => {

                // Fly Trip Pricing & Meta
                    dataArr.push([
                        'INR', // currency
                        i.fares.totalFare.base.amount / 1000, // base
                        i.fares.totalFare.tax.amount / 1000, // taxes
                        i.fares.totalFare.total.amount / 1000, // fare
                        market, // market
                        FlightRaja.host, // OTA
                        'N/A', // type
                        dd, // departDate
                        rd // returnDate
                    ]);

                i.flights.forEach((j, el2) => {

                    // 1 Fly Depart Leg
                    if (j.depDetail.code == dc && j.arrDetail.code == rc) {
                        let departTime = moment.parseZone(j.depDetail.time).format('HH:mm');
                        let arrivalTime = moment.parseZone(j.arrDetail.time).format('HH:mm');

                        dataArr[rowIndex] = dataArr[rowIndex].concat([
                            j.flightNo, // departFlight
                            j.carrier.code, // departAirlineCode
                            (departTime + ' - ' + j.depDetail.code + ' | ' + arrivalTime + ' - ' + j.arrDetail.code) // departRoute
                        ]);
                    }

                    // > 1 and last Fly Depart leg
                    if (j.depDetail.code != dc && j.arrDetail.code == rc) {
                        let departTime1 = moment.parseZone(i.flights[0].depDetail.time).format('HH:mm');
                        let arrivalTime1 = moment.parseZone(i.flights[0].arrDetail.time).format('HH:mm');
                        let departTime2 = moment.parseZone(i.flights[el2].depDetail.time).format('HH:mm');
                        let arrivalTime2 = moment.parseZone(i.flights[el2].arrDetail.time).format('HH:mm');

                        dataArr[rowIndex] = dataArr[rowIndex].concat([
                            i.flights[0].flightNo + ' - ' + i.flights[el2].flightNo,
                            i.flights[0].carrier.code + ' - ' + i.flights[el2].carrier.code,
                            (departTime1 + ' - ' + i.flights[0].depDetail.code + ' / ' + arrivalTime1 + ' - ' + i.flights[0].arrDetail.code + ' | ' + departTime2 + ' - ' + i.flights[el2].depDetail.code + ' / ' + arrivalTime2 + ' - ' + i.flights[el2].arrDetail.code)
                        ]);

                    }

                    // 1 Fly Return Leg
                    if (j.depDetail.code == rc && j.arrDetail.code == dc && j.isReturn == true) {
                        let departTime = moment.parseZone(j.depDetail.time).format('HH:mm');
                        let arrivalTime = moment.parseZone(j.arrDetail.time).format('HH:mm');
                        
                        dataArr[rowIndex] = dataArr[rowIndex].concat([
                            j.flightNo, // departFlight
                            j.carrier.code, // departAirlineCode
                            (departTime + ' - ' + j.depDetail.code + ' | ' + arrivalTime + ' - ' + j.arrDetail.code) // departRoute
                        ]);
                    }

                    // Identify 1st Fly Return Leg
                    if (j.depDetail.code == rc && j.arrDetail.code != dc && j.isReturn == true) {
                        returnIndex = el2;
                    }

                     // > 1 Fly Return Leg
                    if (j.depDetail.code != rc && j.arrDetail.code == dc && j.isReturn == true) {
                        let departTime1 = moment.parseZone(i.flights[returnIndex].depDetail.time).format('HH:mm');
                        let arrivalTime1 = moment.parseZone(i.flights[returnIndex].arrDetail.time).format('HH:mm');
                        let departTime2 = moment.parseZone(i.flights[el2].depDetail.time).format('HH:mm');
                        let arrivalTime2 = moment.parseZone(i.flights[el2].arrDetail.time).format('HH:mm');
                        
                        dataArr[rowIndex] = dataArr[rowIndex].concat([
                            i.flights[returnIndex].flightNo + ' - ' + i.flights[el2].flightNo,
                            i.flights[returnIndex].carrier.code + ' - ' + i.flights[el2].carrier.code,
                            (departTime1 + ' - ' + i.flights[returnIndex].depDetail.code + ' / ' + arrivalTime1 + ' - ' + i.flights[returnIndex].arrDetail.code + ' | ' + departTime2 + ' - ' + i.flights[el2].depDetail.code + ' / ' + arrivalTime2 + ' - ' + i.flights[el2].arrDetail.code)
                        ]);
                        returnIndex = 0;
                    }
                });
                rowIndex++;
                console.log(dataArr);
            });

            resolve(dataArr);
        })

    }
};



module.exports = FlightRaja;