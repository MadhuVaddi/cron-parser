const args = process.argv;
const Parser = require('./src/parser');


if (args.length !== 3) {
    throw new Error('Invalid arguments. Usage: node cron.js <cron-expression>');
}

// The cron is wrapped in quotes
const results = Parser.parse(args.slice(2, 3)[0]);
const printFormat = Parser.formatOutput(results);
console.log(printFormat);