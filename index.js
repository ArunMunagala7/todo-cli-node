#!/usr/bin/env node
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const Tasks = require('./src/tasks');

yargs(hideBin(process.argv))
  .scriptName('todo')
  .usage('$0 <cmd> [args]')

  // add command
  .command(
    'add <title>',
    'Add a new task',
    y => y
      .positional('title', { type: 'string', describe: 'Task title' })
      .option('p', { alias: 'priority', choices: ['low', 'med', 'high'], default: 'med' })
      .option('d', { alias: 'due', type: 'string', describe: 'YYYY-MM-DD' }),
    argv => Tasks.addTask(argv.title, argv.priority, argv.due)
      .catch(err => (console.error(err.message), process.exit(1)))
  )

  // list command
  .command(
    'list',
    'List tasks (default: pending)',
    y => y
      .option('all', { type: 'boolean', describe: 'Show all' })
      .option('done', { type: 'boolean', describe: 'Show only done' })
      .option('search', { type: 'string', describe: 'Search in title' }),
    argv => Tasks.listTasks(argv)
      .catch(err => (console.error(err.message), process.exit(1)))
  )

  // done command
  .command(
    'done <id>',
    'Mark a task as done',
    y => y.positional('id', { type: 'string' }),
    argv => Tasks.markDone(argv.id)
      .catch(err => (console.error(err.message), process.exit(1)))
  )

  // delete command
  .command(
    'delete <id>',
    'Delete a task',
    y => y.positional('id', { type: 'string' }),
    argv => Tasks.removeTask(argv.id)
      .catch(err => (console.error(err.message), process.exit(1)))
  )

  // edit command
  .command(
    'edit <id> [title]',
    'Edit a task',
    y => y
      .positional('id', { type: 'string' })
      .positional('title', { type: 'string', describe: 'New title (optional)' })
      .option('p', { alias: 'priority', choices: ['low', 'med', 'high'] })
      .option('d', { alias: 'due', type: 'string', describe: 'YYYY-MM-DD' })
      .option('u', { alias: 'undone', type: 'boolean', default: false, describe: 'Reopen task' }),
    argv => Tasks.editTask({
      id: argv.id,
      title: argv.title,
      priority: argv.priority,
      due: argv.due,
      undone: argv.undone
    }).catch(err => (console.error(err.message), process.exit(1)))
  )

  .demandCommand(1, 'Please provide a valid command.')
  .help()
  .strict()
  .parse();
