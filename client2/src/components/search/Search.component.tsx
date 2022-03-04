import React, { FC, useEffect, useState } from "react";
import { useActions } from "../../hooks/useActions";

import { useParams, Link } from "react-router-dom";
import { searchPost } from "../../api/postApi";
import { PostItem } from "../../models";

import PostTitleView from "../post-title-view/PostTitleView.component";

interface InitialState {
  searchTerm: string;
  results: PostItem[];
  show: "neither" | "loading" | "results";
  requestCount: number;
}

const Search: FC = () => {
  const { closeSearch } = useActions();

  const [state, setState] = useState<InitialState>({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    document.addEventListener("keyup", searchKeyPressHandler);

    return () => document.removeEventListener("keyup", searchKeyPressHandler);
  }, []);

  const searchKeyPressHandler = (e: KeyboardEvent) => {
    if (e.key == "Escape") {
      closeSearch();
    }
  };

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState({ ...state, show: "loading" });

      const delay = setTimeout(() => {
        setState({ ...state, requestCount: state.requestCount + 1 });
      }, 900);

      // because this useEffect will run each time the user type on the keboard
      // wee will delay the request to the server until the exact time has passed
      return () => clearTimeout(delay);
    } else {
      setState({ ...state, show: "neither" });
    }
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      // send axios request here

      const [sendRequest, requestToken] = searchPost(state.searchTerm);

      const sendSearchRequest = async () => {
        try {
          if (sendRequest) {
            const postItems = await sendRequest();

            if (postItems) {
              // navigate("/");
              setState({ ...state, results: postItems, show: "results" });
            } else {
              console.log("noooooot ");
              // dispatch({ type: "notFound" });
            }
          }
        } catch (e) {
          console.log("There was a problem");
        }
      };
      sendSearchRequest();
      // cleaning after the api call to prevent memory leaks
      return () => {
        requestToken?.cancel();
      };
    }
  }, [state.requestCount]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState({ ...state, searchTerm: value });
  };

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
            onChange={handleInput}
          />
          <span onClick={closeSearch} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader " +
              (state.show == "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (state.show == "results" ? "live-search-results--visible" : "")
            }
          >
            {Boolean(state.results.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length}{" "}
                  {state.results.length > 1 ? "items" : "item"} found)
                </div>
                {state.results.map(post => {
                  const date = new Date(post.createdDate);
                  const dateFormatted = `${
                    date.getMonth() + 1
                  }/${date.getDate()}/${date.getFullYear()} `;
                  return (
                    <div onClick={closeSearch}>
                      <PostTitleView
                        post={post}
                        key={post._id}
                        withAuthorName
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {!Boolean(state.results.length) && (
              <p className="alert alert-danger text-center shadow-sm">
                Sorry, we don't have any results for that search.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
