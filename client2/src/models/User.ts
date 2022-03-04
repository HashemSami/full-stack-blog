import { UserProfile } from "./UserProfile";

export interface User {
  isLoggedIn: boolean;
  username: string;
  token: string;
  avatar: string;
  userProfile: UserProfile;
}
