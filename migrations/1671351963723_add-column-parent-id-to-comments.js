exports.up = (pgm) => {
  pgm.addColumns('comments', {
    parent_id: {
      type: 'VARCHAR(50)',
      references: '"comments"',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {};
