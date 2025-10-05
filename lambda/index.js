const {DynamoDBClient, PutItemCommand} = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({
    region: "us-east-1",
    
});