var index = require( './index' );
var dataController = require( index.handle.sink );
var dataSource = require( index.handle.source );
var querystring = require( 'querystring' );
var mustache = require( 'mustache' );
var util = require( 'util' );
var fs = require( 'fs' );
var path = require( 'path' );

function route( segments, response, postData ) {
    switch( segments[ 1 ] ) {
        case "approach":
            singleApproachView( segments, response, postData );
            break;
	case "static" :
	    loadStaticView( segments, response, postData );
	    break;
	case "fetch_trends" :
	    fetchTrends( segments, response, postData );
	    break;
        default:
            mainView( segments, response, postData );
            break;
    }
}

function mainView( segments, response, postData ) {
    var dataSources = dataSource.getDataSourceList();
    var approachList = dataController.getApproachList();

    response.writeHead(200, { "content-type" : "text/html" } );
    var data = fs.readFile( index.templateDirectory + 'index.html', 'utf8', function( err, data ) {
	if( err ) {
	}
	else {
	    response.write( mustache.to_html( data.toString(), {
		dataSources : dataSources,
		approachList : approachList
	    } ) );
	    response.end();
	}
    } );
}

function singleApproachView( segments, response, postData ) {
    if ( postData ) {

	    var parsedData  = querystring.parse( postData );
	    var approachList = JSON.parse( parsedData.approachList ).list;

	    dataSource.initDataSource( {
	        'sourceName' : parsedData.sourceName,
	        'dataRate' : parsedData.dataRate,
	        'approachList' : approachList
	    } );

	    dataController.setCron( {
	        'approachList' : approachList,
	        'scoreRate' : parsedData.scoreRate
	    } );

	    response.writeHead( 200, { "content-type" : "text/html" } );
	    var data = fs.readFile( index.templateDirectory + 'singleApproachView.html', 'utf8', function( err, data ) {
	        if( err ) {
	        }
	        else {
		        response.write( mustache.to_html( data.toString(), {} ) );
		        response.end();
            }
	    } );
    }
    else {
    }
}

function loadStaticView( segments, response, postData ) {

    var filePath = index.staticDirectory + segments.slice( 2 ).join( '/' );
    var data = fs.readFileSync( filePath, 'utf8' );

    switch( path.extname( filePath ) ){

        case '.css':
            response.writeHead( 200, { "content-type" : "text/css" } );
            break;
        case '.js':
            response.writeHead( 200, { "content-type" : "text/javascript" } );
            break;
        default:
            response.writeHead( 200, { "content-type" : "text" } );

    }

    response.write( data );
    response.end();
}

function fetchTrends( segments, response, postData ) {
    if ( postData ) {

	var parsedData  = querystring.parse( postData );
	var trends = {};
	dataSource.fetchGroundTruth( {
	    'sourceName' : parsedData.sourceName,
	    'trends' : trends,
	    'requestTime' : new Date().getTime(),
	    'callback' : function( options ) {
		options.trends.approaches = [];
		dataController.fetchTrends( {
		    'approachList' : JSON.parse( parsedData.approachList ).list,
		    'trends' : options[ 'trends' ],
		    'callback' : function( options ) {
                response.writeHead( 200, { "content-type" : "application/json" } );
			    response.write( JSON.stringify( options ['trends' ] ) );
			    response.end();
		    }
		} );
	    }
	} );

    }
    else {
    }
}

exports.route = route;
