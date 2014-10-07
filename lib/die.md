$0
==

Kill groups of processes.

Executes ps(1) and parses the output to an object graph, patterns may then be matched against the graph.

## Synopsis

```synopsis
<args> <ptn...> -- <psargs> 
```

## Options

* `signal: -s, --signal [signal]`: Use signal (default TERM).
* `include: -i, --include [name...]`: Include columns in match.
* `exclude: -e, --exclude [name...]`: Exclude columns from match.
* `uid: -U [uid]`: Display processes for real <uid>.
* `username: -u [username]`: Display processes for <username>.
* `--print-columns`: Print column names.
* `noop: --noop`: Print matched processes.

## Usage

The default arguments passed to ps(1) are `-axf`.

To change the arguments for ps(1) use `--` followed by the arguments, for example:

```
$0 ${opt_print_columns_long}
$0 ${opt_print_columns_long} -- -ax
```

Column names are identical to the column titles output by ps(1) except they are converted to lowercase.

## See

ps(1), kill(1)
