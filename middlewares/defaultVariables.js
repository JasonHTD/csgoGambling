module.exports = function(req, res, next) {

res.locals.cssFiles = [];
res.locals.jsFiles = [];
next();
return;
}
