module.exports = function(req, res, next){
  if (req.session.username) {
    res.locals.navbar = [
      {
        title: "Logout",
        link: "logout"
      },
      {
        title: "Withdraw",
        link: "withdraw"
      },
      {
        title: "Deposit",
        link: "deposit"
      },
      {
        title: "Inventory",
        link: "inventory"
      },
      {
        title: "Cases",
        link: "crates"
      },
      {
        title: "Home",
        link: "home"
      }
    ];
  }
  else {
    res.locals.navbar = [
      {
        title: "Password Reset",
        link: "password-reset"
      },
      {
        title: "Register",
        link: "register"
      },
      {
        title: "Login",
        link: "login"
      },
      {
        title: "Landing",
        link: "landing"
      }
    ];
  }
  next();
}
