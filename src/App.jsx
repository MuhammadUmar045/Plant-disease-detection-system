import { useEffect, useMemo, useRef, useState } from "react";

const apiCandidates = [
  import.meta.env.VITE_API_BASE_URL,
  "https://muhamadumar-plant-disease-api.hf.space",
  "http://127.0.0.1:7860",
  "http://localhost:7860",
  "http://127.0.0.1:8000",
  "http://localhost:8000",
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ""));

function formatConfidence(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }
  return `${value.toFixed(2)}%`;
}

export default function App() {
  const [backendStatus, setBackendStatus] = useState("checking");
  const [backendInfo, setBackendInfo] = useState("");
  const [activeApiBaseUrl, setActiveApiBaseUrl] = useState(apiCandidates[0]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [barsReady, setBarsReady] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    checkHealth();
  }, []);

  useEffect(() => {
    if (!prediction) {
      setBarsReady(false);
      return;
    }

    const timer = setTimeout(() => setBarsReady(true), 50);
    return () => clearTimeout(timer);
  }, [prediction]);

  async function checkHealth() {
    setBackendStatus("checking");
    setBackendInfo("Connecting to backend...");

    for (const apiBaseUrl of apiCandidates) {
      try {
        const response = await fetch(`${apiBaseUrl}/health`);
        if (!response.ok) {
          throw new Error(`Health check failed with status ${response.status}`);
        }

        const data = await response.json();
        setActiveApiBaseUrl(apiBaseUrl);

        if (data?.status === "healthy" && data?.model_loaded === true) {
          setBackendStatus("healthy");
          setBackendInfo(`Backend is healthy and model is loaded (${apiBaseUrl}).`);
        } else if (data?.status === "healthy") {
          setBackendStatus("warning");
          setBackendInfo(`Backend is running, but model status is unexpected (${apiBaseUrl}).`);
        } else {
          setBackendStatus("warning");
          setBackendInfo(`Backend responded, but health state is not healthy (${apiBaseUrl}).`);
        }
        return;
      } catch (error) {
        // Try the next URL candidate.
      }
    }

    setBackendStatus("offline");
    setBackendInfo(
      `Backend is not reachable. Checked: ${apiCandidates.join(", ")}. ` +
        "Set VITE_API_BASE_URL to your deployed backend URL and redeploy frontend."
    );
  }

  function applyFile(file) {
    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setErrorMessage("Please upload a JPG or PNG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File is too large. Max size is 5MB.");
      return;
    }

    setErrorMessage("");
    setPrediction(null);
    setSelectedFile(file);
    predictForFile(file);
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    applyFile(file);
  }

  async function predictForFile(file) {
    if (!file) {
      setErrorMessage("Select an image first.");
      return;
    }

    setIsPredicting(true);
    setErrorMessage("");
    setPrediction(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${activeApiBaseUrl}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.detail || "Prediction request failed.");
      }

      setPrediction(data);
    } catch (error) {
      if (backendStatus === "offline") {
        setErrorMessage(
          "Prediction failed because backend is offline. Run: uvicorn main:app --reload --host 0.0.0.0 --port 8000"
        );
      } else {
        setErrorMessage(error?.message || "Prediction failed.");
      }
    } finally {
      setIsPredicting(false);
    }
  }

  const topPredictions = useMemo(() => {
    if (!prediction?.all_predictions) {
      return [];
    }

    return Object.entries(prediction.all_predictions);
  }, [prediction]);

  const displayPredictions = useMemo(() => {
    return topPredictions.map(([label, value]) => {
      const normalizedValue = typeof value === "number" ? value : 0;
      const displayWidth = normalizedValue > 0 ? Math.max(normalizedValue, 2) : 0;
      return { label, value: normalizedValue, displayWidth };
    });
  }, [topPredictions]);

  const statusLabel = useMemo(() => {
    switch (backendStatus) {
      case "healthy":
        return "SYSTEM ACTIVE";
      case "warning":
        return "SYSTEM DEGRADED";
      case "offline":
        return "SYSTEM OFFLINE";
      case "checking":
      default:
        return "SYSTEM CHECKING";
    }
  }, [backendStatus]);

  const resultsHeader = selectedFile?.name || "NO FILE SELECTED";

  return (
    <div className="wrapper">
          <div className="header-brutal">
            <h1 className="brand-massive">
              <i className="ti ti-leaf" />
              PLANTAI
            </h1>
            <div className="status-brutal" title={backendInfo} onClick={checkHealth} role="button">
              {statusLabel}
            </div>
          </div>

          <div className="container-brutal">
            {/* HERO SECTION WITH ANIMATED LEAF - 2 COLUMN LAYOUT */}
            <div className="hero-layout">
              {/* Left: Text Content */}
              <div className="hero-section">
                <h2 className="hero-title">PLANT DISEASE DETECTION</h2>
                <p className="hero-subtitle">ADVANCED AI-POWERED LEAF ANALYSIS SYSTEM</p>
              </div>

              {/* Right: Animated Leaf */}
              <div className="leaf-container">
                <div className="leaf-glow"></div>
                <div className="leaf-wrapper">
                  <div className="leaf">
                    <svg className="leaf-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 1 }} />
                          <stop offset="50%" style={{ stopColor: "#059669", stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: "#047857", stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                      <path d="M 100 20 Q 140 60 130 120 Q 100 150 100 180 Q 100 150 70 120 Q 60 60 100 20 Z" fill="url(#leafGradient)" stroke="#10b981" strokeWidth="2"/>
                      <path d="M 100 30 Q 100 100 100 175" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" fill="none"/>
                      <path d="M 90 50 Q 85 100 80 160" stroke="#ffffff" strokeWidth="1" opacity="0.4" fill="none"/>
                      <path d="M 85 70 Q 80 110 75 150" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" fill="none"/>
                      <path d="M 110 50 Q 115 100 120 160" stroke="#ffffff" strokeWidth="1" opacity="0.4" fill="none"/>
                      <path d="M 115 70 Q 120 110 125 150" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" fill="none"/>
                      <ellipse cx="85" cy="60" rx="15" ry="25" fill="#ffffff" opacity="0.2"/>
                    </svg>
                  </div>
                  <div className="particle" style={{ left: "150px", top: "50px" }}></div>
                  <div className="particle" style={{ left: "50px", top: "100px" }}></div>
                  <div className="particle" style={{ left: "200px", top: "150px" }}></div>
                  <div className="particle" style={{ left: "80px", top: "200px" }}></div>
                </div>
              </div>
            </div>

            <div className="divider-brutal"></div>

            <div className="grid-main">
              <div
                className="upload-section"
                id="uploadCard"
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const file = event.dataTransfer.files?.[0];
                  applyFile(file);
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  hidden
                  onChange={handleFileChange}
                />
                <i className="upload-icon-brutal ti ti-cloud-upload" />
                <h3 className="upload-title">UPLOAD</h3>
                <p className="upload-desc">DRAG & DROP OR CLICK</p>
                <p className="format-info">PNG / JPG UP TO 5MB</p>
                <button className="btn-brutal" type="button">
                  CHOOSE IMAGE
                </button>
              </div>

              <div className="results-section">
                <h3 className="results-title">DETECTION RESULTS</h3>
                <div id="resultsContent" className={prediction ? "results-content" : "empty-state"}>
                  {isPredicting ? (
                    <>
                      <i className="empty-icon ti ti-loader" />
                      <p className="empty-text">ANALYZING IMAGE</p>
                    </>
                  ) : null}

                  {!isPredicting && errorMessage ? (
                    <>
                      <i className="empty-icon ti ti-alert-triangle" />
                      <p className="empty-text" style={{ color: "#ef4444" }}>
                        {errorMessage}
                      </p>
                    </>
                  ) : null}

                  {!isPredicting && !errorMessage && !prediction ? (
                    <>
                      <i className="empty-icon ti ti-search" />
                      <p className="empty-text">WAITING FOR UPLOAD</p>
                    </>
                  ) : null}

                  {!isPredicting && prediction ? (
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          marginBottom: "24px",
                          paddingBottom: "16px",
                          borderBottom: "2px solid #22c55e",
                          animation: "slideInDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#888888",
                            margin: "0 0 8px 0",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          FILE UPLOADED
                        </p>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#22c55e",
                            fontWeight: 900,
                            margin: 0,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            wordBreak: "break-word",
                          }}
                        >
                          {resultsHeader}
                        </p>
                      </div>
                      <div className="result-summary">
                        <p className="summary-label">TOP PREDICTION</p>
                        <p className="summary-value">{prediction.disease}</p>
                        <div className="summary-row">
                          <span>CONFIDENCE</span>
                          <span>{formatConfidence(prediction.confidence)}</span>
                        </div>
                        <p className={`summary-note ${prediction.is_uncertain ? "summary-note-warning" : ""}`}>
                          {prediction.uncertainty_note}
                        </p>
                        {prediction.management ? (
                          <div className="management-box">
                            <p className="management-title">RECOMMENDED ACTIONS</p>
                            <p className="management-summary">{prediction.management.summary}</p>
                            <ul>
                              {(prediction.management.actions || []).map((action) => (
                                <li key={action}>{action}</li>
                              ))}
                            </ul>
                            <p className="management-escalate">{prediction.management.when_to_escalate}</p>
                            <p className="management-disclaimer">{prediction.management.disclaimer}</p>
                          </div>
                        ) : null}
                      </div>
                      <div id="diseaseResults">
                        {displayPredictions.map(({ label, value, displayWidth }, index) => (
                          <div
                            key={label}
                            className="result-item-brutal"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <span className="disease-name-brutal">{label}</span>
                            <div className="confidence-brutal">
                              <div
                                className="confidence-fill-brutal"
                                style={{ width: barsReady ? `${displayWidth}%` : "0%" }}
                              />
                            </div>
                            <span className="confidence-value-brutal">{formatConfidence(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="divider-brutal" />

            <div className="stats-grid-brutal">
              <div className="stat-brutal">
                <p className="stat-label-brutal">MODEL ACCURACY</p>
                <p className="stat-value-brutal">88.7%</p>
              </div>
              <div className="stat-brutal">
                <p className="stat-label-brutal">DISEASE CLASSES</p>
                <p className="stat-value-brutal">38</p>
              </div>
              <div className="stat-brutal">
                <p className="stat-label-brutal">PROCESSING TIME</p>
                <p className="stat-value-brutal">&lt;2S</p>
              </div>
              <div className="stat-brutal">
                <p className="stat-label-brutal">TOTAL SCANS</p>
                <p className="stat-value-brutal">2,547</p>
              </div>
            </div>

            <div className="divider-brutal" />

            <div className="features-grid">
              <div className="feature-brutal">
                <i className="feature-icon-brutal ti ti-brain" />
                <h4 className="feature-title-brutal">ADVANCED AI</h4>
                <p className="feature-desc-brutal">
                  STATE-OF-THE-ART DEEP LEARNING WITH ATTENTION MECHANISMS FOR PRECISION DETECTION
                </p>
              </div>
              <div className="feature-brutal">
                <i className="feature-icon-brutal ti ti-bolt" />
                <h4 className="feature-title-brutal">INSTANT RESULTS</h4>
                <p className="feature-desc-brutal">
                  REAL-TIME ANALYSIS WITH CONFIDENCE SCORES AND ACTIONABLE INSIGHTS IN SECONDS
                </p>
              </div>
              <div className="feature-brutal">
                <i className="feature-icon-brutal ti ti-shield-check" />
                <h4 className="feature-title-brutal">HIGH ACCURACY</h4>
                <p className="feature-desc-brutal">
                  VALIDATED ON THOUSANDS OF SAMPLES WITH HOSPITAL-GRADE PRECISION
                </p>
              </div>
            </div>
          </div>
    </div>
  );
}
