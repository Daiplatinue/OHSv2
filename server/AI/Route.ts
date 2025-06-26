import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { serviceSubcategories, products } from "../../front/src/sections/Home-data"

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json()

    if (!name || !description) {
      return new Response(JSON.stringify({ error: "Service name and description are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Prepare the list of main categories and their subcategories for the AI prompt
    const mainCategories = products.map((p) => p.name)
    const subcategoryMap: { [key: string]: string[] } = {}
    for (const category in serviceSubcategories) {
      subcategoryMap[category] = serviceSubcategories[category as keyof typeof serviceSubcategories].map(
        (sub) => sub.name,
      )
    }

    const prompt = `You are an expert service classifier. Your task is to analyze a new service's name and description and classify it into an existing main category and, if applicable, a subcategory.

Here are the available main categories: ${JSON.stringify(mainCategories)}
Here are the available subcategories grouped by their main category: ${JSON.stringify(subcategoryMap)}

If a service clearly fits into one of the listed subcategories, assign both the main category and the specific subcategory.
If a service fits a main category but does not match any existing subcategory, assign only the main category and leave the subcategory as an empty string.
If a service does not fit any of the listed main categories, assign it to 'Other' as the category and leave the subcategory as an empty string.

New Service Details:
Name: ${name}
Description: ${description}

Provide your classification as a JSON object with 'category' and 'subcategory' fields.

Example Output:
{
"category": "Pest Control Services",
"subcategory": "Bed Bug Treatment"
}

Example Output for a new service under an existing category but no specific subcategory:
{
"category": "Pest Control Services",
"subcategory": ""
}

Example Output for a completely new type of service:
{
"category": "Other",
"subcategory": ""
}
`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0, // Keep temperature low for more deterministic results
    })

    // Attempt to parse the AI's response as JSON
    let classificationResult: { category: string; subcategory: string }
    try {
      classificationResult = JSON.parse(text)
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", text, parseError)
      // Fallback if AI doesn't return perfect JSON
      classificationResult = { category: "Other", subcategory: "" }
    }

    // Basic validation of AI output
    if (!classificationResult.category) {
      classificationResult.category = "Other"
    }
    if (!classificationResult.subcategory) {
      classificationResult.subcategory = ""
    }

    return new Response(JSON.stringify(classificationResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error classifying service:", error)
    return new Response(JSON.stringify({ error: "Failed to classify service." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}