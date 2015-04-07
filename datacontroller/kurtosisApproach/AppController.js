var skewModel = require( './Kurtosis.js' );

function updateScores() {

    kurtosisModel.fetchAll( {
	'callback' : updatekurtosisValues
    } );

}

function updatekurtosisValues( options ) {

    var scores = options[ 'scores' ];

    scores.forEach( function( score ) {

        if ( score['mean'] ) {
            var oldmean=score.mean;
            
            score[ 'mean' ] = ( score.total * score.mean + score.count )/( score.total + 1 );
            score[ 'total' ]++;
            score['kurtosis'] = Math.sqrt(((Math.pow((score.count-score.mean),4) + Math.pow(((score.total - 1) * (oldmean - score.mean)),4))/N)/Math.pow(((Math.pow((score.count-score.mean),2) + Math.pow(((score.total - 1) * (oldmean - score.mean)),2))/score.total),2))-3;
            score['count'] = 0;
            kurtosisModel.upsert( {
                "score" : score
            } );

        }

        else {

            score['mean'] = score.count;
            score['total'] = 1;
            score['count']=0;

            kurtosisModel.upsert( {
                'score' : score
            } );

        }

    });
}

function changeConstants( options ) {
}

function handleData( options ) {
    kurtosisModel.storeData( options );
}

exports.updateScores = updateScores;
exports.changeConstants = changeConstants;
exports.handleData = handleData;
