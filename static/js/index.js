var selectedApproaches = [];
var dataSource;
var cronSchedulingTime;
var dataRateValue;

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

    $( document ).on( 'click', '.approachList ul li', function() {
	var text = $( this ).html();
	$( this ). remove();
	$( '#selectedApproaches' ).append( '<span class="removable">' + text + '<span class="removable_remove">&#10006;</span></span>' );
	selectedApproaches.push( $.trim( text ) );
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
        cronSchedulingTime = $( '#scoreRate' ).val();
        dataRateValue = $( "#dataRate" ).val();
	if( selectedApproaches.length > 0 ) {
	    dataSource = $.trim( $( "#dataSource" ).val() );
	    $.post( '/approach', {
		'sourceName' : dataSource,
		'dataRate' : dataRateValue,
		'approachList' : JSON.stringify( { 'list' : selectedApproaches } ),
		'scoreRate' : cronSchedulingTime
	    }, function( data ) {
		document.write( data );
	    } );
	    $( '.error' ).html( "" );
	}
	else {
	    $( '.error' ).html( "Please Select some approach to continue " );
	}
    } );
} );
