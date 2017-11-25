module.exports = function(cssFiles){
  return function(req, res, next){
    res.locals.cssFiles = res.locals.cssFiles.concat(cssFiles);
    next();
  }
}
