import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostItem } from "../../models";
import { getSinglePost } from "../../api/postApi";

import Page from "../../components/page/Page.component";
import PostView from "../../components/post-view/PostView.component";
import LoadingDotIcon from "../../components/loading-dot-icon/LodingDotIcon.component";
import NotFound from "../../components/not-found/NotFound.component";

const ViewSinglePostPage: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPosts] = useState<PostItem>();

  const { id } = useParams();

  useEffect(() => {
    const [sendRequest, requestToken] = getSinglePost(id || "");

    const fetchSinglePost = async () => {
      try {
        if (sendRequest) {
          const postItem = await sendRequest();

          setPosts(postItem);
          setIsLoading(false);
        }
      } catch (e) {
        setIsLoading(false);
        console.log("There was a problem");
      }
    };
    fetchSinglePost();
    // cleaning after the api call to prevent memory leaks
    return () => {
      requestToken?.cancel();
    };
  }, [id]);

  if (!isLoading && !post) {
    return (
      <Page title="NotFound">
        test
        <NotFound />
      </Page>
    );
  }

  if (isLoading || !post) {
    return (
      <Page title="...">
        <LoadingDotIcon />
      </Page>
    );
  }

  return (
    <Page title={post.title}>
      <PostView post={post} />
    </Page>
  );
};

export default ViewSinglePostPage;
