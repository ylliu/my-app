import React from "react";

const ButtomWithProgress = (props) => {
    return (
        <button className="btn btn-primary"
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.pendingApiCall && (
                <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}
            {props.text}
        </button>
    );
}

export default ButtomWithProgress;