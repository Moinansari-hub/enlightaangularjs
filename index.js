var app = angular.module('weatherApp', []);
app.controller('WeatherController', function($scope, $http) {
  $scope.loading = false;
  $scope.weatherData = {};
  $scope.errorMessage = '';
  $scope.weatherContentVisible = false;

  $scope.getWeather = function() {
    var city = document.getElementById('cityInput').value.trim();
    if (city === '') {
      $scope.errorMessage = 'Please enter a city.';
      return;
    }

    var weatherApiKey = '3cac524057eb4d1582795741240602';
    var geocodingApiKey = '65ba2165024d5660860737spwaae037';
    var geocodingApiUrl = 'https://cors-anywhere.herokuapp.com/https://geocode.maps.co/search?q=' + encodeURIComponent(city) + '&api_key=' + geocodingApiKey;

    $scope.loading = true;

    $http.get(geocodingApiUrl)
      .then(function(response) {
        var geocodingData = response.data;
      console.log(geocodingData);
        if (geocodingData.length === 0 || !geocodingData[0].lat || !geocodingData[0].lon) {
          $scope.errorMessage = 'City not found. Please enter a valid city.';
          $scope.loading = false;
          $scope.weatherContentVisible = false; 
          return;
        }
        var latitude = geocodingData[0].lat;
        var longitude = geocodingData[0].lon;
        var weatherApiUrl = 'https://cors-anywhere.herokuapp.com/https://api.weatherapi.com/v1/current.json?key=' + weatherApiKey + '&q=' + latitude + ',' + longitude;

        $http.get(weatherApiUrl)
          .then(function(response) {
            var weatherData = response.data.current;
            console.log(weatherData);
            if (weatherData) {
              $scope.weatherData = {
                temp: weatherData.temp_f !== undefined ? weatherData.temp_f : 'Data unavailable',
                tempCelsius: weatherData.temp_c !== undefined ? weatherData.temp_c : 'Data unavailable',
                humidity: weatherData.humidity !== undefined ? weatherData.humidity : 'Data unavailable',
                wind: weatherData.wind_kph !== undefined ? weatherData.wind_kph : 'Data unavailable',
                condition: weatherData.condition !== undefined ? weatherData.condition.text : 'Data unavailable'
              };
              $scope.weatherContentVisible = true; 
              var condition = weatherData.condition.text.toLowerCase();
              var weatherIcon = '';
    
              if (condition.includes('snow')) {
                weatherIcon = 'snow.png';
              } else if (condition.includes('rain')) {
                weatherIcon = 'rain.png';
              } else if (condition.includes('cloud')) {
                weatherIcon = 'cloud.png';
              } else if (condition.includes('mist')) {
                weatherIcon = 'mist.png';
              } else {
                weatherIcon = 'clear.png';
              }
    
              $scope.weatherIcon = 'images/' + weatherIcon;
            } else {
              $scope.errorMessage = 'Weather data unavailable.';
            }
          })
          .catch(function(error) {
            $scope.errorMessage = 'Failed to fetch weather data. ' + error;
          })
          .finally(function() {
            $scope.loading = false;
          });
      })
      .catch(function(error) {
        $scope.errorMessage = 'Failed to fetch location data. ' + error;
        $scope.loading = false;
      });
  };
});