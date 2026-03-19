
import { version, name } from '../package.json';
import { GitMirrorOptions, DefaultOptions } from './gitmirroroptions';
import colors from 'colors';
import fs from 'fs-extra';
import path from 'node:path';
import { spawnSync, SpawnSyncReturns, StdioOptions } from 'node:child_process';
import { GitMirrors, GitRepo } from './gitrepo';

export * from './gitmirroroptions';

interface Reset
{
  color?:boolean,
  log?:(...args:any[]) => void,
  group?:(...args:any[]) => void,
  groupEnd?:() => void,
}

export default class GitMirror
{
  /**
   * The version of the app
   */
  public static readonly version:string = version;
  /**
   * The name of the app
   */
  public static readonly name:string = name.replace('@neverending/', '');

  /**
   * Options passed to {@link GitMirror}
   */
  private _options:Required<GitMirrorOptions> = {...DefaultOptions};
  /**
   * Stores the options to reset after execute
   */
  private _reset:Reset = {};

  /**
   * Creates the object
   * @param options the {@link GitMirrorOptions} to use
   */
  public constructor(options?:GitMirrorOptions)
  {
    if (options) this.options = options;
  }

  /**
   * @returns the current configuration options
   */
  private get options():Required<GitMirrorOptions> { return this._options; }
  /**
   * Sets the configuration options
   */
  private set options(options:GitMirrorOptions)
  {
    // reset options
    this._options = {...DefaultOptions};
    // set the options that were given
    for (const [key, value] of Object.entries(options)) 
      (this._options as any)[key] = value;

    // update option for dry run
    if (this._options.dryRun)
    {
      this._options.quiet = false;
      this._options.verbose = true;
    }

    // resolve the paths
    this._options.input = path.resolve(this.options.input).replace(/\\/g, '/');
    this._options.output = path.resolve(this.options.output).replace(/\\/g, '/');
  }

  /**
   * Executes the mirrors with the given options
   * @param options the options to use when executing
   */
  public static mirror(options:GitMirrorOptions)
  {
    const git = new GitMirror(options);
    git.execute();
  }

  /**
   * Executes with the current {@link GitMirrorOptions}
   */
  public execute()
  {
    this.preExecute();

    if (!fs.existsSync(this.options.input))
    {
      this.error(`Input path does not exist [${colors.yellow(this.options.input)}]`);
      process.exit(1);
    }

    // read in the configuration
    const repos:Record<string, GitRepo> = fs.readJSONSync(this.options.input);
    // create the output path
    if (!fs.existsSync(this.options.output)) fs.ensureDirSync(this.options.output);

    // handle all teh repos
    for(const [name, repo] of Object.entries(repos))
    {
      // skip repos not given
      if (this.options.repos.length && !this.options.repos.includes(name)) continue;
      this.group('Repository', name);
      this.sync(name, repo);
      console.groupEnd();
    }

    this.postExecute();
  }
  /**
   * Setup for execute
   */
  private preExecute()
  {
    this._reset.color = colors.enabled;
    // enable/disable console colors
    if (this.options.color) colors.enable();
    else colors.disable();

    // handle quiet mode
    if (this.options.quiet)
    {
      this._reset.log = console.log;
      this._reset.group = console.group;
      this._reset.groupEnd = console.groupEnd;
      console.log = (...data:any) => {};
      console.group = (...data:any) => {};
      console.groupEnd = () => {};
    }
  }
  /**
   * Cleanup after execute
   */
  private postExecute()
  {
    if (this._reset.color != undefined) colors.enabled = this._reset.color;
    if (this._reset.log) console.log = this._reset.log;
    if (this._reset.group) console.group = this._reset.group;
    if (this._reset.groupEnd) console.groupEnd = this._reset.groupEnd;
  }

  /**
   * Executes the git command
   * @param args the arguments to pass to the git command
   * @param wd the working directory to execute the command in
   * @param quiet executes the command with no output
   * @returns the result of the executed command
   */
  private git(args:string[], wd:string|undefined = undefined):SpawnSyncReturns<string>|undefined
  {
    if (this.options.verbose) this.log('Executing', `git ${args.join(' ')}`);
    if (this.options.dryRun) return undefined;
    const opts:StdioOptions = this.options.verbose ? 'inherit' : 'pipe';
    const result = spawnSync('git', args, {
      shell:true, encoding:'utf8', cwd: wd, stdio: opts
    });
    return result;
  }

  /**
   * Fetches the given remote or modifies it if it already exists
   * @param remote the name of the remote to fetch
   * @param url the url of the repository
   * @param wd the working directory of the commands
   * @returns the result of the executed command
   */
  private gitRemote(remote:string, url:string, wd:string):SpawnSyncReturns<string>|undefined
  {
    const result = this.git(['remote', 'get-url', remote], wd);
    // remote does not exist yet
    if (!result || result.error || result.status !== 0)
      return this.git(['remote', 'add', '--mirror=fetch', remote, url], wd);
    return this.git(['remote', 'set-url', remote, url], wd);
  }

  /**
   * Syncs the given repository
   * @param name the name of the repository
   * @param repo the repository config
   * @returns true if successful, false otherwise
   */
  private sync(name:string, repo:GitRepo)
  {
    // get the origin
    if (!('origin' in repo))
      return this.missingKey(`{ "${name}": { ${colors.red('"origin": string')} } }`);
    // get the mirrors
    if (!('mirrors' in repo))
      return this.missingKey(`{ "${name}": { ${colors.red('"mirrors": {...}')} } }`);
    
    // adjust the mirrors based on user input
    let mirrors:GitMirrors = {};
    // adjust mirrors based on the requested list
    if (this.options.mirrors.length > 0)
    {
      for(const mirror of Object.keys(repo.mirrors))
        if (this.options.mirrors.includes(mirror))
          mirrors[mirror] = repo.mirrors[mirror];
    }
    else mirrors = repo.mirrors;
    // return if no mirrors
    if (Object.keys(mirrors).length == 0)
    {
      this.log('Skipping', colors.yellow('No requested mirrors'));
      return;
    }

    // initialize or fetch the latest from the repository
    const clone = this.options.output + '/' + name;
    if (!fs.existsSync(clone))
    {
      this.group('Initializing', clone);
      this.git(['clone', '--mirror', repo.origin, clone]);
      if (!fs.existsSync(clone) && !this.options.dryRun)
      {
        this.error(`Unable to clone [${colors.yellow(repo.origin)}]`);
        this.groupEnd();
        return;
      }
      this.groupEnd();
    }
    else
    {
      this.group('Fetching', repo.origin);
      this.git(['fetch', 'origin', '--prune', '-v'], clone);
      this.groupEnd();
    }

    // loop over all of the mirrors and perform the sync
    for(const [remote, config] of Object.entries(mirrors))
    {
      // must have a url
      if (!('url' in config))
      {
        this.missingKey(`{ "${name}": { "mirrors": { "${remote}": { ${colors.red('"url": string')} } } } }`);
        continue;
      }

      // fetch the mirror
      this.group('Remoting', name);
      const result = this.gitRemote(remote, config.url, clone);
      if (result && result.status != 0)
      {
        this.error(`Unable to remote [${colors.yellow(config.url)}]`);
        this.groupEnd();
        continue;
      }
      this.groupEnd();

      // push to the mirror
      let args = ['push', remote];
      if ('push' in config && Array.isArray(config.push) && config.push.length > 0)
        args = [...args, ...config.push];
      else args.push('--all', '--follow-tags');
      this.group('Pushing', `${name} -> ${remote}`);
      this.git([...args, '-v'], clone);
      this.groupEnd();

      // fetch from remote and push to origin
      if ('fetch' in config && Array.isArray(config.fetch) && config.fetch.length > 0)
      {
        this.group('Fetching', `${name} <- ${remote}`);
        this.git(['fetch', remote, ...config.fetch, '-v'], clone);
        this.groupEnd();
        this.group('Pushing', `${name} -> origin`);
        this.git(['push', 'origin', '-v'], clone);
        this.groupEnd();
      }
    }
  }

  /**
   * Outputs a log message
   * @param label the label to use
   * @param msg the message to output
   */
  private log(label:string, msg:string)
  {
    console.log(`${colors.green(label + ':')} ${msg}`);
  }
  /**
   * Outputs a group message
   * @param label the label to use
   * @param msg the message to output
   */
  private group(label:string, msg:string)
  {
    console.group(`${colors.green(label + ':')} ${msg}`);
  }
  /**
   * Ends a group that was started
   */
  private groupEnd() { console.groupEnd(); }
  /**
   * Outputs an error message
   * @param msg the message to output
   */
  private error(msg:string)
  {
    console.error(`${colors.red('Error:')} ${msg}`);
  }
  /**
   * Outputs a missing key error
   * @param json the json for the missing key
   */
  private missingKey(json:string)
  {
    this.error(`Missing required key ${colors.yellow(json)}`);
  }
}