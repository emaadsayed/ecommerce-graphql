import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { useMutation } from "@apollo/client";
import { SIGNIN_USER } from "../graphql/mutations";

export default function SignInComponent() {
  const navigate = useNavigate();
  const [signinUser, { data, loading, error }] = useMutation(SIGNIN_USER);

  const [logInDetails, setLogInDetails] = useState({
    email: "",
    password: "",
  });

  function onChangeHandler(type, e) {
    const { value } = e.target;
    setLogInDetails({ ...logInDetails, [type]: value });
  }

  async function onSubmitLoginDetails() {
    signinUser({
      variables: {
        email: logInDetails.email,
        password: logInDetails.password,
      },
    }).then((result) => {
      localStorage.setItem("token", result.data.loginUser.token);
      navigate("/");
    });
  }

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-xl shadow-rose-600/40 ring ring-2 ring-red-600 lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-red-500 underline uppercase decoration-wavy">
          Sign in
        </h1>
        <form className="mt-6">
          <div className="mb-2">
            <label
              for="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              onChange={(e) => onChangeHandler("email", e)}
              className="block w-full px-4 py-2 mt-2 text-red-500 bg-white border rounded-md focus:border-red-400 focus:ring-red-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label
              for="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              type="password"
              onChange={(e) => onChangeHandler("password", e)}
              className="block w-full px-4 py-2 mt-2 text-red-700 bg-white border rounded-md focus:border-red-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <a href="#" className="text-xs text-red-600 hover:underline">
            Forget Password?
          </a>
          <div className="mt-6">
            <button
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-red-500 hover:bg-red-600 rounded-md  focus:outline-none "
              onClick={onSubmitLoginDetails}
              type="button"
            >
              Login
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs font-light text-center text-gray-700">
          {" "}
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-red-500 hover:text-red-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
