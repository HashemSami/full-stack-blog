import { Follow, FollowDb, UserDb } from "../models";
import { ObjectId } from "mongodb";
import FollowsDatabase from "../data-layer/followAccess";
import UsersDatabase from "../data-layer/userAccess";

const cleanUp = (followedUsername: string) => {
  return typeof followedUsername != "string" ? "" : followedUsername;
};
// =====================================================================

const validate = async (
  action: "create" | "delete",
  followedUsername: string,
  followDataState: () => [Follow, (newData: Follow) => void],
  errors: (err: string) => void,
  followsDB: FollowDb,
  usersDB: UserDb
) => {
  // followedUsername must exist in database
  const [followsData, setFollowData] = followDataState();

  const followedAccount = await usersDB.findByUsername(followedUsername);

  if (followedAccount) {
    setFollowData({ ...followsData, followedId: followedAccount._id });
  } else {
    errors("You cannot follow a user that does not exist.");
  }

  const doesFollowAlreadyExist = await followsDB.findByFollowedId(followsData);

  if (action === "create") {
    if (doesFollowAlreadyExist) {
      errors("You are already following this user.");
    }
  }
  if (action === "delete") {
    if (!doesFollowAlreadyExist) {
      errors("You cannot stop following someone you do not already follow.");
    }
  }

  // should not be able to follow yourself
  if (followsData.followedId.equals(followsData.authorId)) {
    errors("You cannot follow yourself.");
  }
};
// =====================================================================
const createFollow = (
  username: string,
  followDataState: () => [Follow, (newData: Follow) => void],
  errorState: () => [string[], (err: string) => void],
  followsDB: FollowDb,
  usersDB: UserDb
) => {
  return new Promise(async (resolve, reject) => {
    const [followsData, setFollowData] = followDataState();
    const [errorData, addErrors] = errorState();

    const followedUsername = cleanUp(username);

    await validate(
      "create",
      followedUsername,
      followDataState,
      addErrors,
      followsDB,
      usersDB
    );

    if (errorData.length) {
      const res = await followsDB.insertFollow(followsData);

      if (res?.acknowledged) {
        resolve("success");
      }
    } else {
      reject(errorData);
    }
  });
};

// =====================================================================

const deleteFollow = (
  username: string,
  followDataState: () => [Follow, (newData: Follow) => void],
  errorState: () => [string[], (err: string) => void],
  followsDB: FollowDb,
  usersDB: UserDb
) => {
  return new Promise(async (resolve, reject) => {
    const [followsData, setFollowData] = followDataState();
    const [errorData, addErrors] = errorState();

    const followedUsername = cleanUp(username);

    await validate(
      "delete",
      followedUsername,
      followDataState,
      addErrors,
      followsDB,
      usersDB
    );

    if (errorData.length) {
      const res = await followsDB.deleteFollow(followsData);

      if (res?.acknowledged) {
        resolve("success");
      }
    } else {
      reject(errorData);
    }
  });
};
// =====================================================================

const isVisitorFollowing = async (
  followDataState: () => [Follow, (newData: Follow) => void],
  followsDB: FollowDb
) => {
  const [followsData, setFollowData] = followDataState();

  const followDoc = await followsDB.findByFollowedId(followsData);

  return !!followDoc;
};

// =====================================================================

const getFollowersById = (id: ObjectId, followsDB: FollowDb) => {
  return new Promise(async (resolve, reject) => {
    try {
      const folowers = await followsDB.getFollowers(id);

      resolve(folowers);
    } catch (e) {
      reject("no followers");
    }
  });
};

// =====================================================================

const getFollowingById = (id: ObjectId, followsDB: FollowDb) => {
  return new Promise(async (resolve, reject) => {
    try {
      const folowers = await followsDB.getFollowing(id);

      resolve(folowers);
    } catch (e) {
      reject("no followers");
    }
  });
};
// =====================================================================

const countFollowersById = (id: ObjectId, followsDB: FollowDb) => {
  return new Promise(async (resolve, reject) => {
    try {
      const folowersCount = await followsDB.countFollowers(id);

      resolve(folowersCount);
    } catch (e) {
      reject("no followers");
    }
  });
};
// =====================================================================

const countFollowingById = (id: ObjectId, followsDB: FollowDb) => {
  return new Promise(async (resolve, reject) => {
    try {
      const count = await followsDB.countFollowing(id);

      resolve(count);
    } catch (e) {
      reject("no followers");
    }
  });
};

export const follow = () => {
  const followsDB = FollowsDatabase();
  const usersDB = UsersDatabase();

  let followsData: Follow;

  const setFollowData = (data: Follow) => {
    followsData = data;
  };

  const followDataState = (): [Follow, (newData: Follow) => void] => {
    const setFollowData = (newData: Follow) => {
      Object.assign(followsData, newData);
    };

    return [followsData, setFollowData];
  };

  const errors: string[] = [];
  const errorState = (): [string[], (err: string) => void] => {
    const addError = (err: string) => {
      errors.push(err);
    };

    return [errors, addError];
  };

  return {
    setFollowData,
    createFollow: (followedUsername: "string") =>
      createFollow(
        followedUsername,
        followDataState,
        errorState,
        followsDB,
        usersDB
      ),
    deleteFollow: (followedUsername: "string") =>
      deleteFollow(
        followedUsername,
        followDataState,
        errorState,
        followsDB,
        usersDB
      ),
    isVisitorFollowing: () => isVisitorFollowing(followDataState, followsDB),
    getFollowersById: (id: ObjectId) => getFollowersById(id, followsDB),
    getFollowingById: (id: ObjectId) => getFollowingById(id, followsDB),
    countFollowersById: (id: ObjectId) => countFollowersById(id, followsDB),
    countFollowingById: (id: ObjectId) => countFollowersById(id, followsDB),
  };
};
