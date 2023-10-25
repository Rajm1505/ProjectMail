import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import LoadingSpinner from "../Components/spinner/LoadingSpinner";

const MailBody = () => {
  const [mailbody, setMailBody] = useState();
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    async function apiCall() {
      const options = {
        method: "POST",
        url: "http://127.0.0.1:8000/api/mailbody/",
        data: { id: id },
      };
      try {
        let response = await axios.request(options);
        console.log(response.data);
        setMailBody(response.data.body);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    apiCall();
  }, []);

  return (
    <>
      {loading ? (  
        <LoadingSpinner />
      ) : (
        <pre className="text-light">{mailbody}</pre>
      )}
    </>
  );
};

export default MailBody;
