#!/usr/bin/env node

const socket = require('socket.io');
const httpProxy = require('http-proxy');
const packagejson = require('../package.json');
const fs = require('fs');


// this tool works as CLI.
const argv = require('yargs')
  .version(packagejson.version)
  .usage('Usage: $0 <target url> [options...]')
  .options({
    'cwd': { type: 'string', default: () => process.cwd(), desc: 'Working directory' },
    'port': { type: 'number', alias: 'p', default: 4000, desc: 'A port to use' },
  })
  .example('$0 http://localhost:8000 --port 8080')
  .help().argv;

const proxy = httpProxy.createProxyServer({
  target: argv._[0],
}).listen(argv.port);
