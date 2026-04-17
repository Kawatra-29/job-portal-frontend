import { useState } from "react";
import JobList from "./JobList";
import UserProfile from "./UserProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [val, setVal] = useState(false);
  const [openpro, setOpenpro] = useState(false);
  return (
    <div className="flex bg-amber-400 h-dvh justify-end">
      <button className="bg-blue-100 w-15 h-10 rounded-xl m-2"
       onClick={() => setOpenpro(true)}>
        <FontAwesomeIcon icon={faUser} />
      </button>
      <button
        className="bg-blue-100 w-15 h-10 rounded-xl m-2 "
        onClick={() => setVal(true)}
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
      {val ? <JobList /> : <h1></h1>}
      {openpro ? <UserProfile /> : <h1></h1>}
    </div>
  );
};

export default Dashboard;
