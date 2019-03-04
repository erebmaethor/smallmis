module.exports = async (request, h, err) => {
  return h
    .response(err.details[0].message)
    .code(400)
    .takeover();
};

// this function will be rewrited to provide advanced error reporting to frontend
// later
