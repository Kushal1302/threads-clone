import React from "react";

const RightSidebar = () => {
  return (
    <section className="rightsidebar custom-scrollbar">
      <div className="flex flex-1 justify-start flex-col">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>
      </div>
      <div className="flex flex-1 justify-start flex-col">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
      </div>
    </section>
  );
};

export default RightSidebar;
