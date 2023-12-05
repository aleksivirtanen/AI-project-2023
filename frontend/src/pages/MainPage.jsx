import React, { useRef, useState } from "react";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";

const MainPage = () => {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  const inputRef = useRef();
  const [inputs, setInputs] = useState([]);
  const [responses, setResponses] = useState([]);
  const [counter, setCounter] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const clickHandler = (event) => {
    event.preventDefault();
    setDisabled(true);
    setInputs([...inputs, inputRef.current.value]);
    setCounter(counter + 1);
    postQuestion(inputRef.current.value);
    inputRef.current.value = "";
    setTimeout(() => {
      setDisabled(false);
    }, 10000);
  };

  const postQuestion = async (question) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "Your answers are short and straight to the point.",
              },
              { role: "user", content: question },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Oops! Something went wrong.");
      }

      const responseData = await response.json();

      setResponses([...responses, responseData.choices[0].message.content]);
      console.log(responseData.choices[0]);
    } catch (error) {
      console.error("Error while fetching chat data:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <Input id="input" ref={inputRef} />
      <button type="button" disabled={disabled} onClick={clickHandler}>
        Send
      </button>
      {loading && (
        <div>
          <LoadingSpinner />
        </div>
      )}
      <div>INPUT: {inputs[counter]}</div>
      <div>RESPONSE: {responses[counter]}</div>
    </div>
  );
};

export default MainPage;
