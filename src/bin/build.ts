#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'fs-extra';
import { version } from '../../package.json';

function main()
{
  tsc();
  //docs();
}

/**
 * Generates the documentation
 */
// function docs()
// {
//   const mark = new Markugen();
//   mark.mdtohtml({
//     title: `RenameIt v${version}`,
//     input: 'markdown',
//     output: 'docs',
//     clearOutput: true,
//   });
// }

/**
 * Compiles the project using the typescript compiler
 */
function tsc() 
{
  fs.removeSync('./lib');
  const result = spawnSync(
    'npx', ['tsc', '-p', 'tsconfig.json'],
    {shell:true, encoding:'utf8'}
  );
  if (result.stdout) console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);
  return !result.error;
}

main();
