exports.up = (pgm) => {
  pgm.dropColumns('comments', ['parent_id'], { ifExist: true });
};

exports.down = (pgm) => {

};
