/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('reply', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },

    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    isDelete: {
      type: 'boolean',
      default: false,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    threadId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"threads"',
      onDelete: 'CASCADE',
    },
    parentId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"comments"',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('reply');
};
