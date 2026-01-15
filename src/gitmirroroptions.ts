
/**
 * GitMirror configuration options
 */
export interface GitMirrorOptions
{
  /**
   * JSON file containing the repositories to mirror [default: ./mirrors.json]
   */
  input?:string,
  /**
   * folder path to clone the repositories to [default: ./repos]
   */
  output?:string,
  /**
   * repositories to limit the sync to
   */
  repos?:string[],
  /**
   * mirrors to limit the sync to
   */
  mirrors?:string[],
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
  output: './repos',
  repos: [],
  mirrors: [],
  color: true,
  verbose: false,
  quiet: false,
  dryRun: false,
  cli: false,
};