export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);

    const response = await fetch("https://api.plant.id/v3/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.PLANT_ID_API_KEY   // usa tu variable segura
      },
      body: JSON.stringify({
        images: body.images,   // espera una lista de imágenes en base64
        similar_images: true
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
