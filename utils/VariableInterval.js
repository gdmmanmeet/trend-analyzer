var setVariableInterval = function( callbackFunc,datarate ) {
    var variableInterval = {
        dataRate : datarate,
        callback : callbackFunc,
        stopped : false,
        offset : 0,
        runLoop : function() {
            if ( variableInterval.stopped )
                return;
            variableInterval.callback( variableInterval.dataRate, variableInterval.offset );
            variableInterval.loop();
        },
        stop: function() {
            this.stopped = true;
            clearTimeout( this.timeout );
        },
        start:function() {
            return this.loop();
        },
        loop:function() {
            this.timeout = setTimeout( this.runLoop, 1000 );
            return this;
        },
        changeDataRate : function( newDataRate ) {
            this.dataRate = newDataRate;
        },
        setOffset : function( newOffset ) {
            this.offset = newOffset;
        }
    };
    return variableInterval.start();
}

exports.setInterval = setVariableInterval;
