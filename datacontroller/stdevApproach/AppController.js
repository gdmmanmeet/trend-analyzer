var stddevModel = require( './Stddev.js' );

function updateScores() {

    stddevModel.fetchAll( {
	'callback' : updatestddevValues
    } );

}

function updatestddevValues( options ) {

    var scores = options[ 'scores' ];

    if( scores )
        scores.forEach( function( score ) {

            if ( score['mean'] ) {
                var oldmean=score.mean;
            
                score[ 'mean' ] = ( score.total * score.mean + score.count )/( score.total + 1 );
                score[ 'total' ]++;
                score['std-dev'] = Math.sqrt((Math.pow((score.count-score.mean),2) + Math.pow(((score.total - 1) * (oldmean - score.mean)),2))/(score.total - 1));
                score['count'] = 0;
                stddevModel.upsert( {
                    "score" : score
                } );

            }

            else {

                score['mean'] = score.count;
                score['total'] = 1;
                score['count']=0;

                stddevModel.upsert( {
                    'score' : score
                } );

            }

        });
}

function changeConstants( options ) {
}

function handleData( options ) {
    stddevModel.storeData( options );
}

function fetchTrends( options ) {
    return stddevModel.trendingTopics( options );
}

exports.updateScores = updateScores;
exports.changeConstants = changeConstants;
exports.handleData = handleData;
exports.fetchTrends = fetchTrends;
