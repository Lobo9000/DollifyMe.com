import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setPreviewUrl(reader.result);
      setLoading(true);

      try {
        const response = await axios.post(
          "https://api.replicate.com/v1/predictions",
          {
            version: "cbf361e0c1304d4695e3511aa4cc9739a421528aa2b86e7517e8cdbb6c0d60c0", // Cartoon GAN
            input: {
              image: reader.result,
            },
          },
          {
            headers: {
              Authorization: `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const statusUrl = response.data.urls.get;

        let output;
        while (!output) {
          const statusRes = await axios.get(statusUrl, {
            headers: {
              Authorization: `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
            },
          });
          if (statusRes.data.status === "succeeded") {
            output = statusRes.data.output;
            setGeneratedUrl(output);
          } else if (statusRes.data.status === "failed") {
            throw new Error("Generering feilet");
          }
          await new Promise((res) => setTimeout(res, 1000));
        }
      } catch (err) {
        alert("Feil under generering: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  }

  return (
    <main style={{ maxWidth: "500px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>DollifyMe – AI Dukkeversjon</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {previewUrl && (
        <div style={{ marginTop: "1rem" }}>
          <p>Originalt bilde:</p>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%" }} />
        </div>
      )}

      {loading && <p>Genererer dukkeversjon...</p>}

      {generatedUrl && (
        <div style={{ marginTop: "1rem" }}>
          <p>Dukkeversjon (AI):</p>
          <img src={generatedUrl} alt="Generated" style={{ maxWidth: "100%", borderRadius: "10px" }} />
        </div>
      )}
    </main>
  );
}