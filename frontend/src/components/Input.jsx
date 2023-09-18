import { forwardRef } from "react";
import "./Input.css";

const Input = forwardRef((props, ref) => {
  return (
    <div className="form-control">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        ref={ref}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
      />
    </div>
  );
});

export default Input;
