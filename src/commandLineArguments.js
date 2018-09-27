const argv = require('minimist')(process.argv.slice(2));

const debug = () => argv.debug;
const help = () => argv.help || argv.h;

module.exports = { argv, debug, help };
