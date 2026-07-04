#!/usr/bin/env node

import GitMirror, { GitMirrorOptions } from '../gitmirror';
import { GitMirrorYargs } from '../gitmirrorcommand';
import colors from 'colors';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import { version } from '../../package.json';

interface Options extends GitMirrorOptions
{
  tests: string[],
}

type TestFunc = (options:Options) => void;

async function main()
{
  const tests:Record<string, TestFunc> = {
    full: full,
    markugen: markugen,
    multi: multi,
  };

  const args = yargs(hideBin(process.argv))
    .parserConfiguration({
      'duplicate-arguments-array': false,
      'strip-aliased': true,
      'strip-dashed': true,
    })
    .help('help', 'show help and exit')
    .version('version', 'show version and exit', version)
    .alias({ help: ['h', '?'] })
    .options({
      ...GitMirrorYargs,
      tests: {
        alias: ['t'],
        describe: 'list of tests to include',
        type: 'array',
        choices: Object.keys(tests),
        default: Object.keys(tests),
      },
    })
    .parse() as unknown as Options;

  try
  {
    args.dryRun = true;
    args.input = './tests/mirrors.json';

    for (const test of args.tests)
    {
      console.group(colors.magenta('Testing:'), test);
      tests[test](args);
      console.groupEnd();
    }
  }
  catch(e:any) 
  { 
    console.error(colors.red(e.stack));
    process.exit(1);
  }
}

/**
 * Tests the full mirrors file
 * @param args the cli arguments
 */
function full(args:Options)
{
  GitMirror.mirror({...args});
}

/**
 * Tests the markugen repo
 * @param args the cli arguments
 */
function markugen(args:Options)
{
  GitMirror.mirror({...args, repos: ['markugen']});
}

/**
 * Tests multiple repositories
 * @param args the cli arguments
 */
function multi(args:Options)
{
  GitMirror.mirror({...args, repos: ['markugen', 'renameit']});
}

main();
