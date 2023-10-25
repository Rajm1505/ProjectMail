import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import LoadingSpinner from "../Components/spinner/LoadingSpinner";

import axios from "axios";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

const MailReplies = () => {
  const [MailReplies, setMailReplies] = useState([]);
  const [loading, setLoading] = useState();

  const allReplies = async () => {
    setLoading(true);
    const options = {
      method: "GET",
      url: "http://127.0.0.1:8000/api/mailreplies/",
    };

    try{
        const response = await axios.request(options)
        console.log(response.data);
        setMailReplies(Object.values(response.data));
        setLoading(false);
    }catch(error){
        console.error(error);
    }
  };

  const unseenReplies = () => {
    setLoading(true);
    const options = {
      method: "GET",
      url: "http://127.0.0.1:8000/api/mailreplies/new",
    };
    try{
        const response = axios.request(options)
        console.log(response.data);
        setMailReplies(Object.values(response.data));
        setLoading(false);
    }catch(error){
        console.error(error);
        setLoading(false);
    }
  };

  return (
    <>
      <div className="container m-auto mt-5">
        <Button className="btn btn-primary me-5" onClick={unseenReplies}>
          Load Unseen Replies
        </Button>
        <Button className="btn btn-success" onClick={allReplies}>
          Load All Replies
        </Button>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div>
            {MailReplies.map((reply, index) => (
              <div key={index}>
                <h3 className="text-light">{reply.title}</h3>
                <p className="text-light">{reply.from_addr}</p>
                <a
                  href={`/mailbody?id=${reply.id}`}
                  className="btn btn-warning"
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
