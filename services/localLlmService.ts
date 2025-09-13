import { GenerationOptions, GeneratedCaption, Tone } from '../types';

// این آدرس پیش‌فرض سرور Ollama است که به صورت محلی اجرا می‌شود.
const OLLAMA_API_URL = "http://localhost:11434/api/generate";

// توجه: مدل‌های محلی ممکن است به اندازه مدل‌های ابری بزرگ، دستورالعمل‌های پیچیده را درک نکنند.
// بنابراین، پرامپت‌ها ساده‌تر و مستقیم‌تر هستند.
const TONE_INSTRUCTIONS: Record<Tone, string> = {
  [Tone.CASUAL]: "لحن دوستانه و غیررسمی.",
  [Tone.PROFESSIONAL]: "لحن رسمی و حرفه‌ای.",
  [Tone.HUMOROUS]: "لحن شوخ‌طبع و بامزه.",
  [Tone.INSPIRATIONAL]: "لحن انگیزشی و الهام‌بخش.",
  [Tone.INFORMATIVE]: "لحن آموزشی و informativo.",
};

export const generateLocalCaptions = async (
    postDescription: string,
    options: GenerationOptions
): Promise<GeneratedCaption[]> => {
    try {
        const toneInstruction = TONE_INSTRUCTIONS[options.tone];
        const emojiInstruction = options.includeEmojis ? "از چند اموجی مرتبط استفاده کن." : "از اموجی استفاده نکن.";
        const hashtagInstruction = options.includeHashtags ? "چند هشتگ مرتبط اضافه کن." : "هشتگ اضافه نکن.";

        // پرامپت برای مدل‌های محلی باید بسیار صریح و ساده باشد.
        const finalPrompt = `
            You are an Instagram content expert. Create ${options.variantCount} unique captions for a post about: "${postDescription}".
            Follow these rules EXACTLY:
            1. Tone: ${toneInstruction}
            2. Length: Approximately ${options.captionLength} words per caption.
            3. Emojis: ${emojiInstruction}
            4. Hashtags: ${hashtagInstruction}
            5. Your response MUST be a valid JSON array of objects. Do not write any text before or after the JSON array.
            The JSON schema for each object is:
            {
              "text": "The caption text.",
              "hashtags": ["hashtag1", "hashtag2"],
              "emojis": ["emoji1", "emoji2"],
              "predictedEngagement": "یکی از مقادیر 'پایین', 'متوسط', یا 'بالا'"
            }
        `;
        
        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // نام مدلی که با `ollama run` دانلود کردید
                model: "gemma:2b", 
                prompt: finalPrompt,
                stream: false,
                format: "json" // این قابلیت Ollama عالی است و تضمین می‌کند خروجی JSON باشد
            }),
        });

        if (!response.ok) {
            throw new Error(`خطا در ارتباط با سرور محلی Ollama: ${response.statusText}`);
        }

        const data = await response.json();
        
        // پاسخ Ollama در فیلد `response` قرار دارد که یک رشته JSON است.
        const jsonResponse = JSON.parse(data.response);

        // افزودن ID منحصر به فرد به هر کپشن
        return jsonResponse.map((caption: Omit<GeneratedCaption, 'id'>) => ({
            ...caption,
            id: crypto.randomUUID(),
        }));

    } catch (error) {
        console.error("Error generating captions with local LLM:", error);
        // ارائه یک پیام خطای کاربرپسند
        if (error instanceof TypeError) { // معمولاً به معنای عدم اجرای سرور Ollama است
             throw new Error("ارتباط با سرور محلی برقرار نشد. آیا Ollama در حال اجراست؟");
        }
        throw new Error("تولید کپشن محلی با خطا مواجه شد. لطفاً کنسول را بررسی کنید.");
    }
};
