
/**
 * Configuration for a git mirror of a {@link GitRepo}
 */
export interface GitMirrorTarget
{
  url:string,
  push?:string[],
  fetch?:string[],
}

export type GitMirrorTargets = Record<string, GitMirrorTarget>;

/**
 * Configuration for a git repository
 */
export interface GitRepoConfig
{
  origin: string;
  mirrors: GitMirrorTargets;
}

export type GitMirrorConfig = Record<string, GitRepoConfig>;