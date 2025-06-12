import React, { useState, useRef } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Main container for 5GTestGenie: Handles .feature file upload, requirement parsing,
 * test case generation, and dashboard layout.
 */
function App() {
  // State for uploaded .feature file name & content
  const [featureFileName, setFeatureFileName] = useState("");
  const [featureContent, setFeatureContent] = useState("");
  // State for parsed requirements (array of strings)
  const [requirements, setRequirements] = useState([]);
  // State for generated test cases (array of strings)
  const [testCases, setTestCases] = useState([]);
  // Error state
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  // Parse .feature file for Gherkin-style requirements (very simple parser)
  // This demo parser only extracts "Scenario:" and "Given/When/Then/And/But" lines.
  function parseFeatureRequirements(content) {
    const lines = content.split("\n");
    const reqs = [];
    let scenario = null;
    for (const line of lines) {
      const trim = line.trim();
      if (trim.startsWith("Scenario:")) {
        scenario = trim;
        reqs.push(trim);
      } else if (
        ["Given", "When", "Then", "And", "But"].some((start) =>
          trim.startsWith(start)
        )
      ) {
        reqs.push(trim);
      }
    }
    return reqs;
  }

  // Generate simple test cases from requirements
  // For demo: just creates a test step for each 'Scenario' with placeholder coverage
  function generateTestCases(requirements) {
    const cases = [];
    let currentScenario = null;
    let steps = [];
    for (const req of requirements) {
      if (req.startsWith("Scenario:")) {
        if (currentScenario) {
          cases.push({
            scenario: currentScenario,
            steps: steps,
          });
        }
        currentScenario = req;
        steps = [];
      } else {
        steps.push(req);
      }
    }
    if (currentScenario) { cases.push({ scenario: currentScenario, steps }); }
    return cases;
  }

  // Handle user uploading a .feature file
  function handleFileChange(event) {
    setError("");
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".feature")) {
      setError("Please upload a valid .feature file.");
      setFeatureFileName("");
      setFeatureContent("");
      setRequirements([]);
      setTestCases([]);
      return;
    }
    setFeatureFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setFeatureContent(content);
      const parsedReqs = parseFeatureRequirements(content);
      setRequirements(parsedReqs);

      // Simulate 3GPP spec parsing and comprehensive test case generation
      const cases = generateTestCases(parsedReqs);
      setTestCases(cases);
    };
    reader.readAsText(file);
  }

  function handleUploadClick() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }

  function handleClear() {
    setFeatureFileName("");
    setFeatureContent("");
    setRequirements([]);
    setTestCases([]);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Custom colors from design requirements
  const COLORS = {
    primary: "#1A73E8",
    secondary: "#F1F3F4",
    accent: "#34A853",
  };

  return (
    <div
      className="app"
      style={{
        minHeight: "100vh",
        background: COLORS.secondary,
        color: "#222",
        fontFamily:
          "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      }}
    >
      {/* Top navigation bar */}
      <nav
        className="navbar"
        style={{
          background: COLORS.primary,
          color: "#fff",
          padding: "0 0 0 0",
          minHeight: 60,
          display: "flex",
          alignItems: "center",
          borderBottom: `3px solid ${COLORS.accent}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
        }}
      >
        <div
          className="container"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0 auto",
            maxWidth: 1200,
          }}
        >
          <div
            className="logo"
            style={{
              fontWeight: 700,
              fontSize: "1.35rem",
              display: "flex",
              alignItems: "center",
              gap: 10,
              letterSpacing: "1px",
            }}
          >
            <span style={{ color: COLORS.accent, fontWeight: 900, fontSize: "1.45rem" }}>🧪</span>
            5GTestGenie
          </div>
          <div>
            <button
              className="btn"
              style={{
                background: "#fff",
                color: COLORS.primary,
                fontWeight: 600,
                borderRadius: 6,
                border: "none",
                marginRight: 12,
                padding: "8px 18px",
                fontSize: "1rem",
              }}
              onClick={handleClear}
              title="Clear All"
            >
              Clear
            </button>
            <button
              className="btn"
              style={{
                background: COLORS.accent,
                color: "#fff",
                fontWeight: 600,
                borderRadius: 6,
                border: "none",
                padding: "8px 18px",
                fontSize: "1rem",
              }}
              title="Settings (Not implemented)"
              disabled
            >
              ⚙️
            </button>
          </div>
        </div>
      </nav>

      {/* Main dashboard content */}
      <main style={{ paddingTop: 90, paddingBottom: 40, minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Dashboard header */}
          <div style={{
            marginBottom: 24,
            textAlign: "left",
            padding: "0 2px",
          }}>
            <h1 style={{
              color: COLORS.primary,
              fontWeight: 800,
              fontSize: "2.5rem",
              margin: "0 0 5px 0"
            }}>Comprehensive 5G NGAP Test Case Generator</h1>
            <div style={{
              color: "#444",
              fontSize: "1.12rem",
              marginBottom: 3,
            }}>
              Upload a <b>.feature</b> file from your 3GPP specification. 5GTestGenie intelligently parses the specification and generates detailed test cases for robust coverage.
            </div>
          </div>

          {/* Upload area */}
          <section
            style={{
              background: "#fff",
              border: `2px dashed ${COLORS.primary}`,
              borderRadius: 8,
              padding: 32,
              textAlign: "center",
              marginBottom: 32,
              boxShadow: "0 2px 6px rgba(60,60,110,0.06)",
              minHeight: 120,
              position: "relative",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".feature"
              style={{ display: "none" }}
              onChange={handleFileChange}
              data-testid="file-input"
            />
            <div style={{
              fontSize: "1.18rem",
              color: "#222",
              marginBottom: 12,
              fontWeight: 600,
            }}>
              {featureFileName
                ? <>Uploaded&nbsp;<b>{featureFileName}</b></>
                : "Drag & drop or "}
              {!featureFileName &&
                (<button
                  className="btn"
                  style={{
                    background: COLORS.primary,
                    color: "#fff",
                    fontWeight: 600,
                    borderRadius: 4,
                    border: "none",
                    padding: "8px 18px",
                    marginLeft: 4,
                    cursor: "pointer",
                  }}
                  onClick={handleUploadClick}
                >
                  Select .feature File
                </button>)}
            </div>
            {!featureFileName &&
              <div style={{
                color: COLORS.primary,
                opacity: 0.7,
                fontSize: "0.96rem"
              }}>
                (The .feature file will not be uploaded to a server, parsing is done locally)
              </div>}
            {error &&
              <div style={{
                color: "crimson",
                marginTop: 8,
                fontWeight: 500,
              }}>{error}</div>}
            {featureFileName &&
              <button
                className="btn"
                style={{
                  background: "transparent",
                  border: "none",
                  color: COLORS.primary,
                  fontSize: "1rem",
                  marginTop: 8,
                  textDecoration: "underline",
                  cursor: "pointer"
                }}
                onClick={handleClear}
              >
                Remove file
              </button>
            }
          </section>

          <div
            style={{
              display: "flex",
              gap: 32,
              flexWrap: "wrap",
              alignItems: "flex-start"
            }}>
            {/* Parsed requirements */}
            <section
              style={{
                flex: "1 1 320px",
                background: "#fff",
                borderRadius: 8,
                padding: 20,
                minHeight: 250,
                boxShadow: "0 2px 8px rgba(80,100,160,0.05)",
                border: `1.5px solid ${COLORS.secondary}`,
                marginBottom: 18,
              }}
            >
              <h2 style={{
                margin: "0 0 14px 0",
                color: COLORS.primary,
                fontWeight: 700,
                fontSize: "1.24rem"
              }}>
                Parsed Requirements
              </h2>
              {!requirements.length && (
                <div style={{
                  color: "#888", fontSize: "1rem", marginTop: 12
                }}>
                  No requirements parsed. Please upload a <b>.feature</b> file to view requirements.
                </div>
              )}
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: "1.03rem" }}>
                {requirements.map((req, idx) => (
                  <li key={idx} style={{
                    margin: "0 0 6px 0",
                    color: req.startsWith("Scenario:") ? COLORS.accent : "#2b2b2b",
                    fontWeight: req.startsWith("Scenario:") ? 700 : 400
                  }}>
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            {/* Panel for generated test cases */}
            <section
              style={{
                flex: "1 1 320px",
                background: "#fff",
                borderRadius: 8,
                padding: 20,
                minHeight: 250,
                boxShadow: "0 2px 8px rgba(80,100,160,0.05)",
                border: `1.5px solid ${COLORS.secondary}`,
                marginBottom: 18,
              }}
            >
              <h2 style={{
                margin: "0 0 14px 0",
                color: COLORS.primary,
                fontWeight: 700,
                fontSize: "1.24rem"
              }}>
                Generated Test Cases
              </h2>
              {!testCases.length && (
                <div style={{
                  color: "#888", fontSize: "1rem", marginTop: 10
                }}>
                  No test cases generated yet. Please upload a valid .feature file.
                </div>
              )}
              {testCases.map((tc, tcIdx) => (
                <div key={tcIdx} style={{
                  border: `1.5px solid ${COLORS.accent}`,
                  borderRadius: 6,
                  margin: "0 0 16px 0",
                  background: "#FDFDF8",
                  boxShadow: "0 1px 4px rgba(40,120,40,0.03)",
                  padding: "10px 16px",
                }}>
                  <div style={{
                    color: COLORS.accent,
                    fontWeight: 600,
                  }}>{tc.scenario}</div>
                  <ul style={{
                    margin: 0, paddingLeft: 14, fontSize: "0.99rem"
                  }}>
                    {tc.steps.map((step, stidx) => (
                      <li key={stidx} style={{ color: "#222", margin: "0 0 3px 0" }}>{step}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
      <footer style={{
        textAlign: "center",
        color: "#999",
        background: "#F7F8FA",
        borderTop: `1px solid ${COLORS.secondary}`,
        fontSize: "0.99rem",
        padding: "18px 0 3px 0"
      }}>
        5GTestGenie &copy; 2024 | Demo Web App - React JS | No data leaves your browser.
      </footer>
    </div>
  );
}

export default App;
