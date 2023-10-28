import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";
import axios from "axios";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm();

  const [loginError, setLoginError] = useState();

  if (localStorage.getItem("jwt") != null) {
    console.log("jwt found");
    window.location.replace("/sendmail");
    return;
  }

  const login = async (e) => {
    const data = JSON.stringify(e);
    console.log("data", data);
    try {
      let response = await axios.post("http://127.0.0.1:8000/api/login/", data);
      console.log("Response: ", response);
      localStorage.setItem("jwt", response.data.jwt);
      window.location.replace("sendmail");
    } catch (error) {
      setLoginError(error.response.data.detail);
      console.log(error.response);
    }
  };
  return (
    <>
      <div className="container w-100 ">
        <Form
          onSubmit={handleSubmit(login)}
          className="mt-5"
          action=""
          method=""
        >
          <div className="d-flex ">
            <div className=" m-auto">
              <h1 className="text-light">Login</h1>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-6 m-auto">
              <div className="card card-body ">
                {loginError ? (
                  <span className="text-danger">{loginError}</span>
                ) : (
                  <></>
                )}
                <Form.Group>
                  <Form.Label className="float-start" htmlFor="subject">
                    Email:
                  </Form.Label>
                  <Form.Control
                    className="form-control mb-3 "
                    id="email"
                    type="email"
                    {...register("email")}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label className="float-start" htmlFor="message">
                    Password
                  </Form.Label>
                  <Form.Control
                    className="form-control mb-3 "
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                </Form.Group>

                <Button className="w-50 mt-3 m-auto bg-dark" type="submit">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Login;
