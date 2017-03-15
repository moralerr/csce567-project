// visualize.js -- Code for wrangling ETF data.

// ----------------------------------------------------------------------------
// Globals
// ----------------------------------------------------------------------------

// Initialized when data is loaded.
dataset = null;

// Modified as user adds/removes ETFs from the ETF drawer.
selected_etfs = null;


// ----------------------------------------------------------------------------
// Dataset wrangling
// ----------------------------------------------------------------------------

// This function loads our CSV dataset, parsing into per-row JSON objects.
function load_dataset(callback) {
    var parseDate = d3.timeParse("%m/%d/%Y");
    d3.csv("data/historical_nav.csv", function(d) {
        // Build a JSON object for each row.
        return {
            date:                     parseDate(d['Date']),
            proshares_name:           d['ProShares Name'],
            ticker:                   d['Ticker'],
            nav:                     +d['NAV'],
            prior_nav:               +d['Prior NAV'],
            nav_change_percent:      +d['NAV Change (%)'],
            nav_change_dollars:      +d['NAV Change ($)'],
            shares_outstanding:      +d['Shares Outstanding (000)'],
            assets_under_management: +d['Assets Under Management']
        }
    }, function(error, data) {
        // Push the resulting list of objects to a global.
        dataset = data;
        // If a callback was provided, call it.
        if (typeof(callback) === "function" && callback) {
            callback();
        }
    });
}

// This function loads a specific etf, parsing the arrays properly
function load_etf(etfName, callback) {
    var parseDate = d3.timeParse("%m/%d/%Y");
    d3.json("data/json_files_tickers/" + etfName.toUpperCase() + ".json", function(d) {
        // Build a JSON object for each row.
        var out = {
            date: [],
            nav: [],
            yhv: []
        };
        var dates = d['Date'];
        dates.forEach(function(o) {
            out.date.push(parseDate(o))
        });
        var navs = d['NAV'];
        navs.forEach(function(o) {
            out.nav.push(+o)
        });
        var yhvs = d['YHV'];
        yhvs.forEach(function(o) {
            out.yhv.push(+o)
        });
        console.log(out);
        return out;
    }, function(error, data) {
        // Push the resulting list of objects to a global.
        console.info(data);
        // If a callback was provided, call it.
        if (typeof(callback) === "function" && callback) {
            callback();
        }
    });
}


// ----------------------------------------------------------------------------
// Miscellaneous functions
// ----------------------------------------------------------------------------

// Function to show unique ProShares/Ticker names.
function display_proshares() {
    // Display ProShares names in console.
    var names = dataset.map(function(d) { return d.proshares_name });
    // Filter to just the unique values.
    console.log(d3.set(names).values());
    // Repeat the process for ticker names.
    var tickers = dataset.map(function(d) { return d.ticker });
    console.log(d3.set(tickers).values());
}


// ----------------------------------------------------------------------------
// Initialization functions
// ----------------------------------------------------------------------------

// This function runs once the document has loaded/rendered.
$(document).ready(function () {
    // Use dumb-but-effective callback chaining to get things done.
    load_dataset(function (){
        display_proshares();
    });
});
