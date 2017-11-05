module.exports = function(cssFiles){
  return function(req, res, next){

    res.locals.cssFiles = cssFiles;
    next();
  }
}
