import HttpStatus from 'http-status-codes';

const SuperUserMiddleware = {
  validateSuperUser: (req, res, next) => {
    console.log(`Start validating user: ${req.headers.authorization}`);
    const auth = req.headers.authorization.replace('Basic ', '');

    const encodedUser = Buffer.from(
      `${process.env.SUPER_USER_USERNAME}:${process.env.SUPER_USER_PASSWORD}`,
    ).toString('base64');

    if (auth === encodedUser) {
      console.log(`User : ${req.headers.authorization} has access to the resources.`)
      req.user = {
        username: process.env.SUPER_USER_USERNAME,
      }
      next();
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).send('Invalid authorization.');
    }
  }
}

export default SuperUserMiddleware;