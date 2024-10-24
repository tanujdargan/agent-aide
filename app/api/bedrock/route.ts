// app/api/bedrock/route.ts

import { NextResponse } from 'next/server';
import {
  BedrockClient,
  InvokeAgentCommand,
} from '@aws-sdk/client-bedrock';

// Helper function to read the response body stream
async function streamToString(stream: any): Promise<string> {
  const chunks = [];
  const reader = stream.getReader();
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = doneReading;
  }

  const decoder = new TextDecoder('utf-8');
  const decoded = chunks.map((chunk) => decoder.decode(chunk));
  return decoded.join('');
}

export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();
    const userMessage = formData.get('userMessage');

    if (!userMessage) {
      return NextResponse.json({ error: 'No user message provided' }, { status: 400 });
    }

    // Set up AWS Bedrock client
    const client = new BedrockClient({
      region: process.env.AWS_REGION,
      // Credentials are automatically picked up from environment variables or config files
      // Ensure AWS credentials are configured correctly
    });

    // The agentId of your custom agent on Bedrock
    const agentId = process.env.BEDROCK_AGENT_ID;

    if (!agentId) {
      return NextResponse.json({ error: 'BEDROCK_AGENT_ID is not set' }, { status: 500 });
    }

    // Prepare the input for InvokeAgentCommand
    const params = {
      agentId: agentId, // Your custom agent's ID or ARN
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        inputText: userMessage,
      }),
    };

    const command = new InvokeAgentCommand(params);

    const response = await client.send(command);

    // Read and parse the response body
    const responseBody = await response.body.text();

    const data = JSON.parse(responseBody);

    return NextResponse.json({ result: data });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
};