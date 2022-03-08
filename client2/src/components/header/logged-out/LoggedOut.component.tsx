import React, { FC, useState } from "react";
import { loginUser } from "../../../api/userApi";
import { useActions } from "../../../hooks/useActions";

interface UserData {
  token: string;
  username: string;
  avatar: string;
}

interface LoggedOutProps {
  setUserData: (d: UserData) => void;
}

const LoggedOut: FC = () => {
  const { login, addFlashMessage } = useActions();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = await loginUser(username, password);
      if (data) {
        login(data.token, data.username, data.avatar);
        addFlashMessage("You have successfuly logged in.");
      } else {
        addFlashMessage("Invalid username / password.");
      }
    } catch (e) {}
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
