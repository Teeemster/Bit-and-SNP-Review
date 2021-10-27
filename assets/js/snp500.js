//Form Variables
var bitcoinPriceDate = document.getElementById("bitcoinPriceDate");
var submitButton = document.getElementById("submitButton");
var bitcoinValueBox = document.getElementById("bitcoinValueBox");
var stockOption = document.getElementById("stockOption");
var stockHistoricalDate = document.getElementById("stockHistoricalDate");
var stockValueBox = document.getElementById("stockValueBox");
var stockValueList = document.getElementById("stockValueList");
var bitcoinValueList = document.getElementById("bitcoinValueList");
var bitcoinPriorList = document.querySelector('#bitcoinPriorSearch');
var stockPriorList = document.querySelector('#stockPriorSearch');


//API URLs
var bitcoinRequestURL = "https://rest.coinapi.io/v1/trades/BITSTAMP_SPOT_BTC_USD/history?time_start="
var stockURL = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol="

//Bitcoin and Stock Search
submitButton.addEventListener("click", function () {

    //Clear Prior Text
    bitcoinValueList.textContent = "";
    stockValueList.textContent = "";
    bitcoinPriorList.textContent = "";
    stockPriorList.textContent = "";


    //User Input
    var bitcoinDateInput = bitcoinPriceDate.value + "T01";
    var bitcoinDateInput2 = bitcoinPriceDate.value + "T02";
    var stockOptionInput = stockOption.value;
    var stockHistoricalDateInput = stockHistoricalDate.value;

    //Full URL
    var fullBitcoinURL = bitcoinRequestURL + bitcoinDateInput + "&time_end=" + bitcoinDateInput2 + "&limit=1&apikey=B0A2F074-FC49-418C-8739-70B2671C6E7F"
    console.log(fullBitcoinURL);
    var fullStockURL = stockURL + stockOptionInput + "&interval=60min&slice=" + stockHistoricalDateInput + "&adjusted=false&apikey=WWB9KWS3ZE80GCDZ"
    console.log(fullStockURL);

    //Bitcoin Fetch
    fetch(fullBitcoinURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //Append Bitcoin Info
            console.log(data);
            var bitcoinPrice = data[0].price;
            console.log(bitcoinPrice);
            var bitcoinDateArea = document.createElement("li");
            var bitcoinListArea = document.createElement("li");
            bitcoinDateArea.textContent = "Date: " + bitcoinPriceDate.value;
            bitcoinListArea.textContent = "Price: " + bitcoinPrice;
            bitcoinValueList.appendChild(bitcoinDateArea);
            bitcoinValueList.appendChild(bitcoinListArea);

            //Store Prior Bitcoin Search
            var newData = "Date: " + bitcoinPriceDate.value + " | Value: " + bitcoinPrice

            if (localStorage.getItem('BitcoinInfo') == null) {
                localStorage.setItem('BitcoinInfo', '[]');
            }

            var oldData = JSON.parse(localStorage.getItem('BitcoinInfo'))

            oldData.push(newData)

            localStorage.setItem('BitcoinInfo', JSON.stringify(oldData))
            storageInfo();
        });


    //Stock Fetch
    fetch(fullStockURL)
        .then(function (response) {
            return response.text();
        })
        .then(function (data) {
            var rows = data.split("\r\n")
            var formattedData = []
            for (let i = 1; i < rows.length; i++) {
                const element = rows[i].split(",");
                formattedData.push({
                    time: element[0],
                    open: element[1],
                    high: element[2],
                    low: element[3],
                    close: element[4],
                    volume: element[5]
                })
            }

            //Append Stock Info
            var stockTimeList = document.createElement("li");
            var stockOpenList = document.createElement("li");
            var stockHighList = document.createElement("li");
            var stockLowList = document.createElement("li");
            var stockCloseList = document.createElement("li");
            var stockVolumeList = document.createElement("li");

            var stockTime = formattedData[0].time;
            var stockOpen = formattedData[0].open;
            var stockHigh = formattedData[0].high;
            var stockLow = formattedData[0].low;
            var stockClose = formattedData[0].close;
            var stockVolume = formattedData[0].volume;

            stockTimeList.textContent = "Date: " + stockTime;
            stockOpenList.textContent = "Open: " + stockOpen;
            stockHighList.textContent = "High: " + stockHigh;
            stockLowList.textContent = "Low: " + stockLow;
            stockCloseList.textContent = "Close: " + stockClose;
            stockVolumeList.textContent = "Volume: " + stockVolume;


            stockValueList.appendChild(stockTimeList);
            stockValueList.appendChild(stockOpenList);
            stockValueList.appendChild(stockHighList);
            stockValueList.appendChild(stockLowList);
            stockValueList.appendChild(stockCloseList);
            stockValueList.appendChild(stockVolumeList);

            //Store Prior Stock Search
            var newData = "Date: " + stockTime + " | " + "Stock: " + stockOptionInput + " | " + "Close: " + stockClose

            if (localStorage.getItem('StockInfo') == null) {
                localStorage.setItem('StockInfo', '[]');
            }

            var oldData = JSON.parse(localStorage.getItem('StockInfo'))

            oldData.push(newData)

            localStorage.setItem('StockInfo', JSON.stringify(oldData))
            storageInfo();
        });

});

//Retrieve and Append From Storage
function storageInfo() {
    var bitcoinPriorList = document.querySelector('#bitcoinPriorSearch');
    var stockPriorList = document.querySelector('#stockPriorSearch');
    bitcoinPriorList.textContent = "";
    stockPriorList.textContent = "";
    //Bitcoin
    if (localStorage.getItem('BitcoinInfo') != null) {
        var bitcoinPriorArray = JSON.parse(localStorage.getItem('BitcoinInfo')) || [];

        for (var i = 0; i < bitcoinPriorArray.length; i++) {
            var bitcoinEl = document.createElement('li');
            bitcoinEl.textContent = bitcoinPriorArray[i];
            console.log(bitcoinPriorArray[i]);
            bitcoinPriorList.appendChild(bitcoinEl);
        }
    }

    //Stock Info
    if (localStorage.getItem('StockInfo') != null) {
        var stockPriorArray = JSON.parse(localStorage.getItem('StockInfo')) || [];

        for (var i = 0; i < stockPriorArray.length; i++) {
            var stockEl = document.createElement('li');
            stockEl.textContent = stockPriorArray[i];
            stockPriorList.appendChild(stockEl);
        }
    }
};

storageInfo();

//Clear History Function
clearButton = document.getElementById("clearButton")
clearButton.addEventListener("click", function () {
    localStorage.clear();
    bitcoinPriorList.textContent = "";
    stockPriorList.textContent = "";
}
);



