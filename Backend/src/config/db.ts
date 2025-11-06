import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

const isOffline = process.env.NODE_ENV !== 'production';

export const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'local',
  endpoint: isOffline ? process.env.DYNAMODB_LOCAL_ENDPOINT : process.env.AWS_DB_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fake',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fake'
  }
});

export const tableName = 'kids-cycle';

// // config/db.ts

// // ✅ DocumentClient → for runtime operations

// import { DynamoDB } from 'aws-sdk';
// import dotenv from 'dotenv';
// dotenv.config();

// const isOffline = process.env.NODE_ENV !== 'production';

// export const DynamoDBClient = new DynamoDB.DocumentClient({
//   region: process.env.AWS_REGION,
//   endpoint: isOffline ? process.env.DYNAMODB_LOCAL_ENDPOINT : undefined,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

// export const RawDynamoClient = new DynamoDB({
//   region: process.env.AWS_REGION,
//   endpoint: isOffline ? process.env.DYNAMODB_LOCAL_ENDPOINT : undefined,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });
