async function identificar() {
  const fileInput = document.getElementById('imagen');
  if (!fileInput.files.length) {
    alert("Por favor selecciona una imagen.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64 = reader.result.replace(/^data:.+;base64,/, "");

    document.getElementById("resultado").innerHTML = "🔍 Analizando imagen...";

    try {
      const res = await fetch("https://api.plant.id/v3/identification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": "JOChGWnhgfTwaBXV6t9npRW5fewnkc6FXfjBBDMjrcshBna5Cd"        },
        body: JSON.stringify({
          images: [base64],
          similar_images: true
        })
      });

      const data = await res.json();
      if (data.suggestions && data.suggestions.length > 0) {
        const planta = data.suggestions[0].plant_name;
        const prob = (data.suggestions[0].probability * 100).toFixed(2);
        document.getElementById("resultado").innerHTML =
          `<b>Planta detectada:</b> ${planta}<br>
           <b>Confianza:</b> ${prob}%`;
      } else {
        document.getElementById("resultado").innerHTML = "❌ No se pudo identificar.";
      }
    } catch (err) {
      console.error(err);
      document.getElementById("resultado").innerHTML = "⚠️ Error en la conexión.";
    }
  };
  reader.readAsDataURL(fileInput.files[0]);
}
