import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import LoadingSpinner from "../Components/spinner/LoadingSpinner";

import axios from "axios";
import LogoutButton from "../Components/LogoutButton";

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

const MailReplies = () => {
  const [mailReplies, setMailReplies] = useState([]);
  const [loading, setLoading] = useState();
  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
    if (localStorage.getItem("jwt") === null) {
      window.location.replace("/login");
    } else {
      let localReplies = localStorage.getItem("allreplies");
      if (localReplies) {
        console.log(localReplies);
        setMailReplies(Object.values(JSON.parse(localReplies)));
        setErrorMsg(false);
        setLoading(false);
      }
    }
  }, []);

  if (localStorage.getItem("jwt") === null) {
    return null;
  }

  const allReplies = async () => {
    setLoading(true);
    const options = {
      method: "GET",
      url: "http://127.0.0.1:8000/api/mailreplies/",
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      localStorage.setItem(
        "allreplies",
        JSON.stringify(Object.values(response.data))
      );
      setMailReplies(Object.values(response.data));
      setErrorMsg(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const unseenReplies = async () => {
    setLoading(true);
    const options = {
      method: "GET",
      url: "http://127.0.0.1:8000/api/mailreplies/new",
    };
    try {
      const response = await axios.request(options);
      console.log(response.status);
      console.log(response.data);
      localStorage.setItem(
        "allreplies",
        JSON.stringify(Object.values(response.data))
      );
      setMailReplies(Object.values(response.data));
    } catch (error) {
      if (error.response.status == 404) {
        console.log(error.response.data.detail);
        setErrorMsg(error.response.data.detail);

      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container m-auto mt-5">
        <div>
          <Button
            className="btn btn-primary rounded-0 m-2"
            onClick={unseenReplies}
          >
            Reload Unseen Replies
          </Button>
          <Button
            className="btn btn-success rounded-0 m-2"
            onClick={allReplies}
          >
            Reload All Replies
          </Button>
          <LogoutButton></LogoutButton>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : errorMsg ? (
          <span className="text-danger mt-5">{errorMsg}</span>
        ) : (
          <div className="mt-5 w-75 m-auto text-start">
            {mailReplies.map((reply, index) => (
              <div key={index}>
                <h3 className="text-light ">
                  Mail Title: {reply.title.replace("Re:", "")}
                </h3>
                <p className="text-light ">Sender: {reply.from_addr}</p>
                <a
                  href={`/mailbody?id=${reply.id}`}
                  className="btn btn-warning rounded-0"
                >
                  View Mail
                </a>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MailReplies;
