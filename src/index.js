#!/usr/bin/env node

const cheerio = require('cheerio');
const httpProxy = require('http-proxy');
const packagejson = require('../package.json');
const fs = require('fs');


// this tool works as CLI.
function main() {
  require('yargs')
    .version(packagejson.version)
    .usage('Usage: $0 command [options...]')
    .command({
      command: 'start <target>',
      desc: 'start proxy server',
      builder: defineStartCommandOptions,
      handler: startProxyServer
    })
    .command({
      command: 'runscript',
      desc: 'run javascript',
      builder: defineRunScriptCommandOptions,
      handler: runScript
    })
    .example('$0 start http://localhost:8000 --port 8080')
    .example('$0 runscript -c "location.reload()"')
    .example('$0 runscript -f yourscript.js')
    .help().argv;
}

function defineStartCommandOptions(yargs) {
  yargs.positional('target', {
    type: 'string', describe: 'A proxy target URL. (ex: http://localhost:3000)'
  }).options({
    'port': { type: 'number', alias: 'p', default: 4000, desc: 'A port to use' }
  });
}

function startProxyServer(yargs) {
  const proxy = httpProxy.createProxyServer({
    target: yargs.target,
    selfHandleResponse: true
  });
  proxy.on('proxyRes', function(proxyRes, req, res) {
    let body = [];
    proxyRes.on('data', (chunk) => body.push(chunk));
    proxyRes.on('end', () => {
      const $ = cheerio.load(Buffer.concat(body).toString());
      $('body').append('<p>test</p>');
      res.end($.html());
    });
  });
  console.log('proxy server listening on port', yargs.port);
  proxy.listen(yargs.port);
}

function defineRunScriptCommandOptions(yargs) {
  yargs.options({
    'code': { type: 'string', alias: 'c', desc: 'javascript code' },
    'file': { type: 'string', alias: 'f', desc: 'javascript source file' }
  });
}

function runScript(yargs) {
  console.log('run javascript code.')
  if (yargs.code) {
    console.log('run this code:', yargs.code);
  } else if (yargs.file) {
    console.log('run this file:', yargs.file);
  } else {
    console.log('no code specified.');
  }
}

main();
