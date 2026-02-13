import React, { useState } from "react";

const Form = () => {

  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("caseNumber", file);

    try {
      const res = await fetch(
        "https://llm-project-n85g.onrender.com/submit-case",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log(data);

    } catch (err) {
      console.log("Upload error:", err);
    }
  };

  return (
    <div className="form-container">
      <h2>Submit Your Case</h2>

      <form className="case-form" onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
