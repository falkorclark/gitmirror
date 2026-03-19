# GitMirror 

> Cross-platform command line utility for maintaining Git mirrors

The GitMirror project is a lightweight script for maintaining mirrors of
git repositories on multiple different servers.

## Installation

```sh
npm install @neverending/gitmirror
# or
yarn add @neverending/gitmirror
# or
pnpm add @neverending/gitmirror
```

GitMirror also provides a command line interface (CLI) that can be installed
globally by passing the `-g` flag when installing.

# Configuration
Execution of the sync script requires a configuration file in JSON format. By
default, the script will look for a file called **mirrors.json** in the current
working directory. The schema for the configuration file is as follows:

```json
{
  "repo": {
    "origin": "URL to repository being mirrored",
    "mirrors": {
      "mirror": {
        "url": "URL to repository to mirror to",
        "push": ["list of branches to push [optional]"],
        "fetch": ["list of branches to fetch for two-way sync [optional]"]
      }
    }
  }
}
```

## Origins
The top-level object contains the list of repositories to mirror. Any number
of repositories may be given and the key for each will be used as the folder 
name for the clone and as the keyword for the `--repos` argument when explicitly
syncing repositories.

## Mirrors
Within the repository object, two keys must be provided: **origin** and 
**mirrors**. The **origin** key's value is the URL of teh repository being 
mirrored. The **mirrors** key's value is an object where each key in the object
is a remote repository to mirror to. The keys in **mirrors** are used as the
keyword for the `--mirrors` argument when explicitly syncing mirrors.

Within the mirror object, one key is required: **url**. The **url** key's value
is the location of the repository to mirror to. There are also two optional
keys: **push** and **fetch**. The **push** key is a list of branches to push to 
the mirror (if not given, all branches are pushed). The **fetch** key is a list
of branches to fetch from the mirror and push back to the origin (if not given,
no branches will be fetched from the mirror).

# Execution
Typically, all that needs to be done is to execute the `gitmirror` command. Any 
errors that occur will have to be handled independently.
Additional help on executing the script can be output by passing any of three
arguments to the script: `-h`, `--help`, or `-?`.

## Example Execution
The following are a few examples of executing the script:

  1. Display help and exit: `gitmirror -?`
  2. Sync everything: `gitmirror`
  3. Only sync repo1 and repo2: `gitmirror -r repo1 repo2`
  4. Only sync mirror1 and mirror2: `gitmirror -m mirror1 mirror2`
  5. Only sync repo1 to mirror1: `gitmirror -r repo1 -m mirror1`
  6. Supply location of config file: `gitmirror -i myconfig.json`
