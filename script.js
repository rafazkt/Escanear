document.getElementById("identifyBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("plantImage");
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor selecciona una imagen primero.");
    return;
  }

  // Convertir la imagen a base64
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result.split(",")[1];

    try {
      // Llamada a la función en Netlify
      const response = await fetch("/.netlify/functions/identify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await response.json();
      console.log("Respuesta:", data);

      if (data.result && data.result.result && data.result.result.classification) {
        const suggestion = data.result.result.classification.suggestions[0];
        document.getElementById("result").innerHTML = `
          <h3>🌱 Resultado:</h3>
          <p><strong>Nombre científico:</strong> ${suggestion.name}</p>
          <p><strong>Probabilidad:</strong> ${(suggestion.probability * 100).toFixed(2)}%</p>
          ${suggestion.similar_images && suggestion.similar_images.length > 0 ? `<img src="${suggestion.similar_images[0].url}" width="200">` : ""}
        `;
      } else {
        document.getElementById("result").innerHTML = `<p>No se pudo identificar la planta.</p>`;
      }

    } catch (error) {
      console.error(error);
      document.getElementById("result").innerHTML = `<p>Error al identificar la planta.</p>`;
    }
  };

  reader.readAsDataURL(file);
});
