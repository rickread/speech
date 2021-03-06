// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const {
  TextAnalyticsClient,
  AzureKeyCredential,
} = require("@azure/ai-text-analytics");

const key = process.env.TEXT_ANALYTICS_KEY;
const endpoint = process.env.TEXT_ANALYTICS_ENDPOINT;

export default async (req, res) => {
  if (req.method === "POST") {
    let transcript = req.body.transcript;

    const textAnalyticsClient = new TextAnalyticsClient(
      endpoint,
      new AzureKeyCredential(key)
    );

    console.log("Received transcript: " + transcript);

    let response = await entityRecognition(textAnalyticsClient, transcript);

    res.statusCode = 200;
    res.json({ names: response });
  } else {
    res.statusCode = 400;
  }
};

async function entityRecognition(client, statement) {
  const results = await client.recognizeEntities([statement]);

  let names = [];

  results.forEach((document) => {
    console.log("RECEIVED DOCUMENT", document);

    let personEntities = document.entities.filter(
      (entity) => entity.category === "Person" && entity.confidenceScore >= 0.6
    );

    if (personEntities.length) {
      names = personEntities.map((value) => {
        return value.text;
      });
    }
  });

  return names;
}
