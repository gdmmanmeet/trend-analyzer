var index = require( './index.js' );
var variableInterval = require( '../utils/VariableInterval' );
var http = require( 'http' );
var querystring = require( 'querystring' );

function getDataSourceList() {
    return Object.keys( index.dataSources );
}

function initDataSource( options ) {
    var sourceName = options[ 'sourceName' ];
    var dataSource;
    var dataRate = options[ 'dataRate' ];

    dataSource = require( index.dataSources[ sourceName ] );

    GLOBAL.datasourceInterval = variableInterval.setInterval( function( dataRate, offset ) {
	dataSource.fetch( {
	    'sourceName' : sourceName,
	    'dataRate' : dataRate,
	    'offset' : offset,
	    'callback' : throwData
	} );
    }, dataRate );

}

function throwData( options ) {
    var data = options[ 'data' ];

    GLOBAL.datasourceInterval.setOffset( options[ 'offset' ] );
    var req = http.request( {
	    "host" : "localhost",
	    "hostname" : "localhost",
	    "port" : "8888",
	    "method" : "POST",
	    "path" : "/final/sink/handle"
    } );
    req.on( 'error', function( e ) {
    } );
    req.write( querystring.stringify( {
        'messages' : JSON.stringify( data )
    } ) );
    req.end();

}

function fetchGroundTruth( options ) {
    var sourceName = options[ 'sourceName' ];
    if( ! dataSources[ sourceName ] ) {
        dataSource = require( index.dataSources[ sourceName ] );
        dataSources[ sourceName ] = dataSource;
    }
    else
        dataSource = dataSources[ sourceName ];
    options[ 'offset' ] = GLOBAL.datasourceInterval.offset;
    return dataSource.fetchGroundTruth( options );

}

function route ( segments, response, postData ) {
    switch( segments[ 2 ] ) {
	case "data_rate" :
	    changeDataRate( segments, response, postData );
	    break;
    }
}

function changeDataRate( segments, response, postData ) {
    if ( postData ) {
	var parsedData  = querystring.parse( postData );
	GLOBAL.datasourceInterval.changeDataRate( parsedData[ 'dataRate' ] );

    }
    else {
    }
    response.end();

}

exports.getDataSourceList = getDataSourceList;
exports.initDataSource = initDataSource;
exports.route = route;
exports.fetchGroundTruth = fetchGroundTruth;