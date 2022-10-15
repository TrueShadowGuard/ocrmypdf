import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Form} from "react-bootstrap";
import {axios} from "./axios";
import {useAsync} from "react-async-hook";

const App = () => {

  const {loading, execute, result} = useAsync(_handleSubmit);

  return (
    <div>
      <form className="container mt-4" onSubmit={execute}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>PDF на который надо наложить текст</Form.Label>
          <Form.Control type="file" name="pdf" />
        </Form.Group>
        <Button type="submit" disabled={loading}>Наложить текст на pdf</Button>
        {loading && <p>Придется подождать от 1 до 10 минут потому что операция очень тяжелая</p>}
        <br/>
        {result && <a href={result} download={"result.pdf"}>Результат</a>}
      </form>
    </div>
  );

  async function _handleSubmit(e) {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 1000));
    const formData = new FormData(e.target);
    let ticket = (await axios({
      url: "/tickets",
      method: "post",
      data: formData,
      headers:{
        "Content-Type": "multipart/form-data"
      }
    })).data;
    console.log(ticket);
    while (true) {
      await wait(1000);
      ticket = (await axios({
        url: `/tickets/${ticket.id}`,
        method: "get",
      })).data;
      console.log(ticket);
      if(ticket.status !== "IN PROGRESS") break;
    }
    return ticket.downloadLink;
  }
};

const wait = ms => new Promise(r => setTimeout(r, ms));

export default App;