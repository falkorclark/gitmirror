# Introduction 
This repository stores the scripts used to maintain git mirrors and a mirrors
file for the anyar mirrors.

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
name for the clone and as the keyword for the `--repos` argument when explciitly
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
Typically, all that needs to be done is to execute the sync.py script. Any 
errors that occur will have to be handled independently. On Windows, there is
a sync.bat script that will call `python sync.py` with the supplied arguments.
Additional help on executing the script can be output by passing any of three
arguments to the script: `-h`, `--help`, or `-?`.

## Example Execution
The following are a few examples of executing the script:

  1. Display help and exit: `python sync.py -?`
  2. Sync everything: `python sync.py`
  3. Only sync repo1 and repo2: `python sync.py -r repo1 repo2`
  4. Only sync mirror1 and mirror2: `python sync.py -m mirror1 mirror2`
  5. Only sync repo1 to mirror1: `python sync.py -r repo1 -m mirror1`
  6. Supply location of config file: `python sync.py -i myconfig.json`