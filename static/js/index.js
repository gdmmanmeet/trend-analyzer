$( function() {
    var valueOutput = function( element ) {
        var value = element.value;
        var output = element.parentNode.getElementsByTagName( 'output' )[ 0 ];
        output.innerHTML = value;
    }

    var $element = $( '[type="range"]' );

    for( var i  = $element.length - 1; i >=0; i -- )
        valueOutput( $element[i] );

    $(document).on( 'change', 'input[type="range"]', function( e ) {
        valueOutput( e.target );
    } );

    $element.rangeslider( {
        polyfill : false
    } );

    var selectedApproaches = [];
    $( document ).on( 'click', '.approachList ul li', function() {
	var text = $( this ).html();
	$( this ). remove();
	$( '#selectedApproaches' ).append( '<span class="removable">' + text + '<span class="removable_remove">&#10006;</span></span>' );
	selectedApproaches.push( text );
	if( selectedApproaches.length > 1 )
	    $( '#analyzeApproachButton' ).html( "Compare Approaches" );
	else
	    $( '#analyzeApproachButton' ).html( "Analyze Approaches" );
    } );

    $( document ).on( 'click', '.removable_remove', function() {
	var parent = $( this ).parent();
	var text = parent.children().remove().end().text();
	$( '.approachList ul' ).append( '<li>' + text + '</li>' );
	parent.remove();
	var index = selectedApproaches.indexOf( text );
	selectedApproaches.splice( index, 1 );
	if( selectedApproaches.length > 1 )
	    $( '#analyzeApproachButton' ).html( "Compare Approaches" );
	else
	    $( '#analyzeApproachButton' ).html( "Analyze Approaches" );
    } );

    $( '#analyzeApproachButton' ).click( function() {
	if( selectedApproaches.length > 0 ) {
	    $.post( '/approach', {
		'sourceName' : $.trim( $( "#dataSource" ).val() ),
		'dataRate' : $( "#dataRate" ).val(),
		'approachList' : JSON.stringify( { 'list' : selectedApproaches } ),
		'scoreRate' : $( "#scoreRate" ).val()
	    } );
	    $( '.error' ).html( "" );
	}
	else {
	    $( '.error' ).html( "Please Select some approach to continue " );
	}
    } );
} );