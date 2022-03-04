import Axios, { AxiosResponse, CancelToken, CancelTokenSource } from "axios";

export const addFollow = (
  username: string,
  token: string
): [() => Promise<boolean | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<boolean | undefined, any> = await Axios.post(
        `/follow/add-follow/${username}`,
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

export const removeFollow = (
  username: string,
  token: string
): [() => Promise<boolean | undefined>, CancelTokenSource] | [] => {
  try {
    const requestToken = Axios.CancelToken.source();

    const sendRequest = async () => {
      const res: AxiosResponse<boolean | undefined, any> = await Axios.post(
        `/follow/remove-follow/${username}`,
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
