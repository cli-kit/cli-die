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

* `filter: -f, --filter [name...`: Filter columns, only include named columns.
* `cmdonly: -c, --cmd`: Executable name only in command column. 
* `uid: -U [uid`: Display processes for a real uid.
* `username: -u [username`: Display processes for a username.

### Kill

Matched patterns are resolved to a list of process ids (pids) and each pid is sent `${opt_signal_long}`.

By default `process.kill()` is used which does not allow for any error reporting, for better error handling use the `${opt_exec_long}` option to send signals using kill(1).

When `${opt_noop_long}` is specified the behaviour is the same as the `${cmd_match_long}` command.

#### Options

* `pids: -p, --pid-file`: Read pattern(s) from file(s).
* `signal: -s, --signal [signal`: Send signal (default TERM).
* `exec: -e, --exec`: Execute kill(1) not process.kill().
* `long: -l, --long`: Include more information (long listing).
* `noop: --noop`: Print matched processes, no not send a signal.

#### Signals

Signals may be specified lowercase or uppercase with or without a `SIG` prefix. Numeric signals are resolved for the following list:

* HUP 1
* INT 2
* QUIT 3
* ABRT 6
* KILL 9
* ALRM 14
* TERM 15

### Match

#### Options

* `long: -l, --long`: Include more information (long listing).
* `pids: -p, --pid-file`: Read pattern(s) from file(s).

## Usage

The default arguments passed to ps(1) are `-axf`.

To change the arguments for ps(1) use '--' followed by the arguments, for example:

```
$0 c
$0 c -- -ax
```

Column names output by ps(1) are converted to lowercase.

## Patterns

Patterns are strings that are converted to regular expressions. Be sure to single quote patterns as they often contain shell special characters.

If a pattern is a valid integer it is treated as a pid and will only ever match the pid column, it is not wrapped as a regular expression.

If a pattern argument does not appear to be a regular expression (//gim) then if is wrapped as a regular expression exact match such that `tail` is converted to `/^tail$/`.

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
