import React, { useRef, useState } from "react";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";

const MainPage = () => {
  const inputRef = useRef();
  const [inputs, setInputs] = useState([]);
  const [counter, setCounter] = useState(-1);
  const [loading, setLoading] = useState(false);

  const clickHandler = (event) => {
    event.preventDefault();
    setInputs([...inputs, inputRef.current.value]);
    setCounter(counter + 1);
    postQuestion(inputRef.current.value);
    inputRef.current.value = "";
  };

  const postQuestion = async (question) => {
    console.log(question);
    setLoading(true); /*
    const response = await fetch("asdasd", {
      method: "POST",
      body: JSON.stringify(question),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);*/
    setLoading(false);
  };

  return (
    <div>
      <Input id="input" ref={inputRef} />
      <button type="button" onClick={clickHandler}>
        Send
      </button>
      {loading && (
        <div>
          <LoadingSpinner />
        </div>
      )}
      <div>{inputs[counter]}</div>
    </div>
  );
};

export default MainPage;
