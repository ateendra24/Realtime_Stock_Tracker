import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: 'trading',
    ai: { gemini: { apiKey: process.env.GEMINI_API_KEY } }
})