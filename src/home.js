// Declare lib modules
import Vue from 'vue';
import moment from 'moment';
import Wait from 'please-wait';
import Pikaday from 'pikaday';
import axios from 'axios';
import ss from 'simple-statistics';

// Declare internal modules
import Store from './js/store';
import Helpers from './js/helpers';
import Preloaders from './js/preloaders';
import CSVModel from '../model/csvModel';

// Initialize Globals
var OTAs = {};

// Initialise Preloader
var loadingScreen = Wait.pleaseWait({
    logo: "",
    backgroundColor: "#c9f1ff",
    loadingHtml: Preloaders.cube
});

// Initialise Home View
console.log('Home screen is present');

// Vue Instance #1 - Home
var home = new Vue({
    data: {
        // Search Obj
        searchObj: Store.state.input.searchObj,
        // OTA Data
        otas: Store.state.otas.otaMap,
        // Home Data
        homeScreen: true,
        quotes: {
            url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=10',
            posts: []
        }
    },
    mounted: function () {
        console.log('Home screen loaded!');
        console.log(this.homeScreen);
        loadingScreen.finish();

        // init autocomplete datalist
        axios.get('json/airports.json')
            .then(function (res) {
                let dataList = res.data;
                var airportCodeList = dataList.map(function (i) {
                    let name = (i.altName) ? i.altName : i.name;
                    return {
                        label: i.code + ', ' + name + ', ' + i.country,
                        value: i.code
                    }
                });
                new Awesomplete(document.getElementById('destination'), {
                    list: airportCodeList,
                    autoFirst: true
                });
                new Awesomplete(document.getElementById('origin'), {
                    list: airportCodeList,
                    autoFirst: true
                });
            })
            .catch(function (err) {
                console.log(72, err);
            });

        // init datepickers
        var departDatePicker = new Pikaday({
            field: document.getElementById('departDate'),
            firstDay: 1,
            minDate: new Date(),
            maxDate: new Date(2020, 12, 31),
            yearRange: [2017, 2020],
            theme: 'triangle-theme',
            onSelect: function (date) {
                home.searchObj.departDate = moment(date).format('YYYY-MM-DD');
                home.searchObj.returnDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
                returnDatePicker.show();
                returnDatePicker.setDate(home.searchObj.returnDate);
            }
        });
        var returnDatePicker = new Pikaday({
            field: document.getElementById('returnDate'),
            minDate: new Date(),
            maxDate: new Date(2020, 12, 31),
            yearRange: [2017, 2020],
            theme: 'triangle-theme',
            onSelect: function (date) {
                home.searchObj.returnDate = moment(date).format('YYYY-MM-DD');
            }
        });

        // Get random quotes
        this.getQuotes();

    },
    methods: {
        submitSearch: function (e) {

            // Get latest form input values
            home.searchObj.origin = document.getElementById('origin').value;
            home.searchObj.destination = document.getElementById('destination').value;
            home.searchObj.departDate = document.getElementById('departDate').value;
            home.searchObj.returnDate = document.getElementById('returnDate').value;

            // Perform input validation
            var inputValid = this.validateInput();
            if (!inputValid) return alert('You got to fill in your fields!');

            // Init Search Pending Screen
            var searchPendingScreen = Wait.pleaseWait({
                logo: "",
                backgroundColor: "#c9f1ff",
                loadingHtml: `
                    ${Preloaders.foldingCube}
                    <h3>Please wait while we return your search results...</h3>
                    <blockquote>
                        ${home.quotes.posts[0].content}
                        <p><cite> - ${home.quotes.posts[0].author}</cite></p>
                    </blockquote>`
            });

            // Loop over quotes while pending
            var quoteTimer = setInterval(function () {
                var index = Helpers.randomNumber(1, home.quotes.posts.length);
                searchPendingScreen.updateLoadingHtml(`
                    ${Preloaders.foldingCube}
                    <h3>Please wait while we return your search results...</h3>
                    <blockquote>
                        ${home.quotes.posts[index].content}
                        <p><cite> - ${home.quotes.posts[index].author}</cite></p>
                    </blockquote>`);
            }, 10000);

            // Send submit request      
            var config = {
                method: 'post',
                url: '/search',
                data: home.searchObj
            };

            axios.request(config)
                .then(function (res) {
                    if (!res.data.success) throw new Error('Request failed');
                    var response = res.data.data;
                    // console.log(147, response);
                    clearInterval(quoteTimer);
                    searchPendingScreen.finish();

                    // Init Search Pending Screen
                    var successScreen = Wait.pleaseWait({
                        logo: "",
                        backgroundColor: "#c9f1ff",
                        loadingHtml: `
                        <h1 class="limegreen"><i class="fa fa-check"></i> Success!</h1>
                        <h3>Returning your search results...</h3>`
                    });
                    setTimeout(function () {
                        // Change to plain background
                        var body = document.getElementsByTagName('body')[0];
                        body.style.backgroundImage = 'none';
                        home.homeScreen = false;
                        results.resultsScreen = true;
                        successScreen.finish();
                    }, 2000);
                    return response;
                })
                .then(function (response) {
                    var csvArr = response;
                    console.log(172, csvArr);

                    // set data to Results vue instance
                    results.csvData.dataArr = csvArr;
                    results.searchObj = home.searchObj;

                    // Perform calculations
                    results.calcStats(csvArr);
                    results.createDownloadBtn(csvArr);
                })
                .catch(function (err) {
                    console.log(126, err);
                    clearInterval(quoteTimer);
                    searchPendingScreen.finish();
                    alert('Request failed. Please retry with a non-VPN network.')
                });

        },
        getQuotes: function () {
            axios.get(home.quotes.url)
                .then(res => {
                    var data = res.data;
                    var dataWithoutTags = data.map(i => {
                        var cleanedQuote = i.content.replace(/<p[^>]*>|<\/p[^>]*>/g, "");
                        return {
                            content: cleanedQuote,
                            author: i.title
                        }
                    });
                    home.quotes.posts = dataWithoutTags;
                    console.log(home.quotes.posts);
                })
                .catch(err => console.log(162, err));
        },
        toggleOta: function (id) {
            console.log(209, id);
            var index = this.searchObj.selectedOtas.indexOf(id);
            if (index > -1) this.searchObj.selectedOtas.splice(index, 1);
            else this.searchObj.selectedOtas.push(id);
        },
        validateInput: function () {
            var valid = true;
            Object.keys(this.searchObj).forEach((key) => {
                if (this.searchObj[key] == '' || this.searchObj[key] == null) {
                    valid = false;
                }
            });
            return valid;
        }
    }
});


