import express from "express";
import { GoogleGenAI } from "@google/genai";
import { protect } from "../middleware/authMiddleware.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import User from "../models/User.js";

const router = express.Router();

const safeText = (text) => (typeof text === "string" ? text.trim() : "");
const truncate = (text, limit = 1200) =>
  text.length > limit ? `${text.slice(0, limit)}...` : text;

const buildCareerPrompt = ({ query, user, resume }) => {
  const skills = user?.skills?.length
    ? user.skills.join(", ")
    : "No skills listed";
  const resumeText = resume?.rawText
    ? truncate(resume.rawText, 1000)
    : "No resume text available.";

  return `You are a helpful career guidance assistant for SkillMatch. Provide concise, actionable advice for career guidance, resume improvement, skill gaps, interview preparation, and job-ready roadmaps. Do not act as a full chatbot or autonomous agent. Keep responses tailored to the user and their profile.\n\nUser query: ${query}\n\nUser profile:\n- Full name: ${safeText(user?.fullname) || "N/A"}\n- Headline: ${safeText(user?.headline) || "N/A"}\n- Summary: ${safeText(user?.summary) || "N/A"}\n- Skills: ${skills}\n- Location: ${safeText(user?.location) || "N/A"}\n\nResume preview:\n${resumeText}\n\nWhen possible, include:\n- A short roadmap\n- Missing skills or knowledge areas\n- Practical suggestions for improvement\n- A mention of the most suitable career direction based on available data\n\nIf the user asks about a specific role, respond with advice for that role. Use bullets or numbered lists for clarity.`;
};

const buildResumeReviewPrompt = ({ resume, user }) => {
  const skills = user?.skills?.length
    ? user.skills.join(", ")
    : "No skills listed";
  const resumeText = resume?.rawText
    ? truncate(resume.rawText, 1500)
    : "No resume text available.";

  return `You are a resume review assistant for SkillMatch. Analyze the user's resume text and provide a clear, concise review. Give the user:\n- Strengths of the resume\n- Areas that need improvement\n- Missing skills or sections\n- Practical next steps to make it stronger for job applications\n\nUser profile skills: ${skills}\n\nResume content:\n${resumeText}\n\nKeep the response actionable and avoid too much general chat.`;
};

const categoryKeywords = {
  resume: [
    "resume",
    "cv",
    "profile",
    "format",
    "layout",
    "summary",
    "experience",
    "achievements",
    "career objective",
    "skills section",
    "bullet",
  ],
  interview: [
    "interview",
    "prepare",
    "questions",
    "mock",
    "stage",
    "panel",
    "technical",
    "behavioral",
    "salary negotiation",
    "follow-up",
  ],
  skill: [
    "skill",
    "learn",
    "learning",
    "development",
    "training",
    "certification",
    "strength",
    "expertise",
    "growth",
    "tools",
  ],
  career: [
    "career",
    "job",
    "role",
    "position",
    "path",
    "industry",
    "future",
    "best career",
    "choose",
    "direction",
    "transition",
  ],
};

const scoreQuery = (query, keywords) =>
  keywords.reduce(
    (score, keyword) => (query.includes(keyword) ? score + 1 : score),
    0,
  );

const detectCategory = (query) => {
  const normalized = query.toLowerCase();
  if (
    /(best|right|ideal).*(career|job|role)|career path|best career|which career|choose.*career/.test(
      normalized,
    )
  ) {
    return "career";
  }

  const scores = Object.fromEntries(
    Object.entries(categoryKeywords).map(([key, keywords]) => [
      key,
      scoreQuery(normalized, keywords),
    ]),
  );

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableAIError = (error) => {
  const status = error?.status || error?.response?.status || error?.code || 0;
  const message = String(error?.message || "").toLowerCase();
  return (
    status === 429 ||
    status === 503 ||
    status === 502 ||
    /quota|rate limit|rate_limit|temporarily unavailable|try again/i.test(
      message,
    )
  );
};

const retryableFetch = async (url, options, retries = 2, backoff = 500) => {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const response = await fetch(url, options);
    if (response.ok) return response;

    const status = response.status;
    const body = await response.text();
    const isRetryable = status === 429 || status >= 500;

    if (attempt === retries || !isRetryable) {
      const error = new Error(`OpenRouter error ${status}: ${body}`);
      error.status = status;
      throw error;
    }

    console.warn(
      `OpenRouter request failed with ${status}. Retrying in ${backoff}ms...`,
    );
    await sleep(backoff);
    backoff *= 2;
  }
};

