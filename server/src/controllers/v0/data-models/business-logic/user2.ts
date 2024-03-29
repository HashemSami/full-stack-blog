import md5 from "md5";
import validator from "validator";
import bcrypt from "bcryptjs";
import { User, UserDb } from "../models";
import { ObjectId } from "mongodb";

import UserDatabase from "../data-layer/user.access";

const getAvatar = (email: string) => {
  return `https://gravatar.com/avatar/${md5(email)}?s=128`;
};

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
    ...userData,
    username: userData.username.trim().toLowerCase(),
    email: userData.email.trim().toLowerCase(),
    password: userData.password,
  };
};

// we need to wrap our validator in a promise so that when we use
// this function anyware with await, it will make sure all of the code
// inside the validator function will be executed first
const validate = async (
  userData: User,
  errors: (err: string) => void,
  userDb: UserDb
) => {
  return new Promise(async (resolve, reject) => {
    const { username, password, email } = userData;
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

const login = async (
  userData: User,
  setUserData: (newData: User) => void,
  userDb: UserDb
) => {
  return new Promise((resolve, reject) => {
    userDb
      .findByUsername(userData.username)
      .then(attemptedUser => {
        if (
          attemptedUser &&
          bcrypt.compareSync(userData.password, attemptedUser.password)
        ) {
          console.log("attemptedUser", attemptedUser);
          setUserData(attemptedUser);
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

const register = async (
  userData: User,
  errors: string[],
  addErrors: (err: string) => void,
  setUserData: (newData: User) => void,
  userDb: UserDb
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    // Step #1: Validate user data
    await validate(userData, addErrors, userDb);

    // Step #2: Only if there are no validation errors
    // then save the user data into a database
    if (!errors.length) {
      // hash user password
      let salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(userData.password, salt);
      // setHashPassword(hashedPassword);

      const createdUser = await userDb.insertUser({
        ...userData,
        password: hashedPassword,
      });

      const newId = createdUser ? createdUser.insertedId : userData._id;

      setUserData({ ...userData, _id: newId, password: hashedPassword });
      console.log(userData);

      resolve();
    } else {
      console.log(userData);
      reject(errors);
    }
  });
};

const findByUsername = (username: string, userDb: UserDb) => {
  return new Promise((resolve, reject) => {
    if (typeof username != "string") {
      reject();
      return;
    }

    userDb.findByUsername(username).then(userDoc => {
      if (userDoc) {
        resolve(userDoc);
      } else {
        reject();
      }
    });
  });
};

const doesEmailExist = (email: string, userDb: UserDb) => {
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

export const user = (data: User) => {
  const userDb = UserDatabase();

  const userData: User = cleanUp(data);
  const getUserData = () => userData;
  const setUserData = (newData: User) => {
    Object.assign(userData, newData);
  };

  const errors: string[] = [];
  const addError = (err: string) => {
    errors.push(err);
  };

  // const setHashPassword = (hashedPassword: string) => {
  //   Object.assign(userData, { password: hashedPassword });
  // };

  // const setId = (_id: ObjectId) => {
  //   Object.assign(userData, { _id: _id });
  // };

  return {
    getData: () => getUserData(),
    login: () => login(getUserData(), setUserData, userDb),
    register: () =>
      register(getUserData(), errors, addError, setUserData, userDb),
    doesEmailExist: (email: string) => doesEmailExist(email, userDb),
    findByUsername: (username: string) => findByUsername(username, userDb),
  };
};
