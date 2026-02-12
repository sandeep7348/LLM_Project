import { useState, useEffect } from "react";
import "./App.css";
import CaseMetadata from "./CaseMetadata";
function App() {
  const [paragraphs, setParagraphs] = useState([]);

  useEffect(() => {
    fetch("https://llm-project-n85g.onrender.com/case-metadata")
      .then(res => res.text())
      .then(text => {
        const parts = text
          .split(/\n\s*\n/)
          .filter(p => p.trim() !== "");

        setParagraphs(parts);
      });
  }, []);

  return (
  <div className="app-container">

    <div className="page-wrapper">

      <CaseMetadata />

      <div className="panel">

        <div className="panel-header">
          Analysis Section
        </div>

        <div className="card-container">
          {paragraphs.map((para, index) => (
            <div key={index} className={`analysis-card card-${index}`}>
              <p>{para}</p>
            </div>
          ))}
        </div>

      </div>
      <div className="panel">
  <div className="panel-header">
    Actions
  </div>

  <div className="analysis-card">
    <p className="action-text">Download Markdown</p>
    <p className="action-text">Download PDF</p>
    <p className="action-text source-text">View Source Text</p>
  </div>
</div>
    

    </div>

  </div>
);

}

export default App;
