import React, { FC, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { useActions } from "../../hooks/useActions";

import {
  doesUsernameExist,
  doesEmailExist,
  registerUser,
} from "../../api/userApi";
import { useRegisterReducer } from "./registerReducer";

import Page from "../page/Page.component";

const HomeGuest: FC = () => {
  const [state, dispatch] = useRegisterReducer();
  const { login, addFlashMessage } = useActions();

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(
        () => dispatch({ type: "usernameAfterDelay" }),
        2000
      );
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(
        () => dispatch({ type: "emailAfterDelay" }),
        2000
      );
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(
        () => dispatch({ type: "passwordAfterDelay" }),
        2000
      );
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.username.checkCount) {
      // send axios request here

      const [sendRequest, requestToken] = doesUsernameExist(
        state.username.value
      );

      const usernameCheckRequest = async () => {
        try {
          if (sendRequest) {
            const isExist = await sendRequest();

            dispatch({
              type: "usernameUniqueResults",
              value: isExist || false,
            });
          }
        } catch (e) {
          console.log("There was a problem");
        }
      };
      usernameCheckRequest();
      // cleaning after the api call to prevent memory leaks
      return () => {
        requestToken?.cancel();
      };
    }
  }, [state.username.checkCount]);

  useEffect(() => {
    if (state.email.checkCount) {
      // send axios request here
      console.log(state.email.value);
      const [sendRequest, requestToken] = doesEmailExist(state.email.value);

      const emailCheckRequest = async () => {
        try {
          if (sendRequest) {
            const isExist = await sendRequest();

            dispatch({
              type: "emailUniqueResults",
              value: isExist || false,
            });
          }
        } catch (e) {
          console.log("There was a problem");
        }
      };
      emailCheckRequest();
      // cleaning after the api call to prevent memory leaks
      return () => {
        requestToken?.cancel();
      };
    }
  }, [state.email.checkCount]);

  useEffect(() => {
    if (state.submitCount) {
      // send axios request here

      const [sendRequest, requestToken] = registerUser(
        state.username.value,
        state.email.value,
        state.password.value
      );

      const registerRequest = async () => {
        try {
          if (sendRequest) {
            const userData = await sendRequest();
            if (userData) {
              login(userData.token, userData.username, userData.avatar);
              addFlashMessage("welcomr to your new account!");
            }
          }
        } catch (e) {
          console.log("There was a problem");
        }
      };
      registerRequest();
      // cleaning after the api call to prevent memory leaks
      return () => {
        requestToken?.cancel();
      };
    }
  }, [state.submitCount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: "usernameImmediately", value: state.username.value });
    dispatch({ type: "usernameAfterDelay", noRequest: true });
    dispatch({ type: "emailImmediately", value: state.email.value });
    dispatch({ type: "emailAfterDelay", noRequest: true });
    dispatch({ type: "passwordImmediately", value: state.password.value });
    dispatch({ type: "passwordAfterDelay" });
    dispatch({ type: "submitForm" });
  };

  return (
    <Page title="Welcome!" wide>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                onChange={e =>
                  dispatch({
                    type: "usernameImmediately",
                    value: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.username.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                onChange={e =>
                  dispatch({ type: "emailImmediately", value: e.target.value })
                }
              />
              <CSSTransition
                in={state.email.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.email.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
                onChange={e =>
                  dispatch({
                    type: "passwordImmediately",
                    value: e.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.password.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.password.message}
                </div>
              </CSSTransition>
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default HomeGuest;
