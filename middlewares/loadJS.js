module.exports = function(jsFiles) {
return function(req, res, next){

  res.locals.jsFiles = jsFiles;
  next();
}
}
