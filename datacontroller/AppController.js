var index = require( './index' );
var cron = require( 'cron' );
var querystring = require( 'querystring' );

function getApproachList() {
    return Object.keys( index.availableApproaches );
}

function setCron( options ) {

    var approachList = options[ 'approachList' ];
    var scoreRate = options[ 'scoreRate' ];
    var approach;
    var approachName;

    GLOBAL.dataControllerCron = new cron.CronJob ( '1 */' + scoreRate +' * * * *', function() {

	for( var i in approachList ) {
	    approachName = approachList[ i ];
	    approach = require( index.availableApproaches[ approachName ] );
	    approach.updateScores();
	}

    }, null, true );

    GLOBAL.dataControllerCron.start();

}

function fetchTrends( options ) {
    var approachList = options[ 'approachList' ];
    var approach;
    if( approachList && approachList.length ){
	var approachName = approachList.pop();
	approach = require( index.availableApproaches[ approachName ] );

	options[ 'approachList' ] = approachList;
	approach.fetchTrends( {
	    'trends' : options[ 'trends' ],
	    'requestTime' : new Date().getTime(),
	    'callback' : fetchTrends,
	    'callbackOptions' : options
	} );
    }
    else {
	options[ 'callback' ]( { 'trends' : options[ 'trends' ] } );
    }
}

function route ( segments, response, postData ) {
    switch( segments[ 2 ] ) {
	case "constants" :
	    changeConstants( segments, response, postData );
	    break;
	case "data" :
	    handleData( segments, response, postData );
	    break;
    }
}

function changeConstants( segments, response, postData ) {
    if( postData ) {

	var parsedData = querystring.parse( postData );
	var approach = require( index.availableApproaches[ approachName ] );

	approach.changeConstants( parsedData[ 'constants' ] );

    }
    else {
    }
    response.end();

}

function handleData( segments, response, postData ) {

    if( postData ) {

	var parsedData = querystring.parse( postData );
	var messages = JSON.parse( parsedData[ 'messages' ] );
	var approachList = JSON.parse( parsedData[ 'approachList' ] )[ 'list' ];
	var tags = [];
	var approach, i;

	for( i in messages ) {
	    var tweet = messages[ i ];
	    if( tweet.entities )
		tweet.entities.hashtags = tweet.entities.hashtags.map( function( hashtag ) {
		    hashtag = hashtag.toLowerCase();
		    tags.push( { "text" : hashtag } );
		    return hashtag;
		} );
	}


	for( i in approachList ) {
	    var approachName = approachList[ i ];
	    approach = require( index.availableApproaches[ approachName ] );

	    approach.handleData( {
		'messages' : messages,
		'tags' : tags
	    } );

	}

	response.end();
    }
    else {
    }
}

exports.getApproachList = getApproachList;
exports.setCron = setCron;
exports.route = route;
exports.fetchTrends = fetchTrends;