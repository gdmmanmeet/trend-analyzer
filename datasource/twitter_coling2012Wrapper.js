var conn = require( '../connection' );
var mongodb = require( 'mongodb' );

var fetch = function( options ){
    conn.getConnection( 'twitter_colling1', function( client ) {

	var dataSource = options.sourceName;
    var collection = mongodb.Collection( client, dataSource );
    var offset;
	if( ! options.offset )
	    offset = { 'timestamp' : 1 };
	else
	    offset = options.offset;
	if( ! options.offset.messages || !options[ 'offset'].messages.length ) {
		var messages = collection.find( { 'timestamp' : options[ 'offset' ].timestamp } );
		messages.toArray( function( err, data ) {
		    if ( err ) {
		    }
		    else {
			offset.messages = data;
			offset.timestamp ++;
			offset.intervalsLeft = 60 / options[ 'dataRate' ];
            options[ 'callback' ]( {
			    'data' : data.splice( 0, data.length / offset.intervalsLeft -- ),
			    'offset' : offset,
			    'approachList' : options[ 'approachList' ]
			} );
		    }
		} );
	}
	else
	    options[ 'callback' ] ( {
		'data' : offset.messages.splice( 0, offset.messages.length / offset.intervalsLeft -- ),
		'offset' : offset,
		'approachList' : options[ 'approachList' ]
	    } );
    //console.log( options.dataRate );
    } );
}

var fetchTrend = function( options ) {
    conn.getConnection( 'twitter_colling_truth', function( client ) {
	var trends = options[ 'trends' ];
	var collection = mongodb.Collection( client, options[ 'sourceName' ] );
	var tags = collection.find( { 'timestamp' : options.offset.timestamp } );
	tags.toArray( function( err, data ) {
	    if( err ) {
	    }
	    else {
		trends.groundTruth = {
		    'tags' : data,
		    'time' : new Date().getTime() - options[ 'requestTime' ]
		};
		options[ 'callback' ]( { 'trends' : trends } );
	    }
	} );
    } );
}

exports.fetch = fetch;
exports.fetchGroundTruth = fetchTrend;
