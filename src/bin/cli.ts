#!/usr/bin/env node

import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import GitMirrorCommand from '../gitmirrorcommand';
import GitMirror from '../gitmirror';

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
    .version('version', 'show version and exit', GitMirror.version)
    .alias({ help: ['h', '?'] })
    .command(new GitMirrorCommand)
    .scriptName(GitMirror.name)
    .parse();
}

// startup the main application
main();