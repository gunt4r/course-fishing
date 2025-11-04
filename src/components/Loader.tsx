"use client";
import { HashLoader } from "react-spinners";

export default function Loader() {
  return (
    <HashLoader
      color="rgba(1, 34, 166, .88)"
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#fff",
        zIndex: "100",
        position: "absolute",
        left: "0",
        top: "0",
      }}
    />
  );
}
