// Declare lib modules
import Vue from 'vue';
import moment from 'moment';
import Wait from 'please-wait';
import Pikaday from 'pikaday';
import axios from 'axios';

// Declare internal modules
import Store from './js/store';
import Helpers from './js/helpers';
import Preloaders from './js/preloaders';

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
            this.searchObj.origin = document.getElementById('origin').value;
            this.searchObj.destination = document.getElementById('destination').value;
            this.searchObj.departDate = document.getElementById('departDate').value;
            this.searchObj.returnDate = document.getElementById('returnDate').value;

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

            // NOTE: TESTING
            setTimeout(function () {
                // Change to plain background
                var body = document.getElementsByTagName('body')[0];
                body.style.backgroundImage = 'none';

                
                searchPendingScreen.finish();
                clearInterval(quoteTimer);

                 // Init Search Pending Screen
            var successScreen = Wait.pleaseWait({
                logo: "",
                backgroundColor: "#c9f1ff",
                loadingHtml: `
                <h1 class="limegreen"><i class="fa fa-check"></i> Success!</h1>
                <h3>Returning your search results...</h3>
                `
            });
            setTimeout(function() {
                home.homeScreen = false;
                results.resultsScreen = true;
                successScreen.finish();
            }, 2000)

            }, 12000);
            return console.log('testing done');

            // Send submit request      
            var config = {
                method: 'post',
                url: '/search',
                data: home.searchObj
            };

            axios.request(config)
                .then(function (res) {
                    // Change to plain background
                    var body = document.getElementsByTagName('body')[0];
                    body.style.backgroundImage = `url("https://duffy.fedorapeople.org/art/f15/sky-background.svg")`;
                    body.style.backgroundSize = 'initial';

                    clearInterval(quoteTimer);
                    home.homeScreen = false;
                    results.resultsScreen = true;
                    searchPendingScreen.finish();

                    var csvString = res.data;
                    results.createDownloadBtn(csvString);
                })
                .catch(function (err) {
                    console.log(126, err);
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
        toggleOta: function (e) {
            if (e.srcElement.checked) this.searchObj.selectedOtas.push(e.target.id);
            else {
                var index = this.searchObj.selectedOtas.indexOf(e.target.id);
                if (index > -1) this.searchObj.selectedOtas.splice(index, 1);
            }
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
        resultsData: [],
        csvLink: '',
        csvName: ''
    },
    mounted: function () {
        console.log('Results screen loaded!');
    },
    methods: {
        init: function () {

        },
        createDownloadBtn: function (csvString) {
            var timeStamp = moment().unix();
            var csvData = csvString;
            var blob = new Blob([csvData], {
                type: "text/csv; charset=utf-8"
            });
            results.csvLink = URL.createObjectURL(blob);
            results.csvName = `otaResults-${timeStamp}.csv`;
        }
    }
});


// Mount the Vue Instances
home.$mount('#home');
results.$mount('#results');