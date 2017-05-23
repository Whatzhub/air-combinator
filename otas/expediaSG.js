const ExpediaSG = {
    host: 'www.expedia.com.sg',
    path: '/Flight-Search-Paging?c=3a91e9c9-841f-4952-8cc0-5cc785e88ba1&is=1&sp=asc&cz=200&cn=0&ul=0',
    // apiPath: function(jSessionVal) {
    //     let val = jSessionVal;
    //     return `/Flight-Search-Paging?c=${val}&is=1&sp=asc&cz=200&cn=0&ul=0`;
    // },
    method: 'GET',
    headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, sdch, br',
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
    },
    body: null
};


module.exports = ExpediaSG;