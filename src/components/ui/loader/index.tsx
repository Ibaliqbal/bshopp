import React from "react";

const Loader = ({ className }: { className: string }) => {
  return <span className={`loader ${className}`}></span>;
};

export default Loader;
