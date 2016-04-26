var mapApp= angular.module("mapApp", []);
mapApp.directive("myMaps", function() {
	return {
		restrict:'E',
		template: '<div></div>',
		replace: true,
		link: function(scope, element, attrs){
			var myLatLng = new google.maps.LatLng(37.3352, -121.8811);
			var mapOptions = {
					center: myLatLng,
					zoom: 16,
					mapTypeId: google.maps.MapTypeId.SATELLITE
			};
			var map = new google.maps.Map(document.getElementById(attrs.id), mapOptions);
			var marker = new google.maps.Marker({
				position: myLatLng,
				map: map,
				title: 'SJSU'
			});
			marker.setMap(map);

		}
	};
});
