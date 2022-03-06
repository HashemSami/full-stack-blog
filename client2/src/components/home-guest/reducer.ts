import React, { useReducer } from "react";

type RegisterActions =
  | {
      type: "usernameImmediately" | "emailImmediately" | "passwordImmediately";
      value: string;
    }
  | { type: "usernameUniqueResults" | "emailUniqueResults"; value: boolean }
  | { type: "usernameAfterDelay" | "emailAfterDelay" | "passwordAfterDelay" };

const initialState = {
  username: {
    value: "",
    hasErrors: false,
    message: "",
    isUnique: false,
    checkCount: 0,
  },
  email: {
    value: "",
    hasErrors: false,
    message: "",
    isUnique: false,
    checkCount: 0,
  },
  password: {
    value: "",
    hasErrors: false,
    message: "",
  },
  submitCount: 0,
};

const reducer = (
  state: typeof initialState,
  action: RegisterActions
): typeof initialState => {
  switch (action.type) {
    case "usernameImmediately": {
      let hasErrors: boolean = false,
        message: string = state.username.message;

      if (action.value.length > 30) {
        hasErrors = true;
        message = "Username cannot exceed 30 characters.";
      }
      if (state.username.value && !/^([a-zA-z0-9]+)$/.test(action.value)) {
        hasErrors = true;
        message = "Username can only contain letters and numbers.";
      }

      return {
        ...state,
        username: {
          ...state.username,
          hasErrors,
          value: action.value,
          message,
        },
      };
    }

    case "usernameAfterDelay": {
      let hasErrors: boolean = state.username.hasErrors,
        message: string = state.username.message,
        checkCount: number = state.username.checkCount;

      if (state.username.value.length < 3) {
        hasErrors = true;
        message = "Username must be at least 3 character.";
      }
      if (!hasErrors) {
        checkCount += 1;
      }

      return {
        ...state,
        username: {
          ...state.username,
          hasErrors,
          message,
          checkCount,
        },
      };
    }

    case "usernameUniqueResults": {
      let hasErrors: boolean = state.username.hasErrors,
        isUnique: boolean = state.username.isUnique,
        message: string = state.username.message;

      if (action.value) {
        hasErrors = true;
        isUnique = false;
        message = "That username is already taken.";
      } else {
        isUnique = true;
      }

      return {
        ...state,
        username: {
          ...state.username,
          hasErrors,
          isUnique,
          message,
        },
      };
    }

    case "emailImmediately":
      return {
        ...state,
        email: { ...state.email, hasErrors: false, value: action.value },
      };

    case "emailAfterDelay": {
      let hasErrors: boolean = state.email.hasErrors,
        message: string = state.email.message,
        checkCount: number = state.email.checkCount;

      if (!/^\S+@\S+$/.test(state.email.value)) {
        hasErrors = true;
        message = "You must provide a valid email address.";
      }

      if (!hasErrors) {
        checkCount += 1;
      }

      return {
        ...state,
        email: { ...state.email, hasErrors, message, checkCount },
      };
    }

    case "emailUniqueResults": {
      let hasErrors: boolean = state.email.hasErrors,
        isUnique: boolean = state.email.isUnique,
        message: string = state.email.message;

      if (action.value) {
        hasErrors = true;
        isUnique = false;
        message = "That email is already taken.";
      } else {
        isUnique = true;
      }

      return {
        ...state,
        email: {
          ...state.email,
          hasErrors,
          isUnique,
          message,
        },
      };
    }
    case "passwordImmediately": {
      let hasErrors: boolean = false,
        message: string = state.username.message;
      return {
        ...state,
        password: {
          ...state.password,
          hasErrors: false,
          value: action.value,
        },
      };
    }

    // case "passwordAfterDelay":
    //   return;
    // case "submitForm":
    //   return;
    default:
      return state;
  }
};

export const useRegisterReducer = (): [
  typeof initialState,
  React.Dispatch<RegisterActions>
] => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return [state, dispatch];
};
