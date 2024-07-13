import { AuthService } from "../auth";
import { RepositoryProvider } from "./repositoryProvider";

export abstract class AuthServiceProvider {
  static authService = new AuthService({
    userRepository: RepositoryProvider.userRepository,
  });
}
