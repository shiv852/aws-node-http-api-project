"use strict";
const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const kaamBharo = async (event) => {
  let body;

  // Safely parse event.body
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    console.error("Invalid JSON:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON format in request body." }),
    };
  }

  const { kaam } = body;

  // Validate input
  if (!kaam || typeof kaam !== "string" || kaam.trim() === "") {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "'kaam' is required and must be a non-empty string." }),
    };
  }

  const newKaam = {
    id: v4(),
    kaam: kaam.trim(),
    createdAt: new Date().toISOString(),
    completed: false,
  };

  try {
    await dynamoDb.put({
      TableName: "KaamKaro",
      Item: newKaam,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(newKaam),
    };
  } catch (error) {
    console.error("DynamoDB error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to save data.", error: error.message }),
    };
  }
};

module.exports = {
  handler: kaamBharo,
};
