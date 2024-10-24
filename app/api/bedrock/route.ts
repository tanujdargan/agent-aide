// app/api/bedrock/route.ts

import { NextRequest, NextResponse } from "next/server";
import bedrockClient from "@/lib/bedrockClient";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

function createCustomPrompt(userMessage: string): string {
  return `You are a seasoned data scientist specializing in Valorant team formation.

Instructions: Based on the user's request, generate an optimal team composition for Valorant, including player details such as player name, actual name, current team, role, characters, and key contributions. Return the data in JSON format with the following structure:

{
  "playerData": [
    {
      "ign": "string",
      "name": "string",
      "team": "string",
      "role": "string",
      "agents": ["string", "string"],
      "metrics": {
        "impact": number,
        "flexibility": number,
        "consistency": number
      },
      "image": "string" // URL to player image
    },
    // ... up to 5 players
  ],
  "additionalOutput": "string"
}

User Request:
"${userMessage}"

Response:`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userMessage } = body;

    if (!userMessage) {
      return NextResponse.json(
        { error: "User message is required" },
        { status: 400 }
      );
    }

    const prompt = createCustomPrompt(userMessage);

    const command = new InvokeModelCommand({
      modelId: "amazon.titan-text-express-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: prompt,
      }),
    });

    const response = await bedrockClient.send(command);

    let responseString = "";
    for await (const chunk of response.body) {
      responseString += new TextDecoder("utf-8").decode(
        new Uint8Array([chunk])
      );
    }

    // Parse and validate the response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseString);
    } catch (error) {
      console.error("Error parsing response:", error);
      return NextResponse.json(
        { error: "Failed to parse model response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: parsedResponse }, { status: 200 });
  } catch (error: any) {
    console.error("Error invoking model:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}