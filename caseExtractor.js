
function extractCaseData(mdText) {
  return {
    appeal_type: extractAppealType(mdText),
    section: extractSection(mdText),
    appellant_name: extractAppellant(mdText),
    withdrawal_reason: extractWithdrawal(mdText),
    liberty_allowed: mdText
      .toLowerCase()
      .includes("liberty to file a fresh appeal")
  };
}


function extractAppealType(text) {
  const lower = text.toLowerCase();

  if (lower.includes("second appeal")) return "SECOND APPEAL";
  if (lower.includes("first appeal")) return "FIRST APPEAL";

  return "";
}


function extractSection(text) {
  const match = text.match(/Section\s+(\d+)/i);
  return match ? match[1] : "";
}


function extractAppellant(text) {
  const match = text.match(/by\s+([A-Za-z\s]+)\s+against/i);
  return match ? match[1].trim() : "";
}


function extractWithdrawal(text) {
  if (text.toLowerCase().includes("deceased person")) {
    return "Filed against deceased person";
  }
  return "";
}

module.exports = {
  extractCaseData,
  extractAppealType,
  extractSection,
  extractAppellant,
  extractWithdrawal
};
