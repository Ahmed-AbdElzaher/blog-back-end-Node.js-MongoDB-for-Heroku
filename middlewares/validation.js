const validateUser = (req, res, next) => {
    const {title} = req.body;
    if(!title){
      next('new Error')
    }
    next();
  };


// لسة محتاجه تتهندل ص20


module.exports = {
    validateUser
}
