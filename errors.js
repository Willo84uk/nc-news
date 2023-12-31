exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else if(err.code === "23503"){
    res.status(404).send({ msg: "cannot match provided data"})
  } else if(err.code === "2201X"){
    res.status(400).send({ msg: "page out of range"})
  } else if(err.code === "23505"){
    res.status(403).send({ msg: "topic already exists"})
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
};
