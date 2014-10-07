$0
==

Kill groups of processes.

Executes ps(1) and parses the output to an object graph, patterns may then be matched against the graph.

## Synopsis

```synopsis
<args> <ptn...> -- <psargs> 
```

## Commands

* `column: column, c`: Print column names.
* `graph: graph, g <name...>`: Print parsed object graph.
* `match: match, m <ptn...>`: Print processes that match patterns.
* `kill: kill, k <ptn...>`: Kill processes that match patterns.

## Options

* `signal: -s, --signal [signal]`: Send signal (default TERM).
* `filter: -f, --filter [name...]`: Filter columns, only include named columns.
* `cmdonly: -c, --cmd`: Executable name only in command column. 
* `uid: -U [uid]`: Display processes for a real uid.
* `username: -u [username]`: Display processes for a username.
* `--print-columns`: Print column names.
* `noop: --noop`: Print matched processes.

## Usage

The default arguments passed to ps(1) are `-axf`.

To change the arguments for ps(1) use `--` followed by the arguments, for example:

```
$0 c
$0 c -- -ax
```

Column names are identical to the column titles output by ps(1) except they are converted to lowercase.

## Example

Print column names:

```
$0 c
```

Print parsed ps(1) object graph:

```
$0 g
```

Filter the parsed object graph and only show executable name:

```
$0 g -c pid cmd
```

## See

ps(1), kill(1)
