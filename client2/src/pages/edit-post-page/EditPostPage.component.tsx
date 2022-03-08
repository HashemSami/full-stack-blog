import React, { FC, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSinglePost, editPost } from "../../api/postApi";
import { useTypedSelector } from "../../hooks/useSelector";
import { useActions } from "../../hooks/useActions";
import { useEditPostReducer } from "./editPostReducer";
import Page from "../../components/page/Page.component";
import LoadingDotIcon from "../../components/loading-dot-icon/LodingDotIcon.component";
import NotFound from "../../components/not-found/NotFound.component";

const EditPostPage: FC = () => {
  const navigate = useNavigate();

  const [state, dispatch] = useEditPostReducer();

  const { id, isFetching, title, body, sendCount, isSaving, notFound } = state;

  const { addFlashMessage } = useActions();

  const [token, username] = useTypedSelector(
    ({ currentUser: { token, username } }) => [token, username]
  );

  useEffect(() => {
    const [sendRequest, requestToken] = getSinglePost(id || "");

    const fetchSinglePost = async () => {
      try {
        if (sendRequest) {
          const postItem = await sendRequest();

          if (postItem) {
            if (username != postItem.author.username) {
              addFlashMessage("You do not have permission to edit that post.");
              // redirect to home page
              navigate("/");
            }
            dispatch({ type: "fetchComplete", value: postItem });
          } else {
            console.log("noooooot ");
            // dispatch({ type: "notFound" });
          }
        }
      } catch (e) {
        console.log("There was a problem");
      }
    };
    fetchSinglePost();
    // cleaning after the api call to prevent memory leaks
    return () => {
      requestToken?.cancel();
    };
  }, []);

  useEffect(() => {
    const [sendRequest, requestToken] = editPost(
      id || "",
      title.value,
      body.value,
      token
    );

    const fetchSinglePost = async () => {
      if (sendCount) {
        dispatch({ type: "saveRequestStarted" });
        try {
          if (sendRequest) {
            const postItem = await sendRequest();
            console.log(postItem);
            dispatch({ type: "saveRequestFinished" });
            addFlashMessage("Your post is Updated");
          }
        } catch (e) {
          console.log("There was a problem");
        }
      }
    };
    fetchSinglePost();
    // cleaning after the api call to prevent memory leaks
    return () => {
      requestToken?.cancel();
    };
  }, [sendCount]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
    dispatch({ type: "titleRules", value: title.value });
    dispatch({ type: "bodyRules", value: body.value });
    dispatch({ type: "submitRequest" });
  };

  if (notFound) {
    return (
      <Page title="NotFound">
        <NotFound />
      </Page>
    );
  }

  if (isFetching) {
    return (
      <Page title="...">
        <LoadingDotIcon />
      </Page>
    );
  }

  return (
    <Page title="Edit Post" wide>
      <Link to={`/post/${id}`} className="small font-weight-bold">
        &laquo; View your post
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={title.value}
            onBlur={e =>
              dispatch({ type: "titleRules", value: e.target.value })
            }
            onChange={e =>
              dispatch({ type: "titleChange", value: e.target.value })
            }
          />
          {title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            value={body.value}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })}
            onChange={e =>
              dispatch({ type: "bodyChange", value: e.target.value })
            }
          />
          {body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              You ust provide a content
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Updates"}
        </button>
      </form>
    </Page>
  );
};

export default EditPostPage;
