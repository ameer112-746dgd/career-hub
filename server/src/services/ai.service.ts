import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

const getGeminiClient = () => {
  if (genAI) return genAI;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.startsWith("AIza")) {
    genAI = new GoogleGenerativeAI(apiKey);
    return genAI;
  }
  return null;
};

const parseAIResponse = (text: string) => {
  try {
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    throw new Error("AI returned invalid JSON format.");
  }
};

/**
 * ULTRA-STRICT JOB ROLE VALIDATOR
 * This blocks nonsense patterns LOCALLY before asking the AI.
 */
export const validateJobRole = async (jobTitle: string) => {
  const title = (jobTitle || "").toLowerCase().trim();

  // --- LAYER 1: LOCAL PATTERN RECOGNITION (Instant Block) ---
  
  // 1. Common keyboard sequences
  const nonsenseSequences = /abcde|qwerty|asdfg|12345|zxcvb|zxcv|asdf|qwer|dfgh/;
  
  // 2. Strings that are mostly random consonants (e.g., "bcdfgh")
  const hasVowels = /[aeiouy]/.test(title);
  
  // 3. Repeating characters (e.g., "aaaaa")
  const repeatingChars = /^(.)\1+$/.test(title);

  if (title.length < 3 || nonsenseSequences.test(title) || !hasVowels || repeatingChars) {
    console.log(`🛡️ Local Guard: Blocked invalid title "${jobTitle}"`);
    return { 
      isValid: false, 
      message: "Please enter a legitimate professional job title (e.g. 'Frontend Developer')." 
    };
  }

  // --- LAYER 2: AI VALIDATION (Only if Key exists) ---
  const client = getGeminiClient();
  if (!client) {
    console.warn("⚠️ GEMINI_API_KEY not found. Local guard passed, allowing for dev purposes.");
    return { isValid: true }; 
  }

  try {
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Is "${jobTitle}" a real professional career role? Return ONLY JSON: { "isValid": boolean, "message": "string" }`);
    return parseAIResponse(result.response.text());
  } catch (error) {
    return { isValid: true }; // Fallback to allow if API is temporarily down
  }
};

/**
 * RANDOMIZED QUESTION GENERATOR (10 Questions)
 */
export const generateInterviewQuestions = async (jobTitle: string, jobDescription: string) => {
  const client = getGeminiClient();
  if (!client) return { questions: ["Describe your technical stack.", "How do you handle project stress?", "Explain your debugging process.", "What are your career goals?", "Why this company?", "Describe a challenge.", "Tell me about a project.", "How do you learn?", "Team conflict?", "Why you?"] };

  try {
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Act as a Top Recruiter. Generate 10 unique, professional interview questions for a ${jobTitle} role. Context: ${jobDescription}. Return ONLY JSON: { "questions": ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"] }`;
    const result = await model.generateContent(prompt);
    return parseAIResponse(result.response.text());
  } catch (error) {
    return { questions: ["Describe your experience.", "What are your strengths?"] };
  }
};

/**
 * AI INTERVIEW EVALUATOR
 */
export const evaluateInterviewAnswer = async (question: string, answer: string, jobTitle: string) => {
  const client = getGeminiClient();
  if (!client) return { isRelevant: answer.trim().length > 15, score: 70, feedback: "Good effort." };

  try {
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Evaluate this answer for a ${jobTitle} role. Question: "${question}", Answer: "${answer}". If it is nonsense or too short, isRelevant: false. Return ONLY JSON: { "isRelevant": boolean, "score": number, "feedback": "string" }`;
    const result = await model.generateContent(prompt);
    return parseAIResponse(result.response.text());
  } catch (error) { return { isRelevant: true, score: 50, feedback: "API busy." }; }
};

/**
 * AI RESUME ANALYZER
 */
export const analyzeResumeContent = async (resumeData: any) => {
  const client = getGeminiClient();
  if (!client) return { score: 75, feedback: ["Include more keywords."] };
  try {
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Analyze resume JSON for ATS. Return ONLY JSON: { "score": number, "feedback": string[], "missingKeywords": string[] }`);
    return parseAIResponse(result.response.text());
  } catch (error) { return { score: 60, feedback: ["Failed to analyze."] }; }
};