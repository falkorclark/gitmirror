#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'fs-extra';
import colors from 'colors';

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
  const result = spawnSync('npx tsc -p tsconfig.json', {
    shell: true,
    encoding:'utf8',
    stdio: 'pipe'
  });
  if (result.status !== 0)
  {
    console.error(colors.red('TypeScript compilation failed'));
    if (result.stderr) console.error(result.stderr);
    process.exit(result.status);
  }
  else 
  {
    console.log(colors.green('TypeScript compilation successful'));
    if (result.stdout) console.log(result.stdout);
  }
  return !result.error;
}

main();
