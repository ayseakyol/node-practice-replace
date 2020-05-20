const replace = (text, toReplace, withThis) => {
  // write me!
  const newText = text.split(toReplace).join(withThis);
  return newText;
};

module.exports = replace;
