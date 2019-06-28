import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import CloseButton from "./CloseButton";

afterEach(cleanup);

describe("CloseButton", () => {
  it("renders correctly", () => {
    const { container } = render(<CloseButton />);
    expect(container).toMatchSnapshot();
  });
  it("fires click handler on click", () => {
    const myClickHandler = jest.fn();
    const { getByTestId } = render(<CloseButton close={myClickHandler} />);
    fireEvent.click(getByTestId("close-button"));
    expect(myClickHandler).toHaveBeenCalledTimes(1);
  });
});
