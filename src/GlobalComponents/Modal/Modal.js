import React, { Children } from "react";
// Import Css File
import "./Modal.css";

const Modal = (props) => {
  return (
    <div
      className="modal fade"
      id={props.id}
      tabIndex="-1"
      aria-labelledby={props.id + "Label"}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title" id={props.id + "Label"}>
              {props.name}
            </h5>
            <button
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
              className="close-btn"
            >
              <i className="bi bi-x"></i>X
            </button>
          </div>
          <div className="modal-body">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
