exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    userId: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    commentId: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      references: '"comments"',
      onDelete: 'CASCADE',
    },
    threadId: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      references: '"threads"',
      onDelete: 'CASCADE',
    },
    liked: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
};
