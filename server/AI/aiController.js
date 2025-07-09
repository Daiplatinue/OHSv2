import { mainCategoryNames, subcategoryNamesByMainCategory } from "./ai-categories.js"
import fetch from "node-fetch"

export const classifyServiceAI = async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name || !description) {
      return res.status(400).json({ error: "Service name and description are required." })
    }

    const prompt = `You are an expert service classifier for an online home services platform. Your primary goal is to accurately categorize new services and estimate the number of workers typically needed for such a service.

First, critically evaluate if the service name and description are valid and meaningful. A service is invalid if its name or description is nonsensical, clearly spam, or too vague to classify (e.g., "asdfasdf", "test service", "buy now", "random stuff"). If a service is a legitimate offering, it should be considered valid.

If the service is invalid:
- Set "isValid" to false.
- Provide a concise "reason" for why it's invalid.
- Leave "mainCategory", "subCategory", and "workersNeeded" as empty strings or null.

If the service is valid:
- Set "isValid" to true.
- Classify it into an existing main category and, if applicable, an existing subcategory from the provided lists.
- If the service conceptually fits an existing main category but does not perfectly match any of its listed subcategories, then use that existing main category and use the service's original name as the subcategory.
- If the service does NOT fit any of the listed main categories, you MUST create a NEW, appropriate, and descriptive main category name for it. Then, use the service's original name as the subcategory. DO NOT use 'Other' or 'Uncategorized' as a main category if the service is valid. Invent a relevant, descriptive category (e.g., for "Dog Walking", invent "Pet Services").
- Estimate the typical number of workers needed for this service. This should be an integer. Default to 1 if unsure, but try to be realistic (e.g., "Deep Cleaning" might need 2-3, "Roof Replacement" might need 4-5, "Solar Panel Roofing Prep" might need 3, "Leak Repair" might need 1).
- Estimate the approximate time required to complete this service. Provide this in a human-readable format (e.g., "1-2 hours", "30 mins", "1 day", "2-3 days"). Default to "Varies" if unsure.

Here are the available main categories: ${JSON.stringify(mainCategoryNames)}
Here are the available subcategories grouped by their main category: ${JSON.stringify(subcategoryNamesByMainCategory)}

New Service Details:
Name: ${name}
Description: ${description}

Provide your classification as a JSON object with 'isValid' (boolean), 'mainCategory' (string), 'subCategory' (string), 'workersNeeded' (integer), 'estimatedTime' (string), and 'reason' (string, only if isValid is false) fields.

Example Output for an invalid service:
{
"isValid": false,
"reason": "Service name is too vague or nonsensical.",
"mainCategory": "",
"subCategory": "",
"workersNeeded": null
}

Example Output for an existing subcategory (e.g., "Bed Bug Treatment" under "Pest Control Services"):
{
"isValid": true,
"mainCategory": "Pest Control Services",
"subCategory": "Bed Bug Treatment",
"workersNeeded": 2
}

Example Output for a new service under an existing main category but no specific subcategory (e.g., "General Cleaning for Large Homes" under "Home Cleaning Services"):
{
"isValid": true,
"mainCategory": "Home Cleaning Services",
"subCategory": "General Cleaning for Large Homes",
"workersNeeded": 2
}

Example Output for a completely new type of service (e.g., "Dog Walking" where 'Pet Services' is a new main category):
{
"isValid": true,
"mainCategory": "Pet Services",
"subCategory": "Dog Walking",
"workersNeeded": 1
}
Example Output for a service like "Solar Panel Roofing Prep" (under "Roofing Services"):
{
"isValid": true,
"mainCategory": "Roofing Services",
"subCategory": "Solar Panel Roofing Prep",
"workersNeeded": 3,
"estimatedTime": "1-2 days"
}
`
    console.log("AI Prompt:", prompt) // Log the prompt

    // OpenRouter API call
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost:3000", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": process.env.YOUR_SITE_NAME || "Online Home Service", // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0, // Keep temperature low for more deterministic results
      }),
    })

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json()
      console.error("OpenRouter API error:", openRouterResponse.status, errorData)
      return res
        .status(openRouterResponse.status)
        .json({ error: "Failed to get classification from AI.", details: errorData })
    }

    const openRouterData = await openRouterResponse.json()
    const aiResponseText = openRouterData.choices[0].message.content
    console.log("Raw AI Response:", aiResponseText) // Log the raw AI response

    // Remove markdown code block wrapper if present
    const jsonMatch = aiResponseText.match(/```json\n([\s\S]*?)\n```/)
    const cleanedAiResponseText = jsonMatch ? jsonMatch[1] : aiResponseText

    // Attempt to parse the AI's response as JSON
    let classificationResult
    try {
      classificationResult = JSON.parse(cleanedAiResponseText)
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", aiResponseText, parseError)
      // Fallback if AI doesn't return perfect JSON
      classificationResult = {
        isValid: false, // Treat as invalid if parsing fails
        reason: "AI response parsing failed or malformed JSON.",
        mainCategory: "",
        subCategory: "",
        workersNeeded: null, // Default for invalid
      }
    }

    console.log("Parsed AI Classification Result:", classificationResult) // Log the parsed result

    // Basic validation and fallback for AI output structure
    if (typeof classificationResult.isValid !== "boolean") {
      classificationResult.isValid = true // Default to valid if AI doesn't specify
    }
    if (!classificationResult.mainCategory && classificationResult.isValid) {
      // If AI is valid but didn't provide a mainCategory, it's a classification failure.
      // Fallback to a generic category, but ideally the prompt should prevent this.
      classificationResult.mainCategory = "Uncategorized Services"
    }
    if (!classificationResult.subCategory && classificationResult.isValid) {
      classificationResult.subCategory = name // Use service name as subcategory if AI doesn't provide one
    }
    if (!classificationResult.reason && !classificationResult.isValid) {
      classificationResult.reason = "Invalid service details provided by user." // Fallback for invalid without reason
    }
    // NEW: Fallback for workersNeeded
    if (typeof classificationResult.workersNeeded !== "number" || classificationResult.workersNeeded < 1) {
      classificationResult.workersNeeded = 1 // Default to 1 worker if AI doesn't provide a valid number
    }
    if (typeof classificationResult.estimatedTime !== "string" || classificationResult.estimatedTime.trim() === "") {
      classificationResult.estimatedTime = "Varies" // Default to "Varies" if AI doesn't provide a valid time
    }

    return res.status(200).json(classificationResult)
  } catch (error) {
    console.error("Error classifying service:", error)
    return res.status(500).json({ error: "Failed to classify service.", details: error.message })
  }
}