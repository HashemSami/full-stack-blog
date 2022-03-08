import React, { useReducer } from "react";
import { PostItem } from "../../models";
import { useParams } from "react-router-dom";

type EditActions =
  | { type: "fetchComplete"; value: PostItem }
  | {
      type: "titleChange" | "bodyChange" | "titleRules" | "bodyRules";
      value: string;
    }
  | {
      type:
        | "submitRequest"
        | "saveRequestStarted"
        | "saveRequestFinished"
        | "notFound";
    };

interface State {
  title: {
    value: string;
    hasErrors: boolean;
    message: string;
  };
  body: {
    value: string;
    hasErrors: boolean;
    message: string;
  };
  isFetching: boolean;
  isSaving: boolean;
  id: string;
  sendCount: number;
  notFound: boolean;
}

const reducer = (state: State, action: EditActions): State => {
  switch (action.type) {
    case "fetchComplete":
      return {
        ...state,
        title: { ...state.title, value: action.value.title },
        body: { ...state.body, value: action.value.body },
        isFetching: false,
      };
    case "titleChange":
      return {
        ...state,
        title: { ...state.title, value: action.value, hasErrors: false },
      };
    case "bodyChange":
      return {
        ...state,
        body: { ...state.body, value: action.value, hasErrors: false },
      };
    case "submitRequest":
      if (!state.title.hasErrors && !state.body.hasErrors) {
        return { ...state, sendCount: state.sendCount + 1 };
      }
      return state;

    case "saveRequestStarted":
      if (!state.title.hasErrors && !state.body.hasErrors) {
        return { ...state, isSaving: true };
      }
      return state;
    case "saveRequestFinished":
      return { ...state, isSaving: false };
    case "titleRules":
      if (!action.value.trim()) {
        return {
          ...state,
          title: {
            ...state.title,
            hasErrors: true,
            message: "You must provide a title.",
          },
        };
      }
      return state;
    case "bodyRules":
      if (!action.value.trim()) {
        return {
          ...state,
          body: {
            ...state.body,
            hasErrors: true,
            message: "You must provide a title.",
          },
        };
      }
      return state;
    case "notFound":
      return { ...state, notFound: true };
    default:
      return state;
  }
};

export const useEditPostReducer = (): [
  typeof initialState,
  React.Dispatch<EditActions>
] => {
  const initialState: State = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id || "",
    sendCount: 0,
    notFound: false,
  };

  return useReducer(reducer, initialState);
};
