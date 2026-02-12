import { useEffect, useState } from "react";
import "./App.css";

function CaseMetadata() {

  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/case-metadata")
      .then(res => res.json())
      .then(data => setMetadata(data));
  }, []);

  if (!metadata) return <p>Loading...</p>;

  return (
    <div className="metadata-card">

      <div className="metadata-title">
        Case Metadata Card
      </div>

      <div className="metadata-row">
        <span className="label">Appeal Case Number:</span>
        <span className="value">
          {metadata.APPEAL_CASE_NUMBER?.[0]}
        </span>
      </div>

      <div className="metadata-row">
        <span className="label">Date Of Order:</span>
        <span className="value">
          {metadata.DATE_OF_ORDER?.[0]}
        </span>
      </div>

      <div className="metadata-row">
        <span className="label">Filed Under Section:</span>
        <span className="value highlight">
          {metadata.IMPORTANT_CLAUSES?.[0]}
        </span>
      </div>

    </div>
  );
}

export default CaseMetadata;
