
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function translateProductsToUrdu(products: Product[]): Promise<Product[]> {
    if (!products.length) return [];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Translate the following product data into Urdu. 
            Maintain the exact structure. 
            Translate 'name', 'description', 'unit', and 'category'.
            For 'unit': Translate 'kg' to 'کلو', 'piece' to 'عدد', 'bundle' to 'بنڈل'.
            For 'category': Translate carefully (e.g., 'Vegetables' to 'سبزیاں').
            Return the result as a JSON array of products.
            
            Products: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, description: p.description, unit: p.unit, category: p.category })))}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.NUMBER },
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            unit: { type: Type.STRING },
                            category: { type: Type.STRING }
                        },
                        required: ["id", "name", "description", "unit", "category"]
                    }
                }
            }
        });

        const translatedData = JSON.parse(response.text);
        
        return products.map(original => {
            const translated = translatedData.find((t: any) => t.id === original.id);
            if (translated) {
                return {
                    ...original,
                    name: translated.name,
                    description: translated.description,
                    unit: translated.unit,
                    category: translated.category as any
                };
            }
            return original;
        });
    } catch (error) {
        console.error("Translation failed:", error);
        return products;
    }
}
