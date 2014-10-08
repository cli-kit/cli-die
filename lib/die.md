$0
==

Kill groups of processes.

Executes ps(1) and parses the output to an object graph, patterns may then be matched against the graph, a signal may be sent to the matched process(es) using the `${cmd_kill_long}` command.

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

By default `process.kill()` is used, specify the `${opt_exec_long}` option to send signals using kill(1).

Errors encountered when attempting to kill processes are reported and the rest of the execution is aborted, use `${opt_relax_pipe}` to ignore these errors and continue to send signals. This is useful when using the `${opt_pids_long}` option and the processes may or may not be running.

When `${opt_noop_long}` is specified the behaviour is the same as the `${cmd_match_long}` command.

#### Options

* `pids: -p, --pid-file [file...]`: Read pattern(s) from file(s).
* `signal: -s, --signal [signal]`: Send signal (default TERM).
* `exec: -e, --exec`: Execute kill(1) not process.kill().
* `long: -l, --long`: Include more information (long listing).
* `relax: -r, --relax`: Ignore kill errors. 
* `noop: --noop`: Print matched processes, do not send a signal.

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
* `pids: -p, --pid-file [file...]`: Read pattern(s) from file(s).

## Usage

The default arguments passed to ps(1) are `-axf`.

The `${opt_uid_short}`, `${opt_username_short}` and `${opt_cmdonly_short}` options are proxied to ps(1).

To change the arguments for ps(1) use '--' followed by the arguments, for example:

```
$0 c
$0 c -- -ax
```

If you wish to invoke ps(1) with no arguments the argument list can be cleared with:

```
$0 c --
```

Note this overrides all other options specified and *forces* an empty argument list.

Column names output by ps(1) are converted to lowercase.

When the `${opt_uid_short}` or `${opt_username_short}` options are used they are passed to ps(1), if the existing argument list contains 'a' it is removed to ensure only the processes owned by the specified user are listed.

## Patterns

Patterns are strings that are converted to regular expressions. Be sure to single quote patterns as they often contain shell special characters.

If a pattern is a valid integer it is treated as a pid and will only ever match the pid column, it is not wrapped as a regular expression.

If a pattern argument does not appear to be a regular expression (//gim) then if is wrapped as a regular expression exact match such that `tail` is converted to `/^tail$/`.

When the `${opt_pids_long}` option is used each line in each file is expanded to a pattern, empty lines are discarded and lines that start with a '#' are discarded as comment lines, whitespace is allowed before the '#' character.

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
