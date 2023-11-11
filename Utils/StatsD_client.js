const StatsD = require('node-statsd');
const statsd = new StatsD({
    host: 'localhost', // The hostname or IP of your StatsD server
    port: 8125, // Default StatsD port
    prefix: 'yourapp.',
    globalTags: { environment: process.env.NODE_ENV } // Optional global tags
});
module.exports = statsd;
