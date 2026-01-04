import { GoogleGenAI, Type } from "@google/genai";
import { DocType } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeRepository = async (repoUrl: string, branch: string): Promise<{ summary: string; techStack: string[] }> => {
  const ai = getAIClient();
  
  // Since we cannot actually clone the repo in the browser, we simulate the analysis 
  // by asking Gemini to hallucinate a plausible project structure based on the repo name/context
  // or by providing a "mock" file list if this were a real backend integration.
  
  const prompt = `
    I am analyzing a software repository located at ${repoUrl} (branch: ${branch}).
    Assume this is a typical modern web application project.
    
    1. Infer the likely technology stack based on the repository name and common patterns.
    2. Provide a brief summary of what this application likely does.
    3. List 3-5 key technical components it would contain.
    
    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          techStack: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) return { summary: "Analysis failed", techStack: [] };
  
  return JSON.parse(text);
};

export const generateDocumentation = async (
  projectName: string, 
  docType: DocType, 
  techStack: string[],
  context: string
): Promise<string> => {
  const ai = getAIClient();

  let systemInstruction = "";
  let userPrompt = "";

  if (docType === DocType.USER_GUIDE) {
    systemInstruction = "You are an expert Technical Writer creating end-user documentation. Focus on features, workflows, and UI interactions. Use clear, non-technical language.";
    userPrompt = `Generate a User Guide for a project named "${projectName}". 
    Context: ${context}. 
    Tech Stack involved: ${techStack.join(', ')}.
    
    Structure the guide with:
    1. Introduction
    2. Getting Started
    3. Key Features
    4. Common Workflows
    5. FAQ
    
    Output in clean Markdown format.`;
  } else if (docType === DocType.TECHNICAL) {
    systemInstruction = "You are a Senior Software Architect. Create detailed technical maintenance documentation. Focus on code structure, data models, API endpoints, and deployment.";
    userPrompt = `Generate Technical Documentation for "${projectName}".
    Context: ${context}.
    Tech Stack: ${techStack.join(', ')}.
    
    Structure:
    1. System Architecture
    2. Database Schema (ERD Description)
    3. API Reference (Key Endpoints)
    4. Setup & Installation
    5. Maintenance & Troubleshooting
    
    Output in clean Markdown format.`;
  } else {
    systemInstruction = "You are a Systems Engineer.";
    userPrompt = `Create an Architecture Overview for "${projectName}". Focus on high-level diagrams (described in text), data flow, and infrastructure.`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userPrompt,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.4
    }
  });

  return response.text || "Failed to generate documentation.";
};

export const generateDiagramDescription = async (projectName: string, type: 'ERD' | 'SEQUENCE'): Promise<string> => {
    const ai = getAIClient();
    const prompt = `Generate a text-based description (Mermaid.js compatible syntax if possible, otherwise clear text) for a ${type} diagram for the project "${projectName}".`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text || "";
}
