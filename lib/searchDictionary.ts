
/**
 * A static dictionary to map Urdu search terms to English product keywords.
 * This enables Urdu search functionality without the need for real-time AI translation.
 */
export const URDU_TO_ENGLISH_MAPPING: Record<string, string[]> = {
    // Vegetables
    'ٹماٹر': ['tomato', 'veg'],
    'پیاز': ['onion', 'veg'],
    'آلو': ['potato', 'veg'],
    'ادرک': ['ginger', 'veg'],
    'لہسن': ['garlic', 'veg'],
    'کھیرا': ['cucumber', 'veg'],
    'کریلا': ['bitter gourd', 'karela', 'veg'],
    'بھنڈی': ['lady finger', 'okra', 'bhindi', 'veg'],
    'گوبھی': ['cauliflower', 'veg'],
    'بند گوبھی': ['cabbage', 'veg'],
    'مٹر': ['peas', 'veg'],
    'گاجر': ['carrot', 'veg'],
    'مولی': ['radish', 'veg'],
    'لیموں': ['lemon', 'veg'],
    'ہری مرچ': ['green chili', 'mirch', 'veg'],
    'دھنیا': ['coriander', 'dhaniya', 'veg'],
    'پودینہ': ['mint', 'veg'],
    'پالک': ['spinach', 'palak', 'veg'],
    'بینگن': ['brinjal', 'eggplant', 'veg'],
    'ٹنڈے': ['tinda', 'veg'],
    'لوکی': ['bottle gourd', 'lauki', 'veg'],
    
    // Fruits
    'سیب': ['apple', 'fruit'],
    'کیلا': ['banana', 'fruit'],
    'مالٹا': ['orange', 'kinnow', 'fruit'],
    'آم': ['mango', 'fruit'],
    'انگور': ['grapes', 'fruit'],
    'امرود': ['guava', 'fruit'],
    'آڑو': ['peach', 'fruit'],
    'خربوزہ': ['melon', 'fruit'],
    'تربوز': ['watermelon', 'fruit'],
    'انار': ['pomegranate', 'fruit'],
    'خوبانی': ['apricot', 'fruit'],
    'جامن': ['java plum', 'jamun', 'fruit'],
    'لیچی': ['lychee', 'fruit'],
    'کھجور': ['dates', 'fruit'],
    
    // General Categories
    'سبزی': ['vegetable', 'veg'],
    'پھل': ['fruit'],
    'بنڈل': ['bundle', 'box'],
    'سیزنل': ['seasonal'],
    'دودھ': ['milk', 'dairy'],
    'دہی': ['yogurt', 'dairy'],
    'انڈے': ['eggs'],
    'گوشت': ['meat', 'chicken', 'beef', 'mutton'],
    'چکن': ['chicken'],
    'آٹا': ['flour', 'atta'],
    'چاول': ['rice'],
    'دال': ['pulse', 'dal', 'lentil'],
    'چینی': ['sugar'],
    'تیل': ['oil', 'cooking oil'],
    'گھی': ['ghee'],
    'چائے': ['tea'],
    'مصالحہ': ['spice', 'masala'],
    
    // Units
    'کلو': ['kg'],
    'درجن': ['dozen'],
    'پاؤ': ['250g'],
    'آدھا کلو': ['500g'],
};

/**
 * Normalizes an Urdu search string by checking it against the dictionary.
 * Returns a list of English keywords to search for.
 */
export const getEnglishKeywords = (urduQuery: string): string[] => {
    const keywords: string[] = [];
    const query = urduQuery.trim();
    
    // Check for exact matches and partial matches in the dictionary
    for (const [urduTerm, engKeywords] of Object.entries(URDU_TO_ENGLISH_MAPPING)) {
        if (query.includes(urduTerm) || urduTerm.includes(query)) {
            keywords.push(...engKeywords);
        }
    }
    
    return [...new Set(keywords)];
};
