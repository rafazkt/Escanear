const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const image = body.image;

    if (!image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No se envió ninguna imagen" })
      };
    }

    // Hacer la petición a la API de Plant.id
    const response = await fetch("https://plant.id/api/v3/identification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.PLANT_ID_API_KEY, // 🔑 tu API desde Netlify
      },
      body: JSON.stringify({
        images: [image],
        latitude: 0.0,
        longitude: 0.0,
        similar_images: true,
      }),
    });

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    console.error("Error en identify.js:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al identificar la planta" }),
    };
  }
};

