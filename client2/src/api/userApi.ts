import Axios, { AxiosResponse, CancelTokenSource } from "axios";
import { PostItem, FollowersData } from "../models";

interface UserData {
  token: string;
  username: string;
  avatar: string;
}

export const checkToken = (
  token: string
): [() => Promise<boolean | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<boolean | undefined, any> = await Axios.post(
        `/user/checkToken`,
        { token },
        { cancelToken: requestToken.token }
      );
      console.log(res.data);
      return res.data;
    };

    return [sendRequest, requestToken];
  } catch (e) {
    console.log("there was an error");
    return [];
  }
};

export const registerUser = (
  username: string,
  email: string,
  password: string
): [() => Promise<UserData | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<UserData | undefined, any> = await Axios.post(
        `/user/register`,
        { username, email, password },
        { cancelToken: requestToken.token }
      );
      console.log(res.data);
      console.log("user created");
      return res.data;
    };

    return [sendRequest, requestToken];
  } catch (e) {
    console.log("there was an error");
    return [];
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const res: AxiosResponse<UserData, any> = await Axios.post("/user/login", {
      username,
      password,
    });
    return res.data;
  } catch (e) {
    console.log("there was an error");
  }
};

interface ProfileData {
  profileUsername: string;
  profileAvatar: string;
  isFollowing: boolean;
  counts: { postCount: number; followerCount: number; followingCount: number };
}
export const getProfileData = (
  username: string,
  token: string
): [() => Promise<ProfileData | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<ProfileData, any> = await Axios.post(
        `/user/profile/${username}`,
        {
          token,
        }
      );

      return res.data;
    };

    return [sendRequest, requestToken];
  } catch (e) {
    console.log("there was an error");
    return [];
  }
};

export const getUserPosts = (
  username: string
): [() => Promise<PostItem[] | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<PostItem[] | undefined, any> = await Axios.get(
        `/user/profile/${username}/posts`,
        { cancelToken: requestToken.token }
      );
      console.log(res.data);
      return res.data;
    };

    return [sendRequest, requestToken];
  } catch (e) {
    console.log("there was an error");
    return [];
  }
};

export const getUserFollowers = (
  username: string
): [() => Promise<FollowersData[] | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<FollowersData[] | undefined, any> =
        await Axios.get(`/user/profile/${username}/followers`, {
          cancelToken: requestToken.token,
        });
      console.log(res.data);
      return res.data;
    };

    return [sendRequest, requestToken];
  } catch (e) {
    console.log("there was an error");
    return [];
  }
};

export const getUserFollowings = (
  username: string
): [() => Promise<FollowersData[] | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<FollowersData[] | undefined, any> =
        await Axios.get(`/user/profile/${username}/following`, {
          cancelToken: requestToken.token,
        });
      console.log(res.data);
      return res.data;
    };

    return [sendRequest, requestToken];
  } catch (e) {
    console.log("there was an error");
    return [];
  }
};

export const getHomeFeed = (
  token: string
): [() => Promise<PostItem[] | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<PostItem[], any> = await Axios.post(
        `/user/get-home-feed`,
        {
          token,
        },
        {
          cancelToken: requestToken.token,
        }
      );

      return res.data;
    };

    return [sendRequest, requestToken];
  } catch (e) {
    console.log("there was an error");
    return [];
  }
};

export const doesUsernameExist = (
  username: string
): [() => Promise<boolean | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<boolean, any> = await Axios.post(
        `/user/doesUsernameExist`,
        {
          username,
        },
        {
          cancelToken: requestToken.token,
        }
      );

      console.log(res.data);
      return res.data;
    };

    return [sendRequest, requestToken];
  } catch (e) {
    console.log("there was an error");
    return [];
  }
};

export const doesEmailExist = (
  email: string
): [() => Promise<boolean | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<boolean, any> = await Axios.post(
        `/user/doesEmailExist`,
        {
          email,
        },
        {
          cancelToken: requestToken.token,
        }
      );

      console.log(res.data);
      return res.data;
    };

    return [sendRequest, requestToken];
  } catch (e) {
    console.log("there was an error");
    return [];
  }
};
