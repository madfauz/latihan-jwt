import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const Authorization = async (event) => {
    // Mencegah reload ketika submit
    event.preventDefault();

    try {
      // terdapat 2 parameter yaitu endpoint dan data yang ingin di submit
      await axios.post("http://localhost:5000/login", {
        email: email,
        password: password,
      });

      // akan redirect ke halaman dashboard
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        // property message didapat dari response error berupa file json dari backend
        setMessage(error.response.data.message);
      }
    }
  };

  return (
    <section className="hero has-backround-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop">
              <form onSubmit={Authorization} action="" className="box">
                <div className="field mt-5">
                  <label className="label">Email</label>
                  <div className="controls">
                    <input
                      type="text"
                      className="input"
                      name=""
                      id=""
                      placeholder="Email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="field mt-5">
                  <label className="label">Password</label>
                  <div className="controls">
                    <input
                      type="password"
                      className="input"
                      name=""
                      id=""
                      placeholder="********"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
                    />
                  </div>
                </div>
                <p className="has-text-centered">{message}</p>
                <div className="field mt-5">
                  <button className="button is-success is-fullwidth">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
