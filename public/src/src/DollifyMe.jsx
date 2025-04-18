import React, { useState } from "react";

export default function DollifyMe() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState(null);

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));

    // Simulert AI-transformasjon
    setTimeout(() => {
      setGeneratedUrl(URL.createObjectURL(file));
    }, 2000);
  }

  return (
    <main style={{ maxWidth: "500px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>DollifyMe – Dukkeversjonen av deg!</h1>

      <div style={{ marginBottom: "1rem" }}>
        <h2>Last opp et bilde av deg selv:</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {previewUrl && (
        <div>
          <p>Originalt bilde:</p>
          <img src={previewUrl} alt="Forhåndsvisning" style={{ maxWidth: "100%", borderRadius: "8px" }} />
        </div>
      )}

      {generatedUrl && (
        <div style={{ marginTop: "1rem" }}>
          <p>Din dukkeversjon (simulert):</p>
          <img src={generatedUrl} alt="Dukkeversjon" style={{ maxWidth: "100%", border: "1px solid #ccc", borderRadius: "8px" }} />
        </div>
      )}
    </main>
  );
}
