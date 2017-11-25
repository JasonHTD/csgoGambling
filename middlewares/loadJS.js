module.exports = function(jsFiles) {
return function(req, res, next){
  res.locals.jsFiles = res.locals.jsFiles.concat(jsFiles);
  next();
}
}
