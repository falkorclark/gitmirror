#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'fs-extra';
import colors from 'colors';
import Markugen from '@neverending/markugen';
import { version } from '../../package.json';

function main()
{
  if (!tsc()) process.exit(1);
  docs();
}

// Generates the documentation
function docs()
{
  const mark = new Markugen();
  mark.mdtohtml({
    title: `GitMirror v${version}`,
    input: 'markdown',
    output: 'docs',
    clearOutput: true,
  });
}

// Compiles the project using the typescript compiler
function tsc() 
{
  fs.removeSync('./lib');
  const result = spawnSync('npx tsc -p tsconfig.json', {
    shell: true,
    encoding:'utf8',
    stdio: 'pipe'
  });
  const success = result.status === 0;
  if (success) console.log(colors.green('TypeScript compilation successful'));
  else console.error(colors.red('TypeScript compilation failed'));
  if (result.stdout) console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);
  return success;
}

main();
