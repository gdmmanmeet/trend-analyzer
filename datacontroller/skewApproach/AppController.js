var skewModel = require( './Skew.js' );

function updateScores() {

    skewModel.fetchAll( {
	'callback' : updateskewValues
    } );

}

function updateskewValues( options ) {

    var scores = options[ 'scores' ];

    scores.forEach( function( score ) {

        if ( score['mean'] ) {
            var oldmean=score.mean;
            
            score[ 'mean' ] = ( score.total * score.mean + score.count )/( score.total + 1 );
            score[ 'total' ]++;
            score['skew'] = Math.sqrt(((Math.pow((score.count-score.mean),3) + Math.pow(((score.total - 1) * (oldmean - score.mean)),3))/N)/Math.pow(((Math.pow((score.count-score.mean),2) + Math.pow(((score.total - 1) * (oldmean - score.mean)),2))/score.total),1.5));
            score['count'] = 0;
            skewModel.upsert( {
                "score" : score
            } );

        }

        else {

            score['mean'] = score.count;
            score['total'] = 1;
            score['count']=0;

            skewModel.upsert( {
                'score' : score
            } );

        }

    });
}

function changeConstants( options ) {
}

function handleData( options ) {
    skewModel.storeData( options );
}

exports.updateScores = updateScores;
exports.changeConstants = changeConstants;
exports.handleData = handleData;
