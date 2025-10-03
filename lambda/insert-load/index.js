// lambda/index.js
// Node.js 18+; using AWS SDK v3 with DynamoDBDocumentClient for convenience.

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-east-1";
const TABLE_NAME = process.env.LOADS_TABLE || "Loads";

const ddb = new DynamoDBClient({ region: REGION });
const ddbDoc = DynamoDBDocumentClient.from(ddb);

export const handler = async (event) => {
  try {
    // allow warmup / health check
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Loads service ok" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    let body;
    try {
      body = JSON.parse(event.body);
    } catch (err) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: "Invalid JSON body" }),
      };
    }

    // Basic validation
    const required = ["load_number", "pickup_date", "delivery_date", "origin", "destination", "trailer_type"];
    for (const r of required) {
      if (!body[r]) {
        return {
          statusCode: 400,
          headers: corsHeaders(),
          body: JSON.stringify({ error: `${r} is required` }),
        };
      }
    }

    const now = new Date().toISOString();

    const item = {
      load_number: body.load_number,
      pickup_date: body.pickup_date,
      delivery_date: body.delivery_date,
      origin: body.origin,
      destination: body.destination,
      trailer_type: body.trailer_type,
      equipment_requirement: body.equipment_requirement || "",
      miles: typeof body.miles !== "undefined" ? Number(body.miles) : null,
      rate: typeof body.rate !== "undefined" ? Number(body.rate) : null,
      frequency: body.frequency || "once",
      comment: body.comment || "",
      status: body.status || "AVAILABLE",
      createdAt: now,
      updatedAt: now,
    };

    // Remove null fields (Dynamo won't like explicit null unless using DocumentClient options)
    Object.keys(item).forEach((k) => {
      if (item[k] === null || typeof item[k] === "undefined") delete item[k];
    });

    await ddbDoc.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
        ConditionExpression: "attribute_not_exists(load_number)", // fail if already exists
      })
    );

    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Load created", item }),
    };
  } catch (err) {
    console.error("lambda error", err);
    const isConditional = err?.name === "ConditionalCheckFailedException";
    return {
      statusCode: isConditional ? 409 : 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: isConditional ? "Load already exists" : "Internal Server Error" }),
    };
  }
};

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // tighten for production
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
  };
}
