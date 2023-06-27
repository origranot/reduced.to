import { JwtAuthGuard } from './jwt.guard';

export class OptionalJwtAuthGuard extends JwtAuthGuard {
  // Overrides the 'handleRequest' method to prevent throwing an error and always returns the user.
  handleRequest(err: any, user: any) {
    return user;
  }
}