const generateLocalAssistance = ({ query, user, resume, reason }) => {
  const normalized = query.toLowerCase();
  const lines = [];
  const skills = user?.skills?.length
    ? user.skills.join(", ")
    : "not listed yet";
  const headline = user?.headline ? user.headline : "a focused professional";

  if (reason) {
    lines.push(
      `Note: AI provider failed (${reason}). Showing offline guidance instead.`,
    );
  }

  lines.push(
    `Profile tip: Keep your headline concise and aligned with your target role (${headline}).`,
  );
  lines.push(
    `Skills available: ${skills}. Focus on the most relevant ones for the job you want.`,
  );

  if (
    /resume|cv|experience|format|layout|summary|bullet|achievements/.test(
      normalized,
    )
  ) {
    lines.push(
      "Resume advice: Highlight outcome-based achievements, keep bullet points short, and use keywords from the job description.",
    );
  }

  if (
    /interview|questions|prepare|mock|panel|salary|behavioral/.test(normalized)
  ) {
    lines.push(
      "Interview advice: Practice 3 STAR stories, research the company, and prepare specific examples that show your problem solving.",
    );
  }

  if (
    /skill|learn|training|certification|growth|tools|technology/.test(
      normalized,
    )
  ) {
    lines.push(
      "Skill advice: Build one small project for each new skill and add it to your resume or portfolio.",
    );
  }

  if (/career|job|role|path|transition|industry/.test(normalized)) {
    lines.push(
      "Career advice: Choose roles that match your strongest skills, then fill gaps with targeted learning and projects.",
    );
  }

  if (lines.length === 2) {
    lines.push(
      "General advice: Stay focused on one job path, use measurable results, and keep your resume easy to scan.",
    );
  }

  return lines.join("\n\n");
};

const generateLocalResumeFeedback = ({ resumeText, reason }) => {
  const text = resumeText.slice(0, 1500);
  const sections = {
    experience: /experience/i.test(text),
    education: /education/i.test(text),
    skills: /skill(s)?/i.test(text),
    project: /project(s)?/i.test(text),
  };

  const strengths = [];
  const improvements = [];

  if (sections.experience) strengths.push("Experience section is present.");
  else
    improvements.push(
      "Add an experience section with bullet points that show impact.",
    );

  if (sections.education) strengths.push("Education section is included.");
  else
    improvements.push(
      "Add education details, including institution and dates.",
    );

  if (sections.skills) strengths.push("Skills are listed.");
  else
    improvements.push("Add a concise skills section with relevant keywords.");

  if (sections.project) strengths.push("Project work is described.");
  else improvements.push("Add one or two projects with measurable results.");

  if (text.length > 1300)
    improvements.push(
      "Shorten the resume content to keep it easy to scan and within reasonable length.",
    );
  if (!/\b(action|led|built|improved|designed|managed)\b/i.test(text))
    improvements.push("Use action verbs to describe your accomplishments.");

  if (reason) {
    return `Note: AI provider failed (${reason}). Showing offline resume guidance instead. \n\nStrengths:\n- ${strengths.join("\n- ") || "Not enough detail detected."}\n\nAreas to improve:\n- ${improvements.join("\n- ")}`;
  }

  return `Strengths:\n- ${strengths.join("\n- ") || "Not enough detail detected."}\n\nAreas to improve:\n- ${improvements.join("\n- ")}`;
};

// Helper to call OpenAI SDK, falling back to OpenRouter if needed
const getAIResponse = async ({
  messages,
  openaiModel = "gpt-4o-mini",
  openRouterModel = "openai/gpt-4o-mini",
  temperature = 0.7,
  max_tokens = 150,
}) => {
  const MAX_RETRIES = 2;
  const BASE_DELAY = 500;
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
  let openAIError = null;

  if (hasOpenAI) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: openaiModel,
          messages,
          temperature,
          max_tokens,
        });

        const text = completion.choices?.[0]?.message?.content?.trim();
        if (text) return text;

        openAIError = new Error("OpenAI returned an empty response");
        break;
      } catch (err) {
        openAIError = err;
        if (attempt >= MAX_RETRIES || !isRetryableAIError(err)) {
          console.warn(
            "OpenAI SDK call failed, will attempt OpenRouter if available:",
            err?.message || err,
          );
          break;
        }

        const delay = BASE_DELAY * 2 ** attempt;
        console.warn(
          `OpenAI SDK call failed with retryable error. Retrying in ${delay}ms...`,
          err?.message || err,
        );
        await sleep(delay);
      }
    }
  }

  let openRouterError = null;

  if (hasOpenRouter) {
    try {
      const resp = await retryableFetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: openRouterModel,
            messages,
            temperature,
            max_tokens,
          }),
        },
        MAX_RETRIES,
        BASE_DELAY,
      );

      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (text) return text;
      openRouterError = new Error(
        "OpenRouter returned an unexpected response structure",
      );
      console.warn("OpenRouter returned unexpected response structure:", data);
    } catch (err) {
      openRouterError = err;
      console.error("OpenRouter call failed:", err?.message || err);
    }
  }

  if (hasOpenAI && openAIError) {
    throw openAIError;
  }

  if (hasOpenRouter && openRouterError) {
    throw openRouterError;
  }

  throw new Error(
    "No AI provider configured (OPENAI_API_KEY or OPENROUTER_API_KEY required)",
  );
};

// AI Assistance endpoint
router.post("/assistance", protect, async (req, res) => {
  try {
    const body = req.body || {};
    const { query } = body;

    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Query is required" });
    }

    const user = await User.findById(req.user.id).lean();
    const resume = await Resume.findOne({ user: req.user.id }).lean();
    const prompt = buildCareerPrompt({ query, user, resume });

    const messages = [
      { role: "system", content: prompt },
      { role: "user", content: query },
    ];

    if (!process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY) {
      return res
        .status(200)
        .json({
          response: generateLocalAssistance({
            query,
            user,
            resume,
            reason: "no provider configured",
          }),
        });
    }

    try {
      const response = await getAIResponse({ messages, max_tokens: 700 });
      return res.status(200).json({ response });
    } catch (err) {
      console.warn(
        "AI Assistance primary providers failed, returning fallback:",
        err?.message || err,
      );
      return res
        .status(200)
        .json({
          response: generateLocalAssistance({
            query,
            user,
            resume,
            reason: err?.message || "provider error",
          }),
        });
    }
  } catch (error) {
    console.error("AI Assistance error:", error);
    res.status(500).json({ message: "Failed to generate AI response" });
  }
});
// Get job recommendations based on user skills
router.get("/recommendations", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find jobs matching user's skills
    const userSkills = user.skills || [];
    const matchingJobs = await Job.find({
      status: "active",
      skills: { $in: userSkills },
    })
      .limit(10)
      .select("title company location skills salaryMin salaryMax");

    // Calculate match percentage for each job
    const recommendations = matchingJobs.map((job) => {
      const matchedSkills = job.skills.filter((skill) =>
        userSkills.includes(skill),
      );
      const matchPercentage = Math.round(
        (matchedSkills.length / job.skills.length) * 100,
      );

      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: `$${job.salaryMin} - $${job.salaryMax}`,
        matchPercentage,
        matchedSkills,
        missingSkills: job.skills.filter(
          (skill) => !userSkills.includes(skill),
        ),
      };
    });

    // Sort by match percentage
    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get skill suggestions based on job
router.get("/skill-suggestions/:jobId", protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    const userSkills = user.skills || [];

    const suggestedSkills = job.skills.filter(
      (skill) => !userSkills.includes(skill),
    );

    res.status(200).json({
      jobTitle: job.title,
      currentSkills: userSkills,
      requiredSkills: job.skills,
      suggestedSkills,
      recommendations: suggestedSkills.map((skill) => ({
        skill,
        resources: [
          `Online courses for ${skill}`,
          `Books on ${skill}`,
          `Practice projects for ${skill}`,
        ],
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get resume feedback
router.post("/resume-feedback", protect, async (req, res) => {
  try {
    const body = req.body || {};
    const { resumeText } = body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        message: "Resume text is required",
      });
    }

    // Truncate resume input to a safe length to limit token usage
    const shortResume = resumeText.slice(0, 1500);

    const user = await User.findById(req.user.id).lean();
    const resume = await Resume.findOne({ user: req.user.id }).lean();

    const prompt = buildResumeReviewPrompt({
      resume: { rawText: shortResume },
      user,
    });

    const messages = [
      { role: "system", content: prompt },
      {
        role: "user",
        content:
          "Please review this resume and provide strengths, areas to improve, missing skills, and suggestions.",
      },
    ];

    if (!process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY) {
      return res
        .status(200)
        .json({
          response: generateLocalResumeFeedback({
            resumeText: shortResume,
            reason: "no provider configured",
          }),
        });
    }

    try {
      const responseText = await getAIResponse({ messages, max_tokens: 150 });
      res.status(200).json({ response: responseText });
    } catch (err) {
      console.warn(
        "Resume feedback providers failed, returning local fallback:",
        err?.message || err,
      );
      res
        .status(200)
        .json({
          response: generateLocalResumeFeedback({
            resumeText: shortResume,
            reason: err?.message || "provider error",
          }),
        });
    }
  } catch (error) {
    console.error("Resume Feedback error:", error);
    res.status(500).json({ message: "Failed to generate resume feedback" });
  }
});

export default router;
