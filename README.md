Table of Contents
=================

* [Die](#die)
  * [Install](#install)
  * [Test](#test)
  * [Manual](#manual)
  * [Usage](#usage)
  * [Help](#help)
  * [License](#license)

Die
===

Utility executable to kill multiple processes by regular expression pattern match.

Converts the output of ps(1) into an object graph and finds pids that match specified patterns.

## Install

```
npm i -g cli-die
```

## Test

```
npm test
```

## Manual

Run `die help` for the program manual.

## Usage

```
Usage: die <command>

where <command> is one of:
    column, c, graph, g, help, kill, k, match, m

die@0.1.10 /Users/cyberfunk/git/cli/die
```

## Help

```
Usage: die <args> <ptn...> -- <psargs>

Kill groups of processes.

Commands:
 column, c                Print column names.
 graph, g                 Print parsed object graph.
 match, m                 Print processes that match patterns.
 kill, k                  Kill processes that match patterns.
 help                     Show help for commands.

Options:
 -f, --filter=[name...    Filter columns, only include named columns.
 -c, --cmd                Executable name only in command column.
     --[no]-color         Enable or disable terminal colors.
     -U=[uid              Display processes for a real uid.
     -u=[username         Display processes for a username.
     --help               Display this help and exit.
     --version            Print version and exit.

Report bugs to muji <noop@xpm.io>.
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/freeformsystems/cli-die/blob/master/LICENSE) if you feel inclined.

Generated by [mdp(1)](https://github.com/freeformsystems/mdp).

[toolkit]: https://github.com/freeformsystems/cli-toolkit
[command]: https://github.com/freeformsystems/cli-command
