import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Card } from "react-bootstrap";

import axios from "axios";

const ImportCSV = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [duplicateEmails, setDuplicateEmails] = useState();

  const uploadCSV = async (e) => {
    let csvFile = e.csvFile[0];
    let formData = new FormData();

    formData.append("csvFile", csvFile);
    try {
      let response = await axios.post(
        "http://127.0.0.1:8000/api/importcsv/",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      console.log("Response: ", response);
      console.log("Sent Message: ", response.data.msg);

      setDuplicateEmails(response.data.duplicateEmails);

    } catch (error) {
      console.log(error.response);
    }
    console.log("duplicate email state", duplicateEmails);
  };
  return (
    <>
      <div className="container w-100 ">
        <Form
          onSubmit={handleSubmit(uploadCSV)}
          className="mt-5"
          action=""
          method=""
        >
          <div className="d-flex ">
            <div className=" m-auto">
              <h1 className="text-light">Import Recipents from CSV File</h1>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-6 m-auto">
              <div className="card card-body ">
                <div></div>
                <div>
                  <Form.Label className="float-start" htmlFor="message">
                    Upload your CSV file here
                  </Form.Label>
                  <Form.Control
                    className="form-control mb-3 "
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    required= {true}
                    {...register("csvFile")}
                  />
                  <span className="text-muted">Note: CSV File having emails which are already in our database will be ignored.</span>
                </div>

                <Button className="w-50 mt-3 m-auto bg-dark" type="submit">
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
      {/* Rendering Duplicate Emails from CSV file */}
      {duplicateEmails || duplicateEmails == [] ?
      <div className="container w-100 mt-5">
        <div className="d-flex">
          <Card style={{ width: "18rem" }} className="m-auto">
            <Card.Body>
              <Card.Title>Duplicate Records</Card.Title>
              
                <ol>
                  {duplicateEmails.map((email, index) => (
                    <li key={index} className="text-dark">{email}</li>
                  ))}
                </ol>
              
            </Card.Body>
          </Card>
        </div>
      </div>
      :
      <></>
      }
    </>
  );
};

export default ImportCSV;
