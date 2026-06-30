
/**
 * GitMirror configuration options
 */
export interface GitMirrorOptions
{
  /**
   * JSON file containing the repositories to mirror [default: ./mirrors.json] or
   * a git repository URL for command line mirror
   */
  input?:string,
  /**
   * mirrors to limit the sync to or URLs of mirrors when input is a URL
   */
  mirrors?:string[],
  /**
   * list of branches to push to the mirrors [default: all]
   */
  push?:string[],
  /**
   * list of branches to fetch from the mirrors [default: none]
   */
  fetch?:string[],
  /**
   * repositories to limit the sync to
   */
  repos?:string[],
  /**
   * folder path to clone the repositories to [default: ./repos]
   */
  output?:string,
  /**
   * if true, console output will be colored, else it will not
   */
  color?:boolean,
  /**
   * if true, all mirroring commands will be printed
   */
  verbose?:boolean,
  /**
   * if true, all output will be silenced
   */
  quiet?:boolean,
  /**
   * does not execute git commands, only prints the commands, implies --verbose
   */
  dryRun?:boolean,
  /**
   * used internally to tell if it was executed from the cli or not
   */
  cli?:boolean,
}

/**
 * Default options and their values
 */
export const DefaultOptions:Required<GitMirrorOptions> = {
  input: './mirrors.json',
  mirrors: [],
  push: [],
  fetch: [],
  repos: [],
  output: './repos',
  color: true,
  verbose: false,
  quiet: false,
  dryRun: false,
  cli: false,
};