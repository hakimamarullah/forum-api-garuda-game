/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumns('threads', {
    date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addColumns('comments', {
    date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('threads', ['date']);
  pgm.dropColumns('comments', ['date']);
};
