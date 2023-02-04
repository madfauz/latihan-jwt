import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    // getUsers();
  }, []);

  const refreshToken = async () => {
    try {
      // verifikasi refresh_token untuk men-generate accessToken
      const response = await axios.get("http://localhost:5000/token");
      // meng-set accessToken hasil verifikasi refresh_token
      setToken(response.data.accessToken);
      // mengubah accessToken (kode random), menjadi data object info user tersebut (sesuai accessToken)
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  // digunakan untuk setiap request yang membutuhkan token
  const axiosJWT = axios.create();

  // interceptors berfungsi untuk melakukan pengecekan sebelum melakukan request
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      // bandingkan waktu sekarang dengan expire date-nya
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/token");
        // update header request-nya
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        // mengubah accessToken (kode random), menjadi data object info user tersebut (sesuai accessToken)
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getUsers = async () => {
    // menggunakan axiosJWT karna membutuhkan token
    const response = await axiosJWT.get("http://localhost:5000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Welcome back : {name}</h1>
      <button onClick={getUsers} className="button is-info mb-3">
        Get Users
      </button>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
