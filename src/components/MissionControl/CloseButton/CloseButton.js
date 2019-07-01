import React from "react";
import "./CloseButton.scss";

const CloseButton = ({ close = () => {} }) => (
  <button className="CloseButton" onClick={close} data-testid="close-button">
    ✖
  </button>
);
export default CloseButton;
