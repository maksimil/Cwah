import React from "react";

const Main: React.FC<{ userdata: UserData }> = ({ userdata }) => {
  console.log(userdata);

  return <div>Main</div>;
};

export default Main;
