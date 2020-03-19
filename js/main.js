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

            var city = response.name.toUpperCase();
            var country = response.sys.country;
            var iconCode = response.weather[0].icon;

            iconCode = iconCode.replace("\"","");

            var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
            var icon = $("<img>").attr("src", iconURL)
            var dailyHeading = $("#cityDateIcon").text(city + " [" + country + "]");

            $("#cityDateIcon").append(dailyHeading, icon);

            var temperature = ((response.main.temp - 273.15) * 9/5 + 32).toFixed(0);
            $("#dailyTemp").text(temperature + "°F");

            var feels_like = ((response.main.feels_like - 273.15) * 9/5 + 32).toFixed(0);
            $("#dailyfells").text(feels_like + "°F");

            var temp_min = ((response.main.temp_min - 273.15) * 9/5 + 32).toFixed(0);
            $("#dailytemp_min").text(temp_min + "°F");

            var temp_max = ((response.main.temp_max - 273.15) * 9/5 + 32).toFixed(0);
            $("#dailytemp_max").text(temp_max + "°F");

            var temperatureC = (response.main.temp - 273.15).toFixed(0);
            $("#dailyTempC").text(temperatureC + "°C");

            var feels_likeC = (response.main.feels_like - 273.15).toFixed(0);
            $("#dailyfellsC").text(feels_likeC + "°C");

            var temp_minC = (response.main.temp_min - 273.15).toFixed(0);
            $("#dailytemp_minC").text(temp_minC + "°C");

            var temp_maxC = (response.main.temp_max - 273.15).toFixed(0);
            $("#dailytemp_maxC").text(temp_maxC + "°C");

            var wtr_humidity = response.main.humidity;
            $("#dailyHumidity").text(wtr_humidity + "%");

            var wtr_main = response.weather[0].main;
            $("#dailywtrmain").text(wtr_main);

            var wtr_desc = response.weather[0].description;
            $("#dailywtrdesc").text(wtr_desc);

            var windspeed = response.wind.speed;
            $("#dailyWindSpeed").text(windspeed + " mph");
            $("#dailyWindSpeedK").text((windspeed / 1.60934).toFixed(2) + " kmh");

            $("#dailylatitude").text("Latitude : " + response.coord.lat);
            $("#dailylongitude").text("Longitude : " + response.coord.lon);

            var sunrise = response.sys.sunrise;
            $("#dailysunrise").text(new Date(sunrise * 1000));
            
            var sunset = response.sys.sunset;
            $("#dailysunset").text(new Date(sunset * 1000));

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
                        <td colspan="3" style="font-size: 12px;">C O O R D I N A T E S<td>
                    </tr>
                    <tr>    
                        <td><label id="dailylatitude"></label></td>
                        <td><label id="dailylongitude"></label></td>
                    </tr>
                    <tr>
                        <td colspan="3" style="font-size: 12px;">T E M P E R A T U R E (°F)<td>
                    </tr>
                    <tr>    
                        <td>
                            Daily : <label id="dailyTemp"></label>  | 
                            Fells : <label id="dailyfells"></label>
                        </td>
                        <td>
                            Min : <label id="dailytemp_min"></label>  | 
                            Max : <label id="dailytemp_max"></label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="font-size: 12px;">T E M P E R A T U R E (°C)<td>
                    </tr>
                    <tr>    
                        <td>
                            Daily : <label id="dailyTempC"></label> |
                            Fells : <label id="dailyfellsC"></label>
                        </td>
                        <td>
                            Min : <label id="dailytemp_minC"></label> |
                            Max : <label id="dailytemp_maxC"></label>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="font-size: 12px;">W I N D S P E E D<td>
                    </tr>
                    <tr>    
                        <td><label id="dailyWindSpeed"></label></td>
                        <td><label id="dailyWindSpeedK"></label></td>
                    </tr>
                    <tr>
                        <td style="font-size: 12px;">S U N S E T</td>
                        <td style="font-size: 12px;">S U N R I S E</td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px;"><label id="dailysunrise"></label></td>
                        <td style="font-size: 16px;"><label id="dailysunset"></label></td>
                    </tr>
                    <tr>
                        <td style="font-size: 12px;">H U M I D I T Y</td>
                        <td style="font-size: 12px;">W E A T H E R</td>
                    </tr>
                    <tr>
                        <td><label id="dailyHumidity"></label></td>
                        <td>
                            <label id="dailywtrmain"></label> 
                            (<label id="dailywtrdesc"></label>)
                        </td>
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

            let output = `
            <div class="container" style="margin-top: 10px; margin-bottom: 80px;">
                <div id="dailyDiv" >
                    <h1 id="cityDateIcon">NEXT  5  DAYS  FORECAST</h1>
                    <table style="width: 100%; text-align: center;">
                        <tr>
                            <td>DATE</td>
                            <td>FORECAST</td>
                            <td>HUMIDITY</td>
                            <td colspan="2">TEMPERATURE</td>
                        </tr>
                     `

            for (var i = 0; i < idArray.length; i++) {
                
                var idString = idArray[i];

                var date = dailyArray[listIndex].dt * 1000;
                var dateString = moment(date).format("MMMM DD YYYY");
                dateString = dateString.replace("0", "");
                                
                var iconCode = (dailyArray[listIndex].weather[0].icon).replace("\"","");
                var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";                
                var humidity = dailyArray[listIndex].main.humidity;
                var tempString = dailyArray[listIndex].main.temp.toFixed(0);
                var temperature = ((tempString - 32) * 5/9).toFixed(0);
                
                output += `
                <tr>
                    <td>${dateString}</td>
                    <td><img src="${iconURL}" width="70px" height="70px"></td>
                    <td>Humidity : ${humidity} %</td>
                    <td>${tempString}°F </td>
                    <td>${temperature}°C</td>
                </tr>
                `
                listIndex+=8;
            } 

            output += `     
                    </table>
                </div>
            </div>
            ` 
            
            document.getElementById('fiveDayForecast').innerHTML = output;
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