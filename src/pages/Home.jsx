import React from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import Form from "react-bootstrap/Form";
import axios from "axios";

const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm();

  const sendMail = (e) => {
    const data = JSON.stringify(e);
    console.log(data);
    axios
      .post("http://127.0.0.1:8000/api/sendmail/", data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <>
    <div className="container w-100 " >
      
      <Form onSubmit={handleSubmit(sendMail)} action="" method="">
        <h1>Enter the message: </h1>
        <input className="form-control " type="text" {...register("message")} />
        <select className="form-control btn-warning" type="text" {...register("department")} >
          <option>--Select--</option>
          <option value="Hospitals">Hospitals</option>
          <option value="Airtel">Airtel</option>
        </select>
        <Button type="submit">Send</Button>
      </Form>
    </div>
    </>
  );
};

export default Home;
