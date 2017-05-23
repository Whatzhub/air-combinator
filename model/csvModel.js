const CSVModel = [
    
    // META
    'currency', // HKD
    'base', // 1070
    'taxes', // 294
    'fare', // 1364 i.e. base + taxes
    'market', // HKGBKK - Hong Kong to BangKok
    'OTA', // ExpediaSG
    'type', // economy
    'departDate', // 08/16/16
    'returnDate', // 08/19/16

    // DEPART
    'departFlightNo', // 110
    'departAirlineCode', // CX
    'departRoute', // 15:20 - HKG | 20:05 - KIX

    // RETURN
    'returnFlightNo', // 121
    'returnAirlineCode', // CX
    'returnRoute' // 06:30 - KIX / 07:40 - HND | 08:55 - HND / 12:30 - HKG
];

/* 
    NOTE: Can be added
    
    'passengers' // 1
    'departFlight', // CX414
    'returnFlight', // CX415

*/

module.exports = CSVModel;