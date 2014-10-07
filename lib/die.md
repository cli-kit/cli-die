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

* `filter: -f, --filter [name...]`: Filter columns, only include named columns.
* `cmdonly: -c, --cmd`: Executable name only in command column. 
* `uid: -U [uid]`: Display processes for a real uid.
* `username: -u [username]`: Display processes for a username.

### Kill

Matched patterns are resolved to a list of process ids (pids) and each pid is sent `${opt_signal_long}`.

By default `process.kill()` is used which does not allow for any error reporting, for better error handling use the `${opt_exec_long}` option to send signals using kill(1).

#### Options

* `noop: --noop`: Print matched processes, no not send a signal.
* `long: -l, --long`: Include more information (long listing).
* `exec: -e, --exec`: Execute kill(1) not process.kill().
* `signal: -s, --signal [signal]`: Send signal (default TERM).

### Match

#### Options

* `long: -l, --long`: Include more information (long listing).

## Usage

The default arguments passed to ps(1) are `-axf`.

To change the arguments for ps(1) use '--' followed by the arguments, for example:

```
$0 c
$0 c -- -ax
```

Column names output by ps(1) are converted to lowercase.

## Example

Print column names:

```
$0 c
```

Print parsed object graph:

```
$0 g
```

Print list of all executable names:

```
$0 g -c cmd
```

Print the `pid` and `cmd` nodes of the graph:

```
$0 g pid cmd
```

Print process matches:

```
$0 m '/^tail'
$0 m -c tail
```

Send TERM to matched process pids:

```
$0 k -c tail
```

Send INT to matched process pids:

```
$0 k -c tail -s int
```

## See

ps(1), kill(1)
