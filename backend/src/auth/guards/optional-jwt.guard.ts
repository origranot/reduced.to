import { AuthGuard } from '@nestjs/passport';

export class OptionalJwtGuard extends AuthGuard('jwt') {
  // Overrides the 'handleRequest' method to prevent throwing an error and always returns the user.
  handleRequest(err, user) {
    return user;
  }
}
