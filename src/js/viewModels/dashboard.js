/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery','gmap','ojs/ojselectcombobox'],
 function(oj, ko, $, g) {
  
    function DashboardViewModel() {
      var self = this;
      var directionsService = '';
      var directionsDisplay = '';
      var distance = 0;
      self.start = ko.observable("Chicago");
      self.end = ko.observable("Chicago");
      self.distance = ko.observable("");
      var geocoder = new google.maps.Geocoder();
      
      self.onChangeHandler = function(event) {
        console.log(self.start);
        directionsService.route({
          origin: self.start._latestValue,
          destination: self.end._latestValue,
          travelMode: 'DRIVING'
          }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
            var address1 = self.start._latestValue;
            var address2 = self.end._latestValue;
            var latitude1 = 0,longitude1 = 0,latitude2 = 0,longitude2 = 0;
            
            function findGeoCode(callback){
                  geocoder.geocode({ 'address': address1 }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        latitude1 = results[0].geometry.location.lat();
                        longitude1 = results[0].geometry.location.lng();
                        
                    }
                  });
                  geocoder.geocode({ 'address': address2 }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        latitude2 = results[0].geometry.location.lat();
                        longitude2 = results[0].geometry.location.lng();

                    }
                    callback();
                  });

            }
            
           findGeoCode(function(){
            self.distance(Math.floor(google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1,longitude1), 
            new google.maps.LatLng(latitude2,longitude2))/1000))});
             
          } else {
            window.alert('Directions request failed due to ' + status);
          }
          });
        console.log("Out CH");
      };     

      self.connected = function() {
        console.log("In Connected");
        directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: {lat: 41.85, lng: -87.65}
        });
        directionsDisplay.setMap(map);
        console.log("Out Connected");
      }
     
    }

    return new DashboardViewModel();
  }
);
