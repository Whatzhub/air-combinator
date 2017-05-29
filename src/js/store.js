var Store = {
    state: {
        user: {
            name: '',
            savedRoutes: []
        },
        otas: {
            otaMap: [
                {name: 'FlightRaja'},
                {name: 'Flight365'},
                {name: 'HelloWorld'}
            ]
        },
        input: {
            searchObj: {
                origin: '',
                destination: '',
                departDate: '',
                returnDate: '',
                selectedOtas: []
            }
        }
    },
    // Set API
    setUserName: function (val) {
        this.state.user.name = val;
    },

    // Get API
    getUserName: function () {
        return this.state.user.name;
    }
};

export default Store;