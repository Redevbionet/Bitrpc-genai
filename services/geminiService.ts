import { GoogleGenAI } from "@google/genai";
import { BITCOIN_RPC_DOCS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateScript = async (prompt: string): Promise<string> => {
  const fullPrompt = `
    You are an expert Python developer specializing in Bitcoin and Cryptocurrency development.
    Your task is to generate a Python script using the 'python-bitcoinrpc' library based on the user's request.
    
    Here is the library documentation you must strictly adhere to:
    ${BITCOIN_RPC_DOCS}

    USER REQUEST: "${prompt}"

    Instructions:
    1. Provide a complete, runnable Python script.
    2. Include comments explaining key parts.
    3. Ensure error handling (JSONRPCException) is included.
    4. Do not include markdown formatting (like \`\`\`) in the output, just the raw code.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    return response.text || "# No code generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "# Error generating script. Please check your API key and try again.";
  }
};

export const simulateRpcResponse = async (method: string, params: string): Promise<string> => {
  const fullPrompt = `
    You are a simulator for a Bitcoin Core node JSON-RPC interface.
    The user wants to see what the JSON response looks like for the method: "${method}".
    Parameters provided: "${params}".

    Instructions:
    1. Return ONLY valid JSON.
    2. Do not include any explanations or markdown.
    3. Generate realistic mock data (hashes, timestamps, etc.).
    4. If the method is unknown, return a JSON-RPC error object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    // Strip markdown code blocks if present
    let text = response.text || "{}";
    text = text.replace(/```json/g, '').replace(/```/g, '');
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return JSON.stringify({ error: "Failed to simulate response" }, null, 2);
  }
};

export const simulateBatchRpcResponse = async (requests: {method: string, params: string}[]): Promise<string> => {
  const requestsString = requests.map((r, i) => `Request ${i+1}: Method="${r.method}", Params="${r.params}"`).join('\n');
  const fullPrompt = `
    You are a simulator for a Bitcoin Core node JSON-RPC interface handling a BATCH request.
    The user sent the following commands in a single HTTP batch:

    ${requestsString}

    Instructions:
    1. Return ONLY a valid JSON Array containing the responses.
    2. Do not include any explanations or markdown.
    3. Generate realistic mock data.
    4. The output must be a JSON array of objects, where each object corresponds to a request.
    5. Each response object should include 'result', 'error', and 'id'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    let text = response.text || "[]";
    text = text.replace(/```json/g, '').replace(/```/g, '');
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return JSON.stringify([{ error: "Failed to simulate batch response" }], null, 2);
  }
};

export const chatWithAssistant = async (history: {role: string, content: string}[], message: string): Promise<string> => {
  const systemInstruction = `
    You are a helpful assistant for the 'python-bitcoinrpc' library. 
    Use the following documentation to answer user questions:
    ${BITCOIN_RPC_DOCS}
    
    Keep answers concise and code-focused.
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
      history: history.map(h => ({ role: h.role, parts: [{ text: h.content }] }))
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I encountered an error communicating with the API.";
  }
};