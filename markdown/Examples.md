# Examples
This section gives a few examples of using GitMirror within code as well as using
the command line interface (CLI). Each example is also executed on the command
line with the output shown from the command. The commands use the `--dry-run`
option to prevent actual mirroring of the repositories.

# Modes
GitMirror has two modes that it can be executed in: `Single Repository` and `Multi Repository`. The
[Single Repository Mode](#single-repository-mode) does not require a config file, whereas the 
[Multi Repository Mode](#multi-repository-mode) requires a config file.

## Single Repository Mode
As of v1.0.3, GitMirror accepts arguments to allow mirroring one repository without a configuration 
file. The mode accepts all normal arguments with the following modifications:

1. The `--input` argument is used as the origin of the repository to mirror. The value given is 
   implied when in it is a git URL.
2. The `--mirrors` argument is used as a list of git URLs representing mirrors.
3. Two extra optional arguments are given:
   1. `--push`: specific branches to push to the mirrors [default: all]
   2. `--fetch`: for two-way syncs, the branches to fetch from the mirror [default: none]

### Example Execution
The following are a few examples of executing in single repository mode. For the sake of showing
an example, all examples use non-existent repositories `https://foo.git` and `https://bar.git`.

#### All Branches Mirror
This example mirrors all branches from `foo` to `bar`.

:::tabs

::tab[CLI]
```bash
gitmirror -i https://foo.git -m https://bar.git
```

::tab[Code]
```ts
// import the library
import GitMirror from '@neverending/gitmirror';

// create the object and pass options
const gm = new GitMirror({
  input: 'https://foo.git',
  mirrors: ['https://foo.git']
});

// execute the mirroring
gm.execute();
```

::tab[Output]
```txt
markugen.exec npm start -s -- -i https://foo.git -m https://bar.git --dry-run
```
:::

#### Specific Branch Mirror
This example mirrors the `main` branch from `foo` to `bar`.

:::tabs

::tab[CLI]
```bash
gitmirror -i https://foo.git -m https://bar.git --push main
```

::tab[Code]
```ts
// import the library
import GitMirror from '@neverending/gitmirror';

// create the object and pass options
const gm = new GitMirror({
  input: 'https://foo.git',
  mirrors: ['https://foo.git'],
  push: ['main']
});

// execute the mirroring
gm.execute();
```

::tab[Output]
```txt
markugen.exec npm start -s -- -i https://foo.git -m https://bar.git --push main --dry-run
```
:::

#### Two-Way Mirror
This example mirrors the `main` branch from `foo` to `bar` and fetches the `changes` branch from
`bar` to push to `foo`.

:::tabs

::tab[CLI]
```bash
gitmirror -i https://foo.git -m https://bar.git --push main --fetch changes
```

::tab[Code]
```ts
// import the library
import GitMirror from '@neverending/gitmirror';

// create the object and pass options
const gm = new GitMirror({
  input: 'https://foo.git',
  mirrors: ['https://foo.git'],
  push: ['main'],
  fetch: ['changes']
});

// execute the mirroring
gm.execute();
```

::tab[Output]
```txt
markugen.exec npm start -s -- -i https://foo.git -m https://bar.git --push main --fetch changes --dry-run
```
:::

## Multi Repository Mode
Execution requires a configuration file in JSON format. By default, the script will look for a file 
called `mirrors.json` in the current working directory. 

### JSON Configuration
The schema for the configuration file is published 
[here](https://raw.githubusercontent.com/falkorclark/gitmirror/main/schemas/mirrors.schema.json)
and shown below:

```json
markugen.import ../schemas/mirrors.schema.json
```

JSON schemas can be quite difficult to understand; therefore, the below JSON is a trimmed down 
version of the schema for better readability:

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

#### Origins
The top-level object contains the list of repositories to mirror. Any number of repositories may be 
given and the key for each will be used as the folder name for the clone and as the keyword for the 
`--repos` argument when explicitly syncing repositories.

#### Mirrors
Within the repository object, two keys must be provided: `origin` and `mirrors`. The `origin` key's 
value is the URL of teh repository being mirrored. The `mirrors` key's value is an object where 
each key in the object is a remote repository to mirror to. The keys in `mirrors` are used as the
keyword for the `--mirrors` argument when explicitly syncing mirrors.

Within the mirror object, one key is required: `url`. The `url` key's value is the location of the 
repository to mirror to. There are also two optional keys: `push` and `fetch`. The `push` key is a 
list of branches to push to the mirror (if not given, all branches are pushed). The `fetch` key is 
a list of branches to fetch from the mirror and push back to the origin (if not given, no branches 
will be fetched from the mirror).

### Example Execution
Typically, all that needs to be done is to execute the `gitmirror` command. Any errors that occur 
will have to be handled independently. The following are a few examples of executing in multi 
repository mode:

  1. Sync everything: `gitmirror`
  2. Only sync repo1 and repo2: `gitmirror -r repo1 repo2`
  3. Only sync mirror1 and mirror2: `gitmirror -m mirror1 mirror2`
  4. Only sync repo1 to mirror1: `gitmirror -r repo1 -m mirror1`
  5. Supply location of config file: `gitmirror -i myconfig.json`

The following is an example config file that is contained in the GitMirror repository and executed
as a baseline test. These repositories actually exist and you are welcome to use this config file
to test with or as a starting point for your configuration:

```json
markugen.import ../tests/mirrors.json
```
