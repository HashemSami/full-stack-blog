import md5 from "md5";
import validator from "validator";
import bcrypt from "bcryptjs";
import { User, UserDb } from "../models";
import { ObjectId } from "mongodb";

import UsersDatabase from "../data-layer/user.access";

export const getAvatar = (email: string) => {
  return `https://gravatar.com/avatar/${md5(email)}?s=128`;
};

// ==========================================================================
const cleanUp = (userData: User): User => {
  if (typeof userData.username != "string") {
    userData.username = "";
  }
  if (typeof userData.email != "string") {
    userData.email = "";
  }
  if (typeof userData.password != "string") {
    userData.password = "";
  }

  return {
    _id: userData._id,
    username: userData.username.trim().toLowerCase(),
    email: userData.email.trim().toLowerCase(),
    password: userData.password,
    avatar: "",
  };
};

// ==========================================================================
// we need to wrap our validator in a promise so that when we use
// this function anyware with await, it will make sure all of the code
// inside the validator function will be executed first
const validate = async (
  userData: User,
  errorState: () => [string[], (err: string) => void],
  userDb: UserDb
) => {
  return new Promise(async (resolve, reject) => {
    const { username, password, email } = userData;
    const [errData, errors] = errorState();

    if (username == "") {
      errors("You must provide a username.");
    }
    if (username != "" && !validator.isAlphanumeric(username)) {
      errors("Username can only contain letters and numbers.");
    }
    if (!validator.isEmail(email)) {
      errors("You must provide a valid email address.");
    }
    if (password == "") {
      errors("You must provide a password.");
    }
    if (password.length > 0 && password.length < 12) {
      errors("Password must be at least 12 characters.");
    }
    if (password.length > 50) {
      errors("Password cannot exceed 50 characters.");
    }
    if (username.length > 0 && username.length < 3) {
      errors("Username must be at least 3 characters.");
    }
    if (username.length > 30) {
      errors("Username cannot exceed 30 characters.");
    }

    // Only if username is valid then check to see if it's already taken
    if (
      username.length > 2 &&
      username.length < 31 &&
      validator.isAlphanumeric(username)
    ) {
      let usernameExists = await userDb.findByUsername(username);
      if (usernameExists) {
        errors("That username is already taken.");
      }
    }

    // Only if email is valid then check to see if it's already taken
    if (validator.isEmail(email)) {
      let emailExists = await userDb.findByEmail(email);
      if (emailExists) {
        errors("That e-mail is already taken.");
      }
    }
    resolve("");
  });
};

// ==========================================================================
const login = async (
  userState: () => [User, (newData: User) => void],
  userDb: UserDb
) => {
  return new Promise((resolve, reject) => {
    const [userData, setUserData] = userState();

    userDb
      .findByUsername(userData.username)
      .then(attemptedUser => {
        if (
          attemptedUser &&
          bcrypt.compareSync(userData.password, attemptedUser.password)
        ) {
          console.log("attemptedUser", attemptedUser);
          setUserData({
            ...attemptedUser,
            avatar: getAvatar(attemptedUser.email),
          });
          // this.getAvatar()
          resolve("Congrats!");
        } else {
          reject("Invalid username / password.");
        }
      })
      .catch(function (e) {
        reject("Please try again later.");
      });
  });
};

// ==========================================================================
const register = async (
  userState: () => [User, (newData: User) => void],
  errorState: () => [string[], (err: string) => void],
  userDb: UserDb
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const [userData, setUserData] = userState();
    const [errorData, addErrors] = errorState();

    // Step #1: Validate user data
    await validate(userData, errorState, userDb);

    // Step #2: Only if there are no validation errors
    // then save the user data into a database
    if (!errorData.length) {
      // hash user password
      let salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(userData.password, salt);

      const createdUser = await userDb.insertUser({
        ...userData,
        password: hashedPassword,
      });

      const newId = createdUser ? createdUser.insertedId : userData._id;

      setUserData({
        ...userData,
        _id: newId,
        password: hashedPassword,
        avatar: getAvatar(userData.email),
      });
      console.log("sucss", userData);

      resolve();
    } else {
      console.log("failed;,", userData);
      reject(errorData);
    }
  });
};

// ==========================================================================

// Attached functions

const findByUsername = (
  username: string,
  userDb: UserDb
): Promise<{
  _id: ObjectId;
  username: string;
  avatar: string;
}> => {
  // const userDb = UsersDatabase();

  return new Promise((resolve, reject) => {
    if (typeof username != "string") {
      reject();
      return;
    }

    userDb
      .findByUsername(username)
      .then(userDoc => {
        if (userDoc) {
          const userData = {
            _id: userDoc._id,
            username: userDoc.username,
            avatar: getAvatar(userDoc.email),
          };
          resolve(userData);
        } else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
  });
};

const doesEmailExist = (email: string, userDb: UserDb): Promise<boolean> => {
  // const userDb = UsersDatabase();

  return new Promise(async (rejects, resolve) => {
    if (typeof email != "string") {
      resolve(false);
      return;
    }

    const user = await userDb.findByEmail(email);

    if (user) {
      resolve(true);
    }
    resolve(false);
  });
};

// ==========================================================================

const addContent = (data: User, userDb: UserDb) => {
  let userData: User = cleanUp(data);

  const getUserData = () => userData;

  const userState = (): [User, (newData: User) => void] => {
    const setUserData = (newData: User) => {
      Object.assign(userData, newData);
    };

    return [userData, setUserData];
  };

  const errors: string[] = [];
  const errorState = (): [string[], (err: string) => void] => {
    const addError = (err: string) => {
      errors.push(err);
    };

    return [errors, addError];
  };

  return {
    getData: () => getUserData(),
    login: () => login(userState, userDb),
    register: () => register(userState, errorState, userDb),
  };
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const user = () => {
  const userDb = UsersDatabase();

  return {
    addContent: (data: User) => addContent(data, userDb),
    findByUsername: (username: string) => findByUsername(username, userDb),
    doesEmailExist: (email: string) => doesEmailExist(email, userDb),
  };
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
