import { PostItem } from "../models";
import Axios, { AxiosResponse, CancelToken, CancelTokenSource } from "axios";

export const getSinglePost = (
  id: string
): [() => Promise<PostItem | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<PostItem | undefined, any> = await Axios.get(
        `/post/single-post/${id}`,
        { cancelToken: requestToken.token }
      );
      return res.data;
    };

    return [sendRequest, requestToken];
  } catch (e) {
    console.log("there was an error");
    return [];
  }
};

export const editPost = (
  id: string,
  title: string,
  body: string,
  token: string
): [() => Promise<string | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<string | undefined, any> = await Axios.post(
        `/post/${id}/edit`,
        { title, body, token },
        { cancelToken: requestToken.token }
      );
      return res.data;
    };

    return [sendRequest, requestToken];
  } catch (e) {
    console.log("there was an error");
    return [];
  }
};

export const deletePost = (
  id: string,
  token: string
): [() => Promise<"Success" | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<"Success" | undefined, any> = await Axios.post(
        `/post/${id}/delete`,
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

export const searchPost = (
  searchTerm: string
): [() => Promise<PostItem[] | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<PostItem[] | undefined, any> = await Axios.post(
        `/post/search`,
        { searchTerm },
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
