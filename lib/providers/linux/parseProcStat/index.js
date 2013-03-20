var fs = require('fs');

module.exports = function parseProcStat(procVersion) {

    var STAT_INDEXES = selectStatIndexes(); 

    return function procStat(procStatContent, callback) {

        if(!STAT_INDEXES) {
            return callback(new Error('Unsupported Linux version.\n Please submit an issue with your distro version: https://github.com/arunoda/node-usage/issues'));
        }

        var parts = procStatContent.split(' ');
        var statObject = {
            stime: parseFloat(parts[STAT_INDEXES.STIME]),
            utime: parseFloat(parts[STAT_INDEXES.UTIME]),
            startTime: parseFloat(parts[STAT_INDEXES.START_TIME]),
            rss: parseFloat(parts[STAT_INDEXES.RSS])
        };
        callback(null, statObject);
    };
};

function selectStatIndexes () {
    
    var procVersion = fs.readFileSync('/proc/version', 'utf8');
    var providers = [
        require('./ubuntu')
    ];

    for(var lc=0; lc<providers.length; lc++) {
        var result = providers[lc](procVersion);
        if(result) {
            return result;
        }
    }
}