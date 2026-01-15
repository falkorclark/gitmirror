
/**
 * Configuration for a git mirror of a {@link GitRepo}
 */
export interface GitMirrorConfig
{
  url:string,
  push:string[],
  fetch?:string[],
}

/**
 * Configuration for a git repository
 */
export interface GitRepo 
{
  origin:string,
  mirrors:{
    [key:string]: GitMirrorConfig,
  },
}