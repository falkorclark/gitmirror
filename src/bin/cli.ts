#!/usr/bin/env node

import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import { name, version } from '../../package.json';
import GitMirrorCommand from '../gitmirrorcommand';

// Handle startup
function main() 
{
  yargs(hideBin(process.argv))
    .parserConfiguration({
      'duplicate-arguments-array': false,
      'strip-aliased': true,
      'strip-dashed': true,
    })
    .help('help', 'show help and exit')
    .version('version', 'show version and exit', version)
    .alias({ help: ['h', '?'] })
    .command(new GitMirrorCommand)
    .scriptName(name)
    .parse();
}

// startup the main application
main();