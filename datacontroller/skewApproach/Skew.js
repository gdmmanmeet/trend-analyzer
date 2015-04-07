var conn = require( '../../connection' );
var mongodb = require( 'mongodb' );

var upsert = function( options ) {

    conn.getConnection( 'skew_approach_db', function( client ) {

	var score = options[ 'score' ];
	var collection = mongodb.Collection( client, 'skew_tag_collection' );

	collection.update( { 'text' : score.text }, { '$set' : score }, { "upsert" : true }, function( err, numOfRows ) {

	    if ( err ) {
	    }

	} );

    } );

}

var fetchAll = function( options ) {

    conn.getConnection( 'skew_approach_db', function( client ) {

        var collection = mongodb.Collection( client, 'skew_tag_collection' );
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

    conn.getConnection( 'skew_approach_db', function( client ) {

        var collection = mongodb.Collection( client, 'skew_tag_collection' );
        var tags = options[ 'tags' ];
	var messageCollection = mongodb.Collection( client, 'skew_message_collection' );

        tags.forEach( function( tag ) {
            collection.update( tag, { '$inc' : { 'count' : 1 } }, { 'upsert' : true }, function( err, numOfRows ) {
                if ( err ) {
                }
            } );
        } );

	messageCollection.insert( options[ 'messages' ], function(){} );

    });
}

exports.upsert = upsert;
exports.fetchAll = fetchAll;
exports.storeData = storeData;
