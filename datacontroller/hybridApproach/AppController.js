var hybridModel = require( './Hybrid.js' );

function updateScores() {

    hybridModel.fetchAll( {
	'callback' : updateZValues
    } );

}

function updateHybridValues( options ) {

    var scores = options[ 'scores' ];

    scores.forEach( function( score ) {

        if ( score['mean'] ) {
            score[ 'mean' ] = ( score.total * score.mean + score.count )/( score.total + 1 );
            score[ 'variance' ] = Math.sqrt( ( score.total * score.variance * score.variance + score.count * score.count ) / ( score.total + 1 ) );
            score[ 'total' ]++;
            score[ 'hybrid-score' ] = ( 0.7 * score.count - score.mean * 0.3 ) / 0.3* score.variance + 10000;
            score['count'] = 0;

            hybridModel.upsert( {
                "score" : score
            } );

        }

        else {

            score['mean'] = score.count;
            score['variance'] = score.count;
            score['total'] = 1;
            score['hybrid-score'] = 10000;
            score['count']=0;

            hybridModel.upsert( {
                'score' : score
            } );

        }

    });
}

function changeConstants( options ) {
}

function handleData( options ) {
    hybridModel.storeData( options );
}

function fetchTrends( options ) {
    return hybridModel.trendingTopics( options );
}

exports.updateScores = updateScores;
exports.changeConstants = changeConstants;
exports.handleData = handleData;
exports.fetchTrends = fetchTrends;
