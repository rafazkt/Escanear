async function identifyPlant() {
  const fileInput = document.getElementById("fileInput");
  const resultDiv = document.getElementById("result");

  if (fileInput.files.length === 0) {
    resultDiv.innerHTML = "<p style='color: red;'>⚠️ Por favor selecciona una imagen.</p>";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64Image = reader.result.split(",")[1];

    resultDiv.innerHTML = "<p>⏳ Analizando imagen, espera un momento...</p>";

    try {
      const response = await fetch("/.netlify/functions/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await response.json();

      if (data && data.result && data.result.classification) {
        const suggestion = data.result.classification.suggestions[0];
        resultDiv.innerHTML = `
          <h3>🌿 Resultado:</h3>
          <p><strong>Nombre científico:</strong> ${suggestion.name}</p>
          <p><strong>Probabilidad:</strong> ${(suggestion.probability * 100).toFixed(2)}%</p>
        `;
      } else {
        resultDiv.innerHTML = "<p>⚠️ No se pudo identificar la planta.</p>";
      }
    } catch (error) {
      resultDiv.innerHTML = "<p style='color: red;'>❌ Error al conectar con Plant.id</p>";
    }
  };

  reader.readAsDataURL(file);
}
