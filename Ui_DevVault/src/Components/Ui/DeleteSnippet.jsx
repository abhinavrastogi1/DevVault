import React from "react";
import ReactDOM from "react-dom";
import { RemoveScroll } from "react-remove-scroll";
import { useDispatch, useSelector } from "react-redux";

function DeleteSnippet({  }) {
  const dispatch = useDispatch();
  return ReactDOM.createPortal(
    <RemoveScroll>
      <div
        className="w-full fixed inset-0  z-50 
      bg-gray-800/40 flex flex-col  justify-center items-center p-4"
      >
        <div className="bg-gray-700 rounded-md p-10 space-y-10  flex flex-col justify-between">
          <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center ">
            <h1 className="text-2xl font-bold text-white">Delete Snippet?</h1>
          </div>
          <p className=" text-base font-bold text-white ">
          This action is irreversible. Deleting this snippet will permanently remove it.
          </p>
          </div>
          <div className="w-full text-end space-x-5 ">
            <button
              className="p-2 hover:bg-lightblue rounded-md duration-500 ease-in-out text-white cursor-pointer"
              onClick={() => {
              }}
            >
              Cancel
            </button>
            <button
              className="p-2 bg-red-700 text-white rounded-md  cursor-pointer"
              onClick={() => {
              }}
            >
              Delete Snippet
            </button>
          </div></div>
        </div>
    </RemoveScroll>,
    document.body
  );
}

export default DeleteSnippet;