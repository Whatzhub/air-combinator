const moment = require('moment');

const HelloWorld = {
    host: 'www.helloworld.com.au',
    url: 'https://www.helloworld.com.au/booking/api/search/search',
    method: 'POST',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'cache-control': 'no-cache',
        'content-type': 'application/json'
    },
    body: {
        "legs": [{
            "origin": "SYD",
            "destination": "MAN",
            "departureDate": "2017-05-25",
            "span": "Anytime"
        }, {
            "origin": "MAN",
            "destination": "SYD",
            "departureDate": "2017-05-28",
            "span": "Anytime"
        }],
        "passengers": {
            "childrenAge": [],
            "adults": 1,
            "children": 0
        },
        "carrier": [],
        "cabin": "C",
        "type": "air",
        "triptype": "roundtrip"
    },
    getRoutes: function (dataArr, legCode, count, routeString) {
        let cache = dataArr;
        let routes = routeString;

        if (cache[count].arrivalAirport != legCode) {
            routes += (moment.parseZone(cache[count].departureDateTime).format('HH:mm') + ' - ' + cache[count].departureAirport) + ' / ' + (moment.parseZone(cache[count].arrivalDateTime).format('HH:mm') + ' - ' + cache[count].arrivalAirport) + ' | ';
        }
        if (cache[count].arrivalAirport == legCode) {
            routes += (moment.parseZone(cache[count].departureDateTime).format('HH:mm') + ' - ' + cache[count].departureAirport) + ' / ' + (moment.parseZone(cache[count].arrivalDateTime).format('HH:mm') + ' - ' + cache[count].arrivalAirport);
            return routes;
        }
        count++;
        return this.getRoutes(cache, legCode, count, routes);
    },
    getFlightNo: function (dataArr, legCode, count, flightNoString) {
        let cache = dataArr;
        let flightNo = flightNoString;

        if (cache[count].arrivalAirport != legCode) {
            flightNo += cache[count].flightNumber + ' - ';
        }
        if (cache[count].arrivalAirport == legCode) {
            flightNo += cache[count].flightNumber;
            return flightNo;
        }
        count++;
        return this.getFlightNo(cache, legCode, count, flightNo);
    },
    getCarrierCode: function (dataArr, legCode, count, carrierCodeString) {
        let cache = dataArr;
        let carrierCode = carrierCodeString;

        if (cache[count].arrivalAirport != legCode) {
            carrierCode += cache[count].marketingCarrier + ' - ';
        }
        if (cache[count].arrivalAirport == legCode) {
            carrierCode += cache[count].marketingCarrier;
            return carrierCode;
        }
        count++;
        return this.getCarrierCode(cache, legCode, count, carrierCode);
    },
    jsonToCSV: function (data, departCode, returnCode, departDate, returnDate) {
        let jsonData = JSON.parse(data);
        let dc = departCode; // 'SYD'
        let rc = returnCode; // 'PEK'
        let dd = departDate;
        let rd = returnDate;
        let market = dc + rc;
        let dataArr = [];
        let flights = jsonData.flights;

        return new Promise((resolve, reject) => {
            flights.forEach((i, el) => {

                // Fly Trip Pricing & Meta
                let baseFare = i.requestModel.ptcBreakDownModels[0].baseFare;
                let totalFare = i.requestModel.ptcBreakDownModels[0].totalFare;
                let taxes = totalFare - baseFare;

                dataArr.push([
                    'AUD', // currency
                    baseFare, // base
                    taxes, // taxes
                    totalFare, // fare
                    market, // market
                    HelloWorld.host, // OTA
                    i.legs[0].info.cabin.tooltip, // type
                    dd, // departDate
                    rd // returnDate
                ]);

                // >= 1 Fly Depart Leg
                let departLegInfos = i.legs[0].legInfos;
                let departRoutes = HelloWorld.getRoutes(departLegInfos, rc, 0, '');
                let departFlightNo = HelloWorld.getFlightNo(departLegInfos, rc, 0, '');
                let departCarrierCode = HelloWorld.getCarrierCode(departLegInfos, rc, 0, '');
                dataArr[el] = dataArr[el].concat([
                    departFlightNo, // departFlight
                    departCarrierCode, // departAirlineCode
                    departRoutes // departRoute
                ]);

                // >= 1 Fly Return Leg
                let returnLegInfos = i.legs[1].legInfos;
                let returnRoutes = HelloWorld.getRoutes(returnLegInfos, dc, 0, '');
                let returnFlightNo = HelloWorld.getFlightNo(returnLegInfos, dc, 0, '');
                let returnCarrierCode = HelloWorld.getCarrierCode(returnLegInfos, dc, 0, '');
                dataArr[el] = dataArr[el].concat([
                    returnFlightNo, // departFlight
                    returnCarrierCode, // departAirlineCode
                    returnRoutes // departRoute
                ]);
            });

            resolve(dataArr);
        })

    }
};


module.exports = HelloWorld;