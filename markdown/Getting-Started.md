# Getting Started
To get started using GitMirror in your project, you will need to first
install GitMirror globally or as a dependency within your project.

## Installation
To install GitMirror within your NodeJS project, execute one of the following
commands:

:::tabs
::tab[npm]
`npm install @neverending/gitmirror`
::tab[yarn]
`yarn add @neverending/gitmirror`
::tab[pnpm]
`pnpm add @neverending/gitmirror`
:::

GitMirror also provides a command line interface (CLI) that can be installed
globally by passing the `-g` or `--global` flag when installing.

# Options
The options provided to GitMirror are similar on the command line and within
code. The following sections show the available options in both instances.

## CLI Options
All available options/arguments can be viewed by executing one of the following
commands:

```bash
gitmirror help
# or
gitmirror --help
# or
gitmirror -h
# or
gitmirror -?
```

The help option will output the following message:

```
markugen.exec npm start -s -- help
```

## Code Options
The entire set of options available to the GitMirror class are shown in the below
code snippet:

```ts
markugen.import ../src/gitmirroroptions.ts
```
