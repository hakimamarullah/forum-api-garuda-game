exports.up = (pgm) => {
  pgm.alterColumn('comments', 'isDelete', {
    type: 'boolean',
    default: false,
  });
};

exports.down = (pgm) => {};
