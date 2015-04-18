var conn = require( '../../connection' );
var mongodb = require( 'mongodb' );

var upsert = function( options ) {

    conn.getConnection( 'stddev_approach_db', function( client ) {

	var score = options[ 'score' ];
	var collection = mongodb.Collection( client, 'stddev_tag_collection' );

	collection.update( { 'text' : score.text }, { '$set' : score }, { "upsert" : true }, function( err, numOfRows ) {

	    if ( err ) {
	    }

	} );

    } );

}

var fetchAll = function( options ) {

    conn.getConnection( 'stddev_approach_db', function( client ) {

        var collection = mongodb.Collection( client, 'stddev_tag_collection' );
        var iter = collection.find();
	var callback = options[ 'callback' ];

        iter.toArray( function( err, data ) {

            if ( err ) {
            }

            else
		callback( {
		    'store' : data
		} );

        });

    });
}

var storeData = function( options ) {

    conn.getConnection( 'stddev_approach_db', function( client ) {

        var collection = mongodb.Collection( client, 'stddev_tag_collection' );
        var tags = options[ 'tags' ];
	var messageCollection = mongodb.Collection( client, 'stddev_message_collection' );

        tags.forEach( function( tag ) {
            collection.update( tag, { '$inc' : { 'count' : 1 } }, { 'upsert' : true }, function( err, numOfRows ) {
                if ( err ) {
                }
            } );
        } );

	messageCollection.insert( options[ 'messages' ], function(){} );

    });
}

var trendingTopics = function( options ) {
    var tags;
    var trends = options[ 'trends' ];
    var groundTruth = trends.groundTruth.tags;
    var groundTruthLength;
    var matchCount = 0;
    var i;
    var j;
    conn.getConnection( 'stddev_approach_db', function( client ) {
	var collection  = mongodb.Collection( client, 'stddev_tag_collection' );
        var iter = collection.find().sort( {
	        'score' : -1,
	        'variance' : -1
	    } ).limit( 10 );

        iter.toArray( function ( err, data ) {
            if ( err ) {
		        tags = [];
            }
            else {
		        tags = data;
            }
            groundTruthLength = groundTruth.length < tags.length ? groundTruth.length : tags.length;
            for( i = 0; i < groundTruthLength; i ++ ) {
                for( j = 0; j < tags.length; j ++ )
                    if( tags[ j ].text == groundTruth[ i ].text )
                        break;
                if( j < tags.length )
                    matchCount ++;
            }
	        trends.approaches.push( {
		        'approach' : 'standard deviation',
		        'tags' : tags,
		        'time' : new Date().getTime() - options[ 'requestTime' ],
                'percentageMatch' : matchCount / groundTruthLength * 100
	        } );
	        options[ 'callbackOptions' ].trends = trends;
	        options[ 'callback' ]( options[ 'callbackOptions' ] );
        } );
    } );
}

exports.upsert = upsert;
exports.fetchAll = fetchAll;
exports.storeData = storeData;
exports.trendingTopics = trendingTopics;
