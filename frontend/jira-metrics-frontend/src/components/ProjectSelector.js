import React from "react";
import Select from "react-select";

const ProjectSelector = ({ projects, selectedProjects, setSelectedProjects }) => {
  return (
    <div className="mb-6 flex items-center space-x-4">
      <Select
        options={projects}
        value={selectedProjects}
        onChange={setSelectedProjects}
        isMulti
        placeholder="Select Projects..."
        className="w-full"
      />
    </div>
  );
};

export default ProjectSelector;
