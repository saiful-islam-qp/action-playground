import React, { HTMLAttributes } from "react";

type Props = {
  label: string;
} & HTMLAttributes<HTMLButtonElement>;

const Button: React.FC<Props> = ({ label, style, ...props }) => {
  return <button style={style} {...props}>{label}</button>;
};

export default Button;