// Vue Instance #2 - Results
var results = new Vue({
    data: {
        // Results Data
        resultsScreen: false,
        isIEBrowser: false,
        searchObj: {},
        csvLink: '',
        csvName: '',
        csvData: {
            dataArr: [],
            airFares: {
                min: {
                    fare: 0,
                    ota: '',
                    departFlightNo: '',
                    returnFlightNo: ''
                },
                max: {
                    fare: 0,
                    ota: '',
                    departFlightNo: '',
                    returnFlightNo: ''
                },
                commonDepart: {
                    flight: '',
                    airline: '',
                    route: ''
                },
                commonReturn: {
                    flight: '',
                    airline: '',
                    route: ''
                },
                mean: 0,
                median: 0,
                mode: 0
            }
        }
    },
    mounted: function () {
        console.log('Results screen loaded!');
    },
    methods: {
        createDownloadBtn: function (csvArr) {
            var timeStamp = moment().unix();
            var finalArr = [CSVModel].concat(csvArr);
            var csvData = finalArr.map(i => i.join(',')).join('\n');
            var blob = new Blob([csvData], {
                type: "text/csv; charset=utf-8"
            });
            if (navigator.msSaveBlob) return results.isIEBrowser = true;
            results.csvLink = URL.createObjectURL(blob);
            results.csvName = `otaResults-${timeStamp}.csv`;

        },
        downloadCSV: function () {
            var timeStamp = moment().unix();
            var finalArr = [CSVModel].concat(results.csvData.dataArr);
            var csvData = finalArr.map(i => i.join(',')).join('\n');
            var blob = new Blob([csvData], {
                type: "text/csv; charset=utf-8"
            });
            navigator.msSaveBlob(blob, `otaResults-${timeStamp}.csv`); // IE 10+
        },
        calcStats: function (csvArr) {
            var data = csvArr;
            data.shift();
            var filterData = data.map(i => {
                return {
                    fare: i[3].toFixed(2),
                    ota: i[5],
                    departFlightNo: i[9],
                    returnFlightNo: i[12]
                }
            });
            var sortedData = filterData.sort((a, b) => a.fare - b.fare);

            var fareData = data.map(i => i[3]);
            
            var departFlightData = data.map(i => i[9]);
            var departAirlineData = data.map(i => i[10]);
            var departRouteData = data.map(i => i[11]);
            
            var returnFlightData = data.map(i => i[12]);
            var returnAirlineData = data.map(i => i[13]);
            var returnRouteData = data.map(i => i[14]);

            results.csvData.airFares.min = sortedData[0];
            results.csvData.airFares.max = sortedData[sortedData.length - 1];
            results.csvData.airFares.mean = ss.mean(fareData).toFixed(2);
            results.csvData.airFares.median = ss.median(fareData).toFixed(2);
            results.csvData.airFares.mode = ss.mode(fareData).toFixed(2);

            results.csvData.airFares.commonDepart.flight = ss.modeFast(departFlightData);
            results.csvData.airFares.commonDepart.airline = ss.modeFast(departAirlineData);
            results.csvData.airFares.commonDepart.route = ss.modeFast(departRouteData);

            results.csvData.airFares.commonReturn.flight = ss.modeFast(returnFlightData);
            results.csvData.airFares.commonReturn.airline = ss.modeFast(returnAirlineData);
            results.csvData.airFares.commonReturn.route = ss.modeFast(returnRouteData);
        }
    }
});


// Mount the Vue Instances
home.$mount('#home');
results.$mount('#results');