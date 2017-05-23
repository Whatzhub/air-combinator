const CSVModel = [
    
    // META
    'currency', // HKD
    'base', // 1070
    'taxes', // 294
    'fare', // 1364 i.e. base + taxes
    'market', // HKGBKK - Hong Kong to BangKok
    'OTA', // ExpediaSG
    'type', // economy

    // DEPART
    'departFlightNo', // 110
    'departAirlineCode', // CX
    'departRoute', // 15:20 - HKG | 20:05 - KIX
    'departDuration', // 1:30
    'departDate', // 08/16/16
    'departTime', // 11:10

    // RETURN
    'returnFlightNo', // 121
    'returnAirlineCode', // CX
    'returnRoute', // 06:30 - KIX / 07:40 - HND | 08:55 - HND / 12:30 - HKG
    'returnDuration', // 1:45
    'returnDate', // 08/19/16
    'returnTime', // 18:10
];

/* 
    NOTE: Can be added
    
    'passengers' // 1

    'departRoute', // 07:55 - HKG :: 12:25 - ICN
    'departFlight', // CX414

    'returnRoute', // 08:45 - ICN :: 11:25 - HKG
    'returnFlight', // CX415

*/

module.exports = CSVModel;