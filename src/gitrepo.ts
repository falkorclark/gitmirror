
/**
 * Configuration for a git mirror of a {@link GitRepo}
 */
export interface GitMirrorConfig
{
  url:string,
  push?:string[],
  fetch?:string[],
}

/**
 * Configuration for the list of mirrors
 */
export interface GitMirrors
{
  [key:string]: GitMirrorConfig,
}

/**
 * Configuration for a git repository
 */
export interface GitRepo 
{
  origin:string,
  mirrors:GitMirrors,
}