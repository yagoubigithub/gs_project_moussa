import React from "react";

import Dialog from "@material-ui/core/Dialog";
import { CircularProgress } from "@material-ui/core";

export default function LoadingComponent({ loading }) {
  return (
    <Dialog
      open={loading}
      fullScreen
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={200} />
      </div>
    </Dialog>
  );
}
