
import yargs, { CommandModule, Argv, ArgumentsCamelCase } from 'yargs';
import { GitMirrorOptions } from './gitmirroroptions';
import { description } from '../package.json';
import GitMirror from './gitmirror';
import colors from 'colors';

/**
 * Defined yargs arguments for the CLI
 */
export const GitMirrorYargs:Record<string, yargs.Options> = {
  input: {
    alias: ['i'],
    type: 'string',
    describe: 'JSON file containing the repositories to mirror',
    default: './mirrors.json',
  },
  output: {
    alias: ['o'],
    type: 'string',
    describe: 'folder path to clone the repositories to',
    default: './repos',
  },
  repos: {
    alias: ['r'],
    describe: 'list of repositories to limit the sync to',
    type: 'array',
  },
  mirrors: {
    alias: ['m'],
    describe: 'list of mirrors to limit the sync to',
    type: 'array',
  },
  color: {
    alias: ['c'],
    describe: 'console output will be colored',
    type: 'boolean',
    default: true
  },
  verbose: {
    alias: ['v'],
    describe: 'prints all commands to the console',
    type: 'boolean',
  },
  quiet: {
    alias: ['q'],
    describe: 'no output will be displayed',
    type: 'boolean',
  },
  'dry-run': {
    alias: ['d', 'dr', 'dry'],
    describe: 'does not execute, only prints what will happen, implies --verbose',
    type: 'boolean',
  },
};

/**
 * Command object for the CLI
 */
export default class GitMirrorCommand<U extends GitMirrorOptions> implements 
  CommandModule<object, U> 
{
  public command = ['$0'];
  public describe = description;

  public builder(args:Argv): Argv<U> 
  {
    args.options(GitMirrorYargs)
      .conflicts('quiet', 'verbose')
      .implies('dry-run', 'verbose');
    return args as unknown as Argv<U>;
  }

  public handler(args:ArgumentsCamelCase<U>)
  {
    // create the instance
    try 
    {
      GitMirror.mirror({...args, cli: true});
    }
    catch (e:any)
    { 
      console.error(`${colors.red(e.name)}: ${e.message}`);
      process.exit(1); 
    }
  }
}