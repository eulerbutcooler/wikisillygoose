import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GeminiAPI,
});

export async function POST(request: NextRequest) {
  try {
    const { lat, lng } = await request.json();
    if (!lat || !lng) {
      return NextResponse.json(
        {
          error: "Latitude and longitude are required",
        },
        { status: 400 }
      );
    }

    const prompt = `Find 5 interesting places, landmarks, historical sites, or notable locations within 50km radius of coordinates ${lat}, ${lng}.
    
    For each location, provide:
    - name: The name of the place
    - summary: A brief description (maximum 50 words)
    - link: A Wikipedia link if available, otherwise any reliable website about the location
    
    Return the response as a valid JSON array in this exact format:
    [
      {
        "name": "Location Name",
        "summary": "Brief description...",
        "link": "https://en.wikipedia.org/wiki/..."
      }
    ]
    
    Only return the JSON array, no additional text. If you don't give me the pure JSON array without any other characters i'll switch to claude`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const response = result.text;
    try {
      if (!response) {
        console.log("Error generating content");
        return NextResponse.json(
          { error: "Failed to generate content" },
          { status: 500 }
        );
      }
      let cleanedResponse = response.trim();

      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.substring(7);
      }
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.substring(3);
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }

      cleanedResponse = cleanedResponse.trim();
      const sillyg = JSON.parse(cleanedResponse);
      return NextResponse.json({ sillyg });
    } catch {
      console.error("Failed to parse JSON:", response);
      return NextResponse.json(
        { error: "Failed to parse AI response", rawResponse: response },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    console.log(err);
    return NextResponse.json(
      { error: "Failed to get locations from AI", err },
      { status: 500 }
    );
  }
}
