!function ($) {
	$(function() {
		/**
		 * Use Geolocation if allowed
		 */
		var geo = {
			coords: null,
			init: function() {
				navigator.geolocation.getCurrentPosition( this.success, this.error );
			},

			success: function( position ) {
				geo.coords = position.coords;
				googlemaps.call( geo.coords );
			},

			error: function( error ) {
				googlemaps.handlenogeolocation();
			}
		}

		/**
		 * Flickr API
		 */
		var flickr = {
			url: 'http://api.flickr.com/services/rest/?jsoncallback=?',
			data: {
				format: 'json',
				method: 'flickr.photos.search',
				api_key: '765ec4031c10071ef84dfc6f8d9b2fe9',
				tags: '',
				perPage: '10'
			},
			ajax: function( data ) {
				return $.ajax({
							type: 'GET',
							url: flickr.url,
							dataType: 'json',
							data: data,
							cache: false
						});
			},
			get: function( course ) {
				this.data.tags = course;
				this.ajax( flickr.data ).done( function( data ){
							return
						} ).fail( function(){
							coursesearch.dom.inputcontainer.addClass('error');
							//console.log( 'There was an error retrieving images.' )
						} );
			},
			sort: function( data ) {

			}
		}

		/**
		 * Google API
		 */
		var googlemaps = {
			dom: {
				container: document.getElementById("map_canvas"),
				map: $('#map_canvas')
			},
			mapoptions: {
				center: null,
				zoom: 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			},
			defaults: {
				latitude: 41.291859,
				longitude: -96.043406
			},
			markers: [],
			infowindow: null,
			map: null,
			places: null,
			geocoder: null,
			init: function() {
				coursesearch.events();
				this.geocoder = new google.maps.Geocoder();
			},
			call: function( location ) {
				this.map = new google.maps.Map( googlemaps.dom.container, googlemaps.mapoptions );
				this.places = new google.maps.places.PlacesService( googlemaps.map );
				if ( ! location.hasOwnProperty( 'latitude' ) || ! location.hasOwnProperty( 'longitude' ) )
				{
					coursesearch.error();
				}

				location = new google.maps.LatLng( location.latitude, location.longitude );
				googlemaps.map.setCenter( location );

				var search = {
					location: location,
					radius: 5,
					query: 'golf course'
				}

				// CLEAR MARKERS
				googlemaps.clearmarkers();
				googlemaps.places.textSearch( search, googlemaps.addmarkers );
			},
			addmarkers: function( results, status ) {
				var bounds = new google.maps.LatLngBounds();
				if ( status == google.maps.places.PlacesServiceStatus.OK ) {
					coursesearch.buildlist( results );
					$.each( results, function( key, place ) {
						var marker,
							html;

						googlemaps.infowindow = new google.maps.InfoWindow({ 
							map: googlemaps.map,
							maxWidth: 450
						});

						marker = new google.maps.Marker({
							position: place.geometry.location,
							map: googlemaps.map,
							title: place.name
						});
						html = '<div class="result"><div class="column addressInfo"><strong>' + place.name + '</a></strong><br />' + place.formatted_address + '<br /><a href="http://maps.google.com/maps?f=d&hl=en&saddr=&daddr=' + place.formatted_address + '" target="_blank" class="small" />Get Directions</a></div></div><br style="clear:both; padding:5px;" />'; 

						google.maps.event.addListener( marker, 'click', function() {
							if ( googlemaps.infowindow )
							{
								googlemaps.infowindow.close();
							}
							googlemaps.infowindow.setContent( html );
							googlemaps.infowindow.open( googlemaps.map, this );
						});
						
						$( 'div.course-location:eq(' + key + ')' ).on( 'click', function() {
							$( 'div.course-location' ).removeClass( 'selected' );
							$( this ).addClass( 'selected' );
							
							if ( googlemaps.infowindow ) 
							{
								googlemaps.infowindow.close();
							}
							googlemaps.infowindow.setContent( html );
							googlemaps.infowindow.open( googlemaps.map, marker );
						});
						
						// ADD MARKERS TO ARRAY TO CLEAR
						googlemaps.markers.push( marker );
					});
				}
				else
				{
					coursesearch.error();
				}
			},
			handlenogeolocation: function() {
			},
			clearmarkers: function() {
				for (var i = 0; i < googlemaps.markers.length; i++ ) {
					googlemaps.markers[i].setMap(null);
				}
			}
		}

		var coursesearch = {
			dom: {
				form: $('#course-search-form'),
				input: $('#location'),
				inputcontainer: $('div.input-container'),
				button: $('#search'),
				locationsrc: $('#ajax-locations'),
				locationcontainer: $('.course-list-container')
			},
			events: function() {
				this.dom.form.on('submit', coursesearch.validate);
				this.dom.button.on('click', coursesearch.validate);
			},
			validate: function( e ) {
				var location = {};

				location.address = $.trim( coursesearch.dom.input.val() );

				if (location.address.length < 1)
				{
					coursesearch.dom.inputcontainer.addClass('error');
				}
				else
				{
					coursesearch.call( location );
				}

				e.preventDefault();
			},
			call: function( location ) {
				googlemaps.geocoder.geocode( { 'address': location.address }, function postcodesearch( results, status ) 
				{
					if ( status == google.maps.GeocoderStatus.OK ) 
					{
						var	location = {};
						// SET LOCATION FROM SEARCH
						location.latitude = results[0].geometry.location.lat();
						location.longitude = results[0].geometry.location.lng();

						googlemaps.call( location );
					}
					else {
						coursesearch.error();
					}
				});
			},
			buildlist: function( results ) {
				var location = [];
				$.each( results, function( key, place ) {
					var photos = flickr.get( place.name );
					photos = ( typeof photos !== 'undefined' ) ? photos : '';
					location.push( { name: place.name, address: place.formatted_address, photos: photos } );
				});
				
				locations = {locations:location};

				/**
				 * Handlebars templating
				 * Build list of locations
				 */
				var	locationtemplate = Handlebars.compile( coursesearch.dom.locationsrc.html() );
				coursesearch.dom.locationcontainer.html( locationtemplate( locations ) );
			},
			error: function() {
				googlemaps.dom.map.html('<p style="text-align:center;">No results found for this address.</p>');
				coursesearch.dom.locationcontainer.html('<p style="text-align:center;">No results found for this address.</p>');
				return false;
			}
		}

		/**
		 * Initiate Google maps
		 */
		googlemaps.init();
		
		/**
		 * Check Geolocation Browser Support
		 */
		if( navigator.geolocation )
		{
			geo.init();
		}
		else
		{
			googlemaps.handlenogeolocation();
		}
	});
}(window.jQuery);