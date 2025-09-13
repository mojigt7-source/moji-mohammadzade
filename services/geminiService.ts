
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationOptions, GeneratedCaption, Tone } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please create a .env.local file with API_KEY=<YOUR_API_KEY>");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  [Tone.CASUAL]: "نوشتن به سبکی آرام، دوستانه و محاوره‌ای. در صورت لزوم از اصطلاحات عامیانه استفاده کن.",
  [Tone.PROFESSIONAL]: "لحنی رسمی و حرفه‌ای داشته باش. از زبان عامیانه پرهیز کن و از واژگان شفاف و مناسب برای یک حساب کاری یا برند استفاده کن.",
  [Tone.HUMOROUS]: "شوخ‌طبع، بامزه و سرگرم‌کننده باش. از طنز، جوک یا نکات هوشمندانه برای خنداندن مخاطب استفاده کن.",
  [Tone.INSPIRATIONAL]: "انگیزه‌بخش و روحیه دهنده باش. از کلمات قدرتمند و پیام‌های تشویق‌کننده برای الهام بخشیدن به مخاطب استفاده کن.",
  [Tone.INFORMATIVE]: "اطلاعات، حقایق یا نکات ارزشمند ارائه بده. لحن باید آموزشی، واضح و مستقیم باشد.",
};

export const generateCaptions = async (
    postDescription: string,
    options: GenerationOptions
): Promise<GeneratedCaption[]> => {
    try {
        const toneInstruction = TONE_INSTRUCTIONS[options.tone];
        const emojiInstruction = options.includeEmojis
            ? "از اموجی‌های مرتبط برای افزودن جذابیت بصری و شخصیت به متن به میزان لازم استفاده کن."
            : "از هیچ اموجی استفاده نکن.";
        const hashtagInstruction = options.includeHashtags
            ? "لیستی شامل ۵ تا ۱۰ هشتگ مرتبط و پرطرفدار اضافه کن."
            : "هیچ هشتگی اضافه نکن.";

        const prompt = `
            شما یک استراتژیست متخصص محتوای اینستاگرام هستید. وظیفه شما تولید کپشن‌های جذاب برای یک پست در شبکه‌های اجتماعی است.

            **توضیحات پست:**
            "${postDescription}"

            **دستورالعمل‌ها:**
            ۱.  ${options.variantCount} کپشن منحصر به فرد تولید کن.
            ۲.  **لحن:** ${toneInstruction}
            ۳.  **طول متن:** هر کپشن باید تقریباً ${options.captionLength} کلمه باشد.
            ۴.  **اموجی‌ها:** ${emojiInstruction}
            ۵.  **هشتگ‌ها:** ${hashtagInstruction}
            ۶.  **تعامل:** کپشن‌ها باید جذاب باشند و مخاطب را به لایک، کامنت و اشتراک‌گذاری تشویق کنند. افزودن یک سوال یا فراخوان به اقدام (Call-to-action) را در نظر بگیر.
            ۷.  **فرمت خروجی:** پاسخ شما باید حتماً یک آرایه JSON باشد. هر آبجکت در آرایه باید مطابق با اسکیمای مشخص شده باشد.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: {
                                type: Type.STRING,
                                description: "متن اصلی کپشن اینستاگرام."
                            },
                            hashtags: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "آرایه‌ای از هشتگ‌های مرتبط، بدون علامت #."
                            },
                            emojis: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "آرایه‌ای از اموجی‌های استفاده شده در کپشن."
                            },
                             predictedEngagement: {
                                type: Type.STRING,
                                enum: ["پایین", "متوسط", "بالا"],
                                description: "پیش‌بینی نرخ تعامل برای کپشن."
                            }
                        },
                        required: ["text", "hashtags", "emojis", "predictedEngagement"],
                    },
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);

        // Add a unique ID to each caption
        return jsonResponse.map((caption: Omit<GeneratedCaption, 'id'>) => ({
            ...caption,
            id: crypto.randomUUID(),
        }));

    } catch (error) {
        console.error("Error generating captions:", error);
        throw new Error("تولید کپشن با خطا مواجه شد. لطفاً برای جزئیات بیشتر کنسول را بررسی کنید.");
    }
};