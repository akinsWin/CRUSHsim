
// ====================================================================
// CRUSHSim - CRUSH Simulation web app for Ceph admins
// ---------------------------------------------------
// 
// By Xavier Villaneau, 2015
// xavier.villaneau@fr.clara.net or xvillaneau@gmail.com
// Claranet SAS, Rennes, France
// ====================================================================
// map-list.js - jQuery for displaying a list of saved CRUSH maps
//  - To be used only on pages where the code for said list has already
//    been generated by the server, along with a pre#crush-map-preview
//  - Makes the list pretty by making a line "active" when clicked
//  - displayCrush may be used in other cases (see analyze.js)
//
// Changelog:
// ----------
// May 4th 2015 - Initial release
// June 15th 2015 - Allow use of the "crush-maps-list" class, which
//  fetches the list instead of having it in the HTML beforehand.



function displayCrush(mapid, element) {
	$.get('/crushdata/'+mapid, function(data) {
		// Get data, REST is our friend !
		element.text(data);
	});
};

function mapRowClick(){
	// Handler for the click event on a row in a map list

	// The 'info' class is removed from the previous active <tr>
	$('.crush-map-avail.info').removeClass('info');
	$(this).addClass('info');

	var id;
	// Get the ID of the map: first try the uuid property, then the content of the cells
	if (typeof($(this).prop('crushUuid')) != 'undefined' ) id = $(this).prop('crushUuid')
	else id = $(this).children('.crush-map-id').text();

	displayCrush(id, $('#crush-map-preview'));
};


$('document').ready(function(){

	// Add the event handler to already present rows
	$('.crush-map-avail').on('click', mapRowClick);

	if ($('.crush-maps-list').length) {
		// If there is a block for the CRUSH maps list in the page
		$.get('/crushdata', function(data){
			// Get the list of CRUSH maps and their metadata

			if (data.length == 0) {
				// If the list is empty, delete the table and write a message
				$('.crush-maps-list').empty().append("<p>There is currently no saved CRUSH map</p>")

			} else {
				for (var i = 0; i < data.length; i++) {
					
					// For each map, append a new row to the table
					var maprow = $('<tr>').appendTo('.crush-maps-list tbody');

					// Add the appropriate class, the crush uuid and property the handler
					maprow.addClass('crush-map-avail').prop('crushUuid', data[i].id).on('click', mapRowClick);

					// Use the name if it's defined, else write the ID
					var rowtext = (typeof(data[i].name) != 'undefined' ? data[i].name : data[i].id);
					$('<td>').text(rowtext).appendTo(maprow);

					// Add another cell for the date
					var rowdate = new Date(data[i].modtime * 1000);
					$('<td>').text(rowdate.toLocaleString()).appendTo(maprow);

					// If a mapRowButton function is defined, call it. The document will use it to
					// add the action buttons, including handlers if necessary.
					if (typeof(mapRowButton) != 'undefined') mapRowButton(maprow);
				}
			}
		});
	};

});
// vim: set ts=4 sw=4 autoindent:
