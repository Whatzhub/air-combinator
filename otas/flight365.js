const Flight365 = {
    host: 'api2.fly365.com',
    path: '/api/flights/search',
    method: 'POST',
    headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    },
    body: function (origin, destination, departDate, returnDate) {
        let o = origin;
        var d = destination;
        let dDate = departDate;
        let rDate = returnDate;
        let token = 's5c18gwyv7b54f8bngp3deqq4cxz403f';


        return `searchparams%5Bjourneys%5D%5B0%5D%5Borigin%5D=${o}&searchparams%5Bjourneys%5D%5B0%5D%5Bdestination%5D=${d}&searchparams%5Bjourneys%5D%5B0%5D%5Bdeparturedate%5D=${dDate}&searchparams%5Bjourneys%5D%5B0%5D%5Bcabinclass%5D=Economy&searchparams%5Bjourneys%5D%5B1%5D%5Borigin%5D=${d}&searchparams%5Bjourneys%5D%5B1%5D%5Bdestination%5D=${o}&searchparams%5Bjourneys%5D%5B1%5D%5Bdeparturedate%5D=${rDate}&searchparams%5Bjourneys%5D%5B1%5D%5Bcabinclass%5D=Economy&searchparams%5Bpassengers%5D%5Badt%5D=1&searchparams%5Bpassengers%5D%5Bcnn%5D=0&searchparams%5Bpassengers%5D%5Binf%5D=0&token=${token}`
    },
    jsonToCSV: function (data, departCode, returnCode, departDate, returnDate) {
        let jsonData = JSON.parse(data);
        let dc = departCode;
        let rc = returnCode;
        let dd = departDate;
        let rd = returnDate;
        let dataArr = [];
        let rowIndex = 0;
        let market = dc + rc;
        let itineraries = jsonData.data.itineraries;


        return new Promise((resolve, reject) => {
            itineraries.forEach((i, el) => {
                i.optionsets[0].forEach((j, el2) => {
                    i.optionsets[1].forEach((k, el3) => {

                        // data cache
                        let departLeg1 = j.legs[0];
                        let returnLeg1 = k.legs[0];

                        // Fly Trip Pricing & Meta
                        dataArr.push([
                            i.pricing.currencycode, // currency
                            i.pricing.base, // base
                            i.pricing.tax, // taxes
                            i.pricing.total, // fare
                            market, // market
                            Flight365.host, // OTA
                            departLeg1.cabin, // type
                            dd, // departDate
                            rd // returnDate
                        ]);

                        // 1 Fly Depart Leg
                        if (!j.legs[1]) {
                            dataArr[rowIndex] = dataArr[rowIndex].concat([

                                departLeg1.carrier.flightnumber, // departFlight
                                departLeg1.carrier.code, // departAirlineCode
                                (departLeg1.origin.departuretime.time + ' - ' + departLeg1.origin.code + ' | ' + departLeg1.destination.arrivaltime.time + ' - ' + departLeg1.destination.code) // departRoute
                            ]);
                        }

                        // > 1 Fly Depart leg
                        if (j.legs[1]) {
                            let departLeg2 = j.legs[1];
                            dataArr[rowIndex] = dataArr[rowIndex].concat([
                                departLeg1.carrier.flightnumber + ' - ' + departLeg2.carrier.flightnumber,
                                departLeg1.carrier.code + ' - ' + departLeg2.carrier.code,
                                (departLeg1.origin.departuretime.time + ' - ' + departLeg1.origin.code + ' / ' + departLeg1.destination.arrivaltime.time + ' - ' + departLeg1.destination.code + ' | ' + departLeg2.origin.departuretime.time + ' - ' + departLeg2.origin.code + ' / ' + departLeg2.destination.arrivaltime.time + ' - ' + departLeg2.destination.code)
                            ]);
                        }

                        // 1 Fly Return Leg
                        if (!k.legs[1]) {
                            dataArr[rowIndex] = dataArr[rowIndex].concat([
                                returnLeg1.carrier.flightnumber, // returnFlight
                                returnLeg1.carrier.code, // departAirlineCode
                                (returnLeg1.origin.departuretime.time + ' - ' + returnLeg1.origin.code + ' | ' + returnLeg1.destination.arrivaltime.time + ' - ' + returnLeg1.destination.code) // departRoute
                            ]);
                        }


                        // > 1 Fly Return Leg
                        if (k.legs[1]) {
                            let returnLeg2 = k.legs[1];
                            dataArr[rowIndex] = dataArr[rowIndex].concat([
                                returnLeg1.carrier.flightnumber + ' - ' + returnLeg2.carrier.flightnumber,
                                returnLeg1.carrier.code + ' - ' + returnLeg2.carrier.code,
                                (returnLeg1.origin.departuretime.time + ' - ' + returnLeg1.origin.code + ' / ' + returnLeg1.destination.arrivaltime.time + ' - ' + returnLeg1.destination.code + ' | ' + returnLeg2.origin.departuretime.time + ' - ' + returnLeg2.origin.code + ' / ' + returnLeg2.destination.arrivaltime.time + ' - ' + returnLeg2.destination.code)
                            ]);
                        }

                        rowIndex++;
                    });
                });

                // console.log(dataArr);
            });

            resolve(dataArr);
        })

    }
};


module.exports = Flight365;