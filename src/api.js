
const API_BASE_URL = "https://skill-graph-backend-api.onrender.com";

// Common function to communicate with the backend
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });

    // Read the response
    const responseText = await response.text();

    // Handle backend errors
    if (!response.ok) {
      throw new Error(
        `API Error (${response.status}): ${responseText}`
      );
    }

    // Convert response into JSON
    return responseText ? JSON.parse(responseText) : null;

  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

// 1. Backend health check
export function getHealth() {
  return apiRequest("/api/v1/health");
}

// 2. Get skill graph
export function getSkillGraph() {
  return apiRequest("/api/v1/graph");
}

// 3. Get quiz questions
export function getQuiz(skillId) {
  return apiRequest(
    `/api/v1/skills/${encodeURIComponent(skillId)}/quiz`
  );
}

// 4. Submit quiz answers
export function submitQuiz(skillId, answers) {
  return apiRequest(
    `/api/v1/skills/${encodeURIComponent(skillId)}/quiz`,
    {
      method: "POST",
      body: JSON.stringify(answers),
    }
  );
}

// 5. Get user progress
export function getProgress() {
  return apiRequest("/api/v1/progress");
}
