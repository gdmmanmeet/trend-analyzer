var conn = require( '../../connection' );
var mongodb = require( 'mongodb' );

var upsert = function( options ) {

    conn.getConnection( 'hybrid_approach_db', function( client ) {

	var score = options[ 'score' ];
	var collection = mongodb.Collection( client, 'hybrid_tag_collection' );

	collection.update( { 'text' : score.text }, { '$set' : score }, { "upsert" : true }, function( err, numOfRows ) {

	    if ( err ) {
	    }

	} );

    } );

}

var fetchAll = function( options ) {

    conn.getConnection( 'hybrid_approach_db', function( client ) {

        var collection = mongodb.Collection( client, 'hybrid_tag_collection' );
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

    conn.getConnection( 'hybrid_approach_db', function( client ) {

        var collection = mongodb.Collection( client, 'hybrid_tag_collection' );
        var tags = options[ 'tags' ];
	var messageCollection = mongodb.Collection( client, 'hybrid_message_collection' );

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
    conn.getConnection( 'hybrid_approach_db', function( client ) {
	var collection  = mongodb.Collection( client, 'hybrid_tag_collection' );
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
	    trends.approaches.push( {
		'approach' : 'z',
		'tags' : tags,
		'time' : new Date().getTime() - options[ 'requestTime' ]
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
