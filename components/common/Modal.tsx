import React from "react";

interface Props {
  title: string;
  component: React.ReactNode;
  id: string;
}

const Modal = (props: Props) => {
  return (
    <div>
      {/* The button to open modal */}

      {/* Put this part before </body> tag */}
      <input type="checkbox" id={props.id} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">{props.title}</h3>
          <div className="py-4">{props.component}</div>
          <div className="modal-action">
            <label htmlFor={props.id} className="btn">
              Save
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
