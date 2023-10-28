import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";

import LogoutButton from "../Components/LogoutButton";

import Form from "react-bootstrap/Form";
import axios from "axios";

const SendMail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm();

  const [sentStatus, setSentStatus] = useState(false);
  const [departments, setDepartments] = useState([]);

  // const reciepents = () =>{
  //   axios
  //   .get("http://127.0.0.1:8000/api/sendmail/")
  //     .then(function (response) {
  //       console.log(response);
  //       // console.log(response.data.Sent);
  //       setSentStatus(response.data.Sent);
  //       console.log("sentStatus: ", sentStatus);
  //     })

  // }

  // Api Call to  fetch all Departments available
  useEffect(() => {
    if (localStorage.getItem("jwt") === null) {
      window.location.replace("/login");
    } else {
      async function fetchDept() {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/getdept/"
          );
          console.log(response);
          setDepartments(response.data.departments);
        } catch (error) {
          console.log(error);
        }
      }
      fetchDept();
    }
  }, []);

  if (localStorage.getItem("jwt") === null) {
    return null;
  }

  const sendMail = async (e) => {
    if (departments.length == 0) {
      return;
    }
    const data = JSON.stringify(e);
    console.log("data", data);
    try {
      let response = await axios.post(
        "http://127.0.0.1:8000/api/sendmail/",
        data
      );
      console.log("Response: ", response);
      console.log("isSent: ", response.data.isSent);
      setSentStatus(response.data.isSent);
    } catch (error) {
      console.log(error.response);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    window.location.replace("login");
  }
  return (
    <>
      <div className="container w-100 ">
        <Form
          onSubmit={handleSubmit(sendMail)}
          className="mt-5"
          action=""
          method=""
        >

          <div className="d-flex ">
            <div className=" m-auto">
              <h1 className="text-light">Send mails with a Click!</h1>
              <a className="btn btn-warning rounded-0 ms-0" href="../mailreplies/">
                View Mail Replies
              </a>
              <LogoutButton></LogoutButton>
            </div>
          </div>

          <div className="row mt-3">
            {departments.length == 0 ? (
              <p className="text-danger">
                No Departments or Recipients Added. Please Contact Admin
              </p>
            ) : (
              <></>
              )}
            <div className="col-md-6 m-auto">
              <div className="card card-body ">
              {sentStatus ? <span className="text-success">Mails has been sent Successfully</span> : <></>}
                <div>
                  <label className="float-start" htmlFor="subject">
                    Subject:
                  </label>
                  <input
                    className="form-control mb-3 "
                    id="subject"
                    type="text"
                    {...register("subject")}
                  />
                </div>
                <div>
                  <label className="float-start" htmlFor="message">
                    Enter your Message
                  </label>
                  <textarea
                    className="form-control mb-3 "
                    id="message"
                    type="text"
                    {...register("message")}
                  />
                </div>
                <select
                  className="form-control btn-warning"
                  type="text"
                  {...register("department")}
                >
                  {departments ? (
                    departments.map((dept, index) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))
                  ) : (
                    <option>--Select--</option>
                  )}
                </select>
                <Button className="w-50 mt-3 m-auto bg-dark rounded-0" type="submit">
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

export default SendMail;
