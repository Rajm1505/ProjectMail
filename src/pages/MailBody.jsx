import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Container, Card } from "react-bootstrap";

import LogoutButton from "../Components/LogoutButton";

import LoadingSpinner from "../Components/spinner/LoadingSpinner";

const MailBody = () => {
  const [mail, setMail] = useState();
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if(localStorage.getItem('jwt') === null){
      window.location.replace("/login");
    }else{
      async function apiCall() {
        const options = {
          method: "POST",
          url: "http://127.0.0.1:8000/api/mailbody/",
          data: { id: id },
        };
        try {
          let response = await axios.request(options);
          console.log(response.data);
          setMail(response.data);
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      }
      apiCall();
    }
  }, []);

  if (localStorage.getItem("jwt") === null) {
    return null;
  }

  return (
    <>
      {loading ? (  
        <LoadingSpinner />
      ) : (
      <Container className='mt-5 w-50'>
        <h3 className="text-light">Here is your entire reply</h3>
        <Card>
          <Card.Body className="text-start">
            <Card.Title>Title: {mail.title.replace("Re:","")}</Card.Title>
            <hr />
            <Card.Text>
            Sender: {mail.from_addr}
            </Card.Text>
            <hr />
            <Card.Text>
              <pre>

              {mail.body}
              </pre>
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
        // <pre className="text-light">{mailbody}</pre>
      )}
    </>
  );
};

export default MailBody;
