import React, { FC, useState } from "react";
import Axios, { AxiosResponse } from "axios";

interface UserData {
  token: string;
  username: string;
  avatar: string;
}

interface LoggedOutProps {
  setLoggedIn: (bool: boolean) => void;
  setUserData: (d: UserData) => void;
}

const LoggedOut: FC<LoggedOutProps> = ({ setLoggedIn, setUserData }) => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log(username);

      const res: AxiosResponse<UserData, any> = await Axios.post(
        "http://localhost:8000/api/v0/user/login",
        {
          username,
          password,
        }
      );

      if (res.data) {
        console.log("user loggedin", res.data);
        localStorage.setItem("appNameToken", res.data.token);
        localStorage.setItem("appNameUsername", res.data.username);
        localStorage.setItem("appNameAvatar", res.data.avatar);
        setLoggedIn(true);
        setUserData(res.data);
      } else {
        setLoggedIn(false);
      }
    } catch (e) {
      console.log("there was an error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
};

export default LoggedOut;
