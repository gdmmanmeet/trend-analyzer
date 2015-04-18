var valueOutput = function( element ) {
    var value = element.value;
    var output = element.parentNode.getElementsByTagName( 'output' )[ 0 ];
    output.innerHTML = value;
};

var percentageMatchX = [ 0 ];
var approachPercentageMatch = [ 0 ];
var approachTagFetchTime = [ 0 ];
var groundTagFetchTime = [ 0 ];
var $element = $( '[type="range"]' );

for( var i  = $element.length - 1; i >=0; i -- )
    valueOutput( $element[i] );

$(document).on( 'change', 'input[type="range"]', function( e ) {
    valueOutput( e.target );
} );

$element.rangeslider( {
    polyfill : false
} );

var drawGraph = function() {
    $( '#percentageMatchGraph' ).html( "" );
    var r = Raphael("percentageMatchGraph");
    r.text(100, 50, "Percentage Match");
    var lines = r.linechart( 20, 60, 300, 220, [ percentageMatchX ], [ approachPercentageMatch ], {
        nostroke: false,
        axis: "0 0 1 1",
        symbol: "circle",
        smooth: true
    } ).hoverColumn( function () {
        this.tags = r.set();
        for (var i = 0, ii = this.y.length; i < ii; i++) {
            this.tags.push( r.tag( this.x, this.y[ i ], this.values[ i ], 160, 10 ).insertBefore( this ).attr( [ { fill: "#fff" }, { fill: this.symbols[i].attr("fill") } ] ) );
        }
    }, function () {
        this.tags && this.tags.remove();
    } );
    r.text( 400, 50, "Tag Fetch Time");
    var lines = r.linechart( 340, 60, 300, 220, [ percentageMatchX ], [ approachTagFetchTime, groundTagFetchTime ], {
        nostroke: false,
        axis: "0 0 1 1",
        symbol: "circle",
        smooth: true
    } ).hoverColumn(function () {
        this.tags = r.set();
        for (var i = 0, ii = this.y.length; i < ii; i++) {
            this.tags.push( r.tag( this.x, this.y[ i ], this.values[ i ], 160, 10 ).insertBefore( this ).attr( [ { fill: "#fff" }, { fill: this.symbols[i].attr("fill") } ] ) );
        }
    }, function () {
        this.tags && this.tags.remove();
    } );

    lines.symbols.attr({ r: 6 });
};

setInterval( function fetchTrends() {
    $.post( '/fetch_trends', {
	'sourceName' : dataSource,
	'approachList' : JSON.stringify( { 'list' : selectedApproaches } ),
    }, function ( data ) {
        console.dir( data );
	    if ( data ) {
	        var html = '<table><tr><td colspan = "2">Trends</td></tr><tr><td> ' + dataSource + ' </td><td> Ground Truth </td></tr>';
	        var tags = data.approaches[ 0 ].tags;
	        var groundTruth = data.groundTruth.tags;
	        for( var i = 0; i < tags.length; i ++ ) {
		        html += '<tr><td>' + tags[ i ].text + '</td><td>' + ( i < groundTruth.length ? groundTruth[ i ].text : '' ) + '</td></tr>';
	        }
	        html += '</table>';
	        $( '#trend_list' ).html(  html );
            percentageMatchX.push( percentageMatchX[ percentageMatchX.length - 1 ] + 1  );
            approachPercentageMatch.push( data.approaches[ 0 ].percentageMatch );
            approachTagFetchTime.push( data.approaches[ 0 ].time );
            groundTagFetchTime.push( data.groundTruth.time );
            drawGraph();
	    }
    } );
        return fetchTrends;
}(), 30000 );

$( '#cronSchedule' ).val( cronSchedulingTime ).change();
$( '#dataRate' ).val( dataRateValue ).change();

$( '#cronSchedule' ).change( function() {
    $.post( '/sink/changeScoreRate', { scoreRate : $( '#cronSchedule' ).val() } );
} );

$( '#dataRate' ).change( function() {
    $.post( '/source/data_rate' , { scoreRate : $( '#dataRate' ).val() } );
} );
