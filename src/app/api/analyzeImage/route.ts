import { NextResponse } from 'next/server';
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const Nutrition = z.object({
    calories: z.number(),
    carbs: z.number(),
    protein: z.number(),
    fat: z.number()
});

const Ingredients = z.object({
    name: z.string(),
    amount: z.string(),
    nutrition: Nutrition
});

const Total = z.object({
    total_calories: z.number(),
    total_carbs: z.number(),
    total_protein: z.number(),
    total_fat: z.number()
})

const JSONFormat = z.object({
    dishName: z.string(),
    ingredients: z.array(Ingredients),
    total_nutrition: Total
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Route Handlers let us create API logic
// POST api/analyzeImage
export async function POST(request: Request) {
    // { image: "ASDFASDFASDF base64 string" }
    const { image } = await request.json();
    console.log('input image', image);
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 1000, // No max tokens: super short / cut off response.
        response_format: zodResponseFormat(JSONFormat, "JSON_format"),
        messages: [ // GPT-4 with Vision is JUST GPT-4. So you can still talk with it like GPT-4
            // There is no "system" message (THIS MAY CHANGE)
            {
                role: "user",
                //@ts-ignore
                content: [
                    { type: "text", text: `You are a system generating calories and nutrition values from a picture of food. 
Provided with an image, you will list out the ingredients in the food with its corresponding calories and nutrition values.
Please output the information in structured JSON format without using markdown code blocks.
` },
                    {
                        type: "image_url",
                        image_url: {
                            url: image, // base64 images
                            detail: "low"
                        }
                    }
                ],
            }
        ]
    });
    console.log('response.choices[0]', response.choices[0]);
    // return response.choices[0];
    return NextResponse.json(response);
    // return new Response(JSON.stringify(response));
}