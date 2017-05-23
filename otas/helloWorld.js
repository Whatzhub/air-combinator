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
            "destination": "PEK",
            "departureDate": "2017-05-22",
            "span": "Anytime"
        }, {
            "origin": "PEK",
            "destination": "SYD",
            "departureDate": "2017-05-25",
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
    }
};


module.exports = HelloWorld;