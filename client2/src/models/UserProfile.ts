export interface UserProfile {
  username: string;
  avatar: string;
  isFollowing: false;
  counts: { postCount: number; followerCount: number; followingCount: number };
}

export interface FollowersData {
  username: string;
  email: string;
  avatar: string;
}
