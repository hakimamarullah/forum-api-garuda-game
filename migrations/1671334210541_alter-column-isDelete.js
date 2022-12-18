/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.alterColumn('comments', 'isDelete', {
    type: 'boolean',
    default: false,
  });
};
