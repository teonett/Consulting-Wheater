$(document).ready(function() {

    var arrCity = JSON.parse(localStorage.getItem("arrCity")) || [];
    arrCity.forEach(addButton);
    var onLoadIndex = arrCity.length -1
    var onLoad = arrCity[onLoadIndex];

    dailyWeather(onLoad);
    fiveDayForecast(onLoad);

    generateSearch();
    generateResultSearch();
    generateDaily();

    function generateSearch(){

        let output = `
        <div class="container" style="margin-top: 70px;">
            <div class="row">
                <a class="psearch">Search for City : &nbsp;</a>
                <input type="text" class="form-control" id="input" placehorder="Los Angeles">
                <button type="submit" class="btn btn-primary btn-lg" id="searchButton"><i class="fa fa-search"></i></button>
            </div>
        </div>`

        document.getElementById('searchCity').innerHTML = output;
    }

    function addButton(input) {

        var button = $("<button>");

        button.addClass("btn btn-light btn-lg cityButton");
        button.text(input);
        button.attr("type", "button");
        
        $("#cityButtonDiv").append(button);
    }

    function generateResultSearch(){

        let output = `
        <div class="container" style="margin-top: 10px;">
            <div class="col-md-12" id="cityButtonDiv"></div>
        </div>`

        document.getElementById('resultSearch').innerHTML = output;
    }

    $("#searchButton").on("click", function(event){

        var cityString = $("#input").val().trim();
        var city = cityString.charAt(0).toUpperCase() + cityString.slice(1);
    
        dailyWeather(city);
        fiveDayForecast(city);
        addButton(city);
    
        arrCity.push(city);
        localStorage.setItem("arrCity", JSON.stringify(arrCity));
    });

    $(document).on("click", ".cityButton", function(){

        console.log($(this));
        
        var city = $(this).text();
        
        dailyWeather(city);
        fiveDayForecast(city);

    });

    function dailyWeather(input) {
        
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + input + ",us&APPID=b2af0c249ef1580d9d26aa8ca64187be";
        
        $.ajax({
            url: queryURL,
            method: "GET"

        }).then(function(response){

            console.log(response);

            var city = response.name;
            var country = response.sys.country;
            var date = response.dt * 1000;
            var dateString = moment(date).format("MM/DD/YYYY");
            var iconCode = response.weather[0].icon;

            iconCode = iconCode.replace("\"","");

            var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
            var icon = $("<img>").attr("src", iconURL)
            var dailyHeading = $("#cityDateIcon").text(city + " [" + country + "] (" + dateString + ") ");

            $("#cityDateIcon").append(dailyHeading, icon);

            var temperature = ((response.main.temp - 273.15) * 9/5 + 32).toFixed(0);
            $("#dailyTemp").text(temperature + " °F");

            var temperatureC = (response.main.temp - 273.15).toFixed(0);
            $("#dailyTempC").text(temperatureC + "°C");

            $("#dailyHumidity").text("Humidity : " + response.main.humidity + "%");
            $("#dailyCloudiness").text("Cloudiness : " + response.weather[0].main);

            var windspeed = response.wind.speed;
            $("#dailyWindSpeed").text(windspeed + " mph");
            $("#dailyWindSpeedK").text((windspeed / 1.60934).toFixed(2) + " kmh");

            $("#dailylatitude").text("Lat.: " + response.coord.lat);
            $("#dailylongitude").text("Long.: " + response.coord.lon);

            var sunrise = response.sys.sunrise;
            $("#dailysunrise").text("Sunrise : " + sunrise);
            
            var sunset = response.sys.sunset;
            $("#dailysunset").text("Sunset : " + sunset);

            $("#dailytimezone").text("Timezone : " + response.timezone);

            UVIndex(lon, lat);
        });
    };

    function generateDaily() {

        let output = `
        <div class="container" style="margin-top: 10px;">
            <div id="dailyDiv" >
                <h1 id="cityDateIcon"></h1>
                <table style="width: 100%; text-align: center;">
                    <tr>    
                        <td>Coordinates</td>
                        <td><label id="dailylatitude"></label></td>
                        <td><label id="dailylongitude"></label></td>
                    </tr>
                    <tr>    
                        <td>Temperature</td>
                        <td><label id="dailyTemp"></label></td>
                        <td><label id="dailyTempC"></label></td>
                    </tr>
                    <tr>    
                        <td>Windspeed</td>
                        <td><label id="dailyWindSpeed"></label></td>
                        <td><label id="dailyWindSpeedK"></label></td>
                    </tr>               
                    <tr>    
                        <td><label id="dailyHumidity"></label></td>
                        <td><label id="dailyCloudiness"></label></td>
                        <td></td>
                    </tr>
                    <tr>    
                        <td>Cloudiness</td>
                        <td><label id="dailyWindSpeed"></label></td>
                        <td><label id="dailyWindSpeedK"></label></td>
                    </tr>
                    <tr>    
                    <td><label id="dailytimezone"></label></td>
                        <td><label id="dailysunrise"></label></td>
                        <td><label id="dailysunset"></label></td>
                    </tr>
                    
                </table>
            </div>
        </div>`

        document.getElementById('resultDaily').innerHTML = output;
    }

    function fiveDayForecast(input) {
        
        var query5DayURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + input + ",us&units=imperial&APPID=b2af0c249ef1580d9d26aa8ca64187be";
        
        $.ajax({
            url: query5DayURL,
            method: "GET"
            
        }).then(function(response) {
            
            var dailyArray = response.list;
            var idArray = [1, 2, 3, 4, 5];
            var listIndex = 6;
            
            for (var i = 0; i < idArray.length; i++) {
                
                var idString = idArray[i];

                var date = dailyArray[listIndex].dt * 1000;
                var dateString = moment(date).format("MM/DD/YYYY");

                dateString = dateString.replace("0", "");
                
                $("#Day-" + idString).children("#date").text(dateString);
                $("#Day-" + idString).children("#icon").empty();
                
                var iconCode = dailyArray[listIndex].weather[0].icon;
                iconCode = iconCode.replace("\"","");

                
                var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
                var icon = $("<img>").attr("src", iconURL)
                $("#Day-" + idString).children("#icon").append(icon);

                var humidity = dailyArray[listIndex].main.humidity;
                $("#Day-" + idString).children("#humidity").text("Humidity: " + humidity + "%");

                var tempString = dailyArray[listIndex].main.temp.toFixed(0);
                $("#Day-" + idString).children("#temp").text("Temp: " + tempString + " °F");

                listIndex+=8;
            }   
        });
    };
           
    function UVIndex(lon, lat){
        
        var queryUVIndex = "http://api.openweathermap.org/data/2.5/uvi?appid=b2af0c249ef1580d9d26aa8ca64187be&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: queryUVIndex,
            method: "GET"
        }).then(function(response){
            uvIndex = response.value;
            JSON.stringify(uvIndex);
            $("#dailyUVIndex]").text("UV Index: ");
            $("#dailyUVIndex2").text(uvIndex);

            console.log(uvIndex);
            
        });
    };
    
    
})