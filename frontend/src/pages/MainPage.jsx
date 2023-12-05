import React, { useRef, useState, useEffect } from "react";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";

const MainPage = () => {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  const inputRef = useRef();
  const [inputs, setInputs] = useState([]);
  const [responses, setResponses] = useState([]);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [checkPrevious, setCheckPrevious] = useState(false);
  const [answerNo, setAnswerNo] = useState(false);

  useEffect(() => {
    if (answerNo) {
      postQuestion(inputs[inputs.length - 1]);
    }
  }, [answerNo]);

  const clickHandler = (event) => {
    event.preventDefault();
    setDisabled(true);
    let question;
    if (checkPrevious) {
      question =
        "Answer with yes or no. Is this question '" +
        inputRef.current.value +
        "' asking for same information as this question '" +
        inputs[inputs.length - 1] +
        "'";
    } else {
      question =
        "If you can not assist with a question because it's not allowed, start your response with 'I can't answer.', then give out your answer. " +
        inputRef.current.value;
    }
    setInputs([...inputs, inputRef.current.value]);
    postQuestion(question);
    inputRef.current.value = "";
    setTimeout(() => {
      setDisabled(false);
    }, 10000);
  };

  const postQuestion = async (question) => {
    console.log(question);
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
                content:
                  "You are a helpful assistant, whose answers are short and straight to the point.",
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
      const contentCheck = responseData.choices[0].message.content;

      if (contentCheck.includes("I can't answer")) {
        setCheckPrevious(true);
        setAnswerNo(false);
        setResponses([...responses, responseData.choices[0].message.content]);
      } else if (
        contentCheck.toLowerCase() === "yes." ||
        contentCheck.toLowerCase() === "yes"
      ) {
        setCheckPrevious(true);
        setAnswerNo(false);
        setResponses([
          ...responses,
          "This appears to be the same question phrased differently and I still can't respond.",
        ]);
      } else if (
        contentCheck.toLowerCase() === "no." ||
        contentCheck.toLowerCase() === "no"
      ) {
        setCheckPrevious(false);
        setAnswerNo(true);
      } else {
        setCheckPrevious(false);
        setAnswerNo(false);
        setResponses([...responses, responseData.choices[0].message.content]);
      }

      setCounter(counter + 1);
      console.log(responseData.choices[0]);
    } catch (error) {
      console.error("Error while fetching chat data:", error);
    }
    setLoading(false);
  };

  const content = inputs.map((value, index) => {
    const responseContent = responses[index];
    return (
      <>
        <div>INPUT: {value}</div>
        {typeof responses[index] !== "undefined" && (
          <div>OUTPUT: {responseContent}</div>
        )}
      </>
    );
  });

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
      <section>{content}</section>
    </div>
  );
};

export default MainPage;
