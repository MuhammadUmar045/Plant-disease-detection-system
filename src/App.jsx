import { useEffect, useMemo, useRef, useState } from "react";

const apiCandidates = [
  import.meta.env.VITE_API_BASE_URL,
  "https://muhamadumar-plant-disease-api.hf.space",
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
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    checkHealth();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

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

    setErrorMessage("");
    setPrediction(null);
    setSelectedFile(file);
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    applyFile(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    applyFile(file);
  }

  async function handlePredict() {
    if (!selectedFile) {
      setErrorMessage("Select an image first.");
      return;
    }

    setIsPredicting(true);
    setErrorMessage("");
    setPrediction(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

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

  return (
    <main className="page">
      <div className="bg-shape bg-shape-a" />
      <div className="bg-shape bg-shape-b" />

      <header className="header">
        <p className="kicker">Computer Vision Lab</p>
        <h1>Plant Disease Detection System</h1>
        <p className="subtitle">
          Upload a leaf image to detect disease classes with model confidence and top prediction distribution.
        </p>
      </header>

      <section className="status-card">
        <div>
          <h2>Backend Status</h2>
          <p>{backendInfo}</p>
        </div>
        <div className={`status-badge status-${backendStatus}`}>
          {backendStatus === "checking" ? "Checking" : backendStatus}
        </div>
        <button className="ghost-btn" onClick={checkHealth} type="button">
          Recheck
        </button>
      </section>

      <section className="workspace">
        <div
          className={`dropzone ${isDragOver ? "drag-over" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            hidden
            onChange={handleFileChange}
          />
          <p className="drop-label">Drop a leaf image here</p>
          <p className="drop-hint">PNG or JPG supported</p>
          <button className="primary-btn" type="button" onClick={() => inputRef.current?.click()}>
            Choose Image
          </button>

          {previewUrl ? (
            <figure className="preview-wrap">
              <img src={previewUrl} alt="Selected plant" className="preview" />
              <figcaption>{selectedFile?.name}</figcaption>
            </figure>
          ) : null}
        </div>

        <div className="results-panel">
          <button
            className="predict-btn"
            type="button"
            onClick={handlePredict}
            disabled={isPredicting || !selectedFile || backendStatus === "offline"}
          >
            {isPredicting ? "Analyzing..." : "Run Prediction"}
          </button>

          {errorMessage ? <p className="error">{errorMessage}</p> : null}

          {prediction ? (
            <>
              <article className="top-result">
                <h3>{prediction.disease}</h3>
                <p>Main Confidence: {formatConfidence(prediction.confidence)}</p>
              </article>

              {prediction.is_uncertain ? (
                <section className="uncertain-box">
                  <h4>Low Confidence Alert</h4>
                  <p>
                    {prediction.uncertainty_note} Threshold: {formatConfidence(prediction.uncertainty_threshold)}.
                  </p>
                </section>
              ) : null}

              {prediction.management ? (
                <section className="advice-box">
                  <h4>Suggested Management</h4>
                  <p>{prediction.management.summary}</p>
                  <ul>
                    {(prediction.management.actions || []).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                  <p className="advice-escalate">{prediction.management.when_to_escalate}</p>
                  <p className="advice-disclaimer">{prediction.management.disclaimer}</p>
                </section>
              ) : null}

              <div className="bars">
                {topPredictions.map(([label, score]) => (
                  <div key={label} className="bar-item">
                    <div className="bar-meta">
                      <span className="label">{label}</span>
                      <span className="score">{formatConfidence(score)}</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${Math.min(score, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="empty">Prediction output will appear here.</p>
          )}
        </div>
      </section>
    </main>
  );
}
