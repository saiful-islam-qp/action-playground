import { render, screen } from "@testing-library/react";
import Button from "./Button";

test("Button component rendered", () => {
  // ARRANGE
  render(<Button label="Hello" />);
  const buttonElement = screen.getByRole('button');
  expect(buttonElement).toBeInTheDocument();
});
