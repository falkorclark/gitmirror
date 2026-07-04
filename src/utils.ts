
/**
 * Converts a string to a regular expression
 * @param str the string to convert
 * @returns a regular expression object from the given string
 */
export function stringToRegex(str:string) 
{
  const match = str.match(/^([/~@;%#'])(.*?)\1([gimsuy]*)$/);
  if (match)
  {
    return new RegExp(
      match[2],
      match[3]
        // Filter redundant flags, to avoid exceptions
        .split('')
        .filter((char, pos, flagArr) => flagArr.indexOf(char) === pos)
        .join('')
    ) ;
  }
  return new RegExp(str);
}

/**
 * @param url the path to parse
 * @returns the name of the repository at the given url
 */
export function repoName(url:string)
{
  const name = url.split('/').filter(e => e).pop() ?? '';
  return name.replace('.git', '');
}
