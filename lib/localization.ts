
import { Product, Language } from '../types';

// Static dictionary for common product names and their Urdu equivalents
// Keys are lowercase to allow case-insensitive matching
export const commonTranslations: Record<string, { nameUrdu: string, descriptionUrdu: string }> = {
    'tomato': {
        nameUrdu: 'تازہ ٹماٹر',
        descriptionUrdu: 'مقامی طور پر اگائے گئے، سرخ ٹماٹر۔ سلاد، سالن اور سینڈوچ کے لیے موزوں ہیں۔'
    },
    'onion': {
        nameUrdu: 'کرکرے پیاز',
        descriptionUrdu: 'تیز ذائقے اور کرکرے پن کے ساتھ اعلیٰ معیار کے سرخ پیاز۔'
    },
    'potato': {
        nameUrdu: 'نامیاتی آلو',
        descriptionUrdu: 'ہر دل عزیز آلو۔ ابالنے، میش کرنے یا فرائی کرنے کے لیے بہترین ہیں۔'
    },
    'apple': {
        nameUrdu: 'میٹھے سیب',
        descriptionUrdu: 'شمال کے باغات سے چنے گئے کرکرے اور میٹھے موسمی سیب۔'
    },
    'banana': {
        nameUrdu: 'پکے ہوئے کیلے',
        descriptionUrdu: 'توانائی سے بھرپور پکے ہوئے کیلے، اسموتھیز یا اسنیکس کے لیے موزوں۔'
    },
    'orange': {
        nameUrdu: 'رسیلے مالٹے',
        descriptionUrdu: 'وٹامن سی سے بھرپور رسیلے مالٹے۔ میٹھے اور تازگی بخش۔'
    },
    'mango': {
        nameUrdu: 'گرمیوں کے آم',
        descriptionUrdu: 'پھلوں کا بادشاہ! میٹھے، خوشبودار اور گودے دار آم۔'
    },
    'garlic': {
        nameUrdu: 'لہسن',
        descriptionUrdu: 'تازہ لہسن، بہترین ذائقہ اور خوشبو کے لیے۔'
    },
    'ginger': {
        nameUrdu: 'ادرک',
        descriptionUrdu: 'تازہ ادرک، کھانوں میں ذائقہ بڑھانے کے لیے۔'
    },
    'lemon': {
        nameUrdu: 'لیموں',
        descriptionUrdu: 'تازہ اور رسیلے لیموں، سکنجوین اور سلاد کے لیے۔'
    },
    'spinach': {
        nameUrdu: 'تازہ پالک',
        descriptionUrdu: 'ہرے پتوں والی تازہ پالک، روایتی پکوانوں کے لیے۔'
    },
    'box': {
        nameUrdu: 'سبزیوں کا ڈبہ',
        descriptionUrdu: 'ایک فیملی کے لیے تازہ سبزیوں کا مکمل پیک۔'
    },
    'basket': {
        nameUrdu: 'پھلوں کی ٹوکری',
        descriptionUrdu: 'موسمی پھلوں کا خوبصورت مجموعہ۔'
    },
    'green': {
        nameUrdu: 'سردیوں کا ساگ',
        descriptionUrdu: 'تازہ سرسوں کا ساگ اور پالک، روایتی پکوانوں کے لیے۔'
    }
};

/**
 * Hydrates a product object with localized fields if it exists in the dictionary.
 * Uses lowercase matching for robustness.
 */
export function localizeProduct(product: Product): Product {
    const nameLower = product.name.toLowerCase();
    
    // First try exact match (if provided in a specific list, but we use keyword match here)
    // Try to find if any key in our dictionary is part of the product name
    let foundKey = Object.keys(commonTranslations).find(key => nameLower.includes(key));
    
    if (foundKey) {
        const translation = commonTranslations[foundKey];
        return {
            ...product,
            nameUrdu: product.nameUrdu || translation.nameUrdu,
            descriptionUrdu: product.descriptionUrdu || translation.descriptionUrdu
        };
    }
    
    return product;
}

/**
 * Localizes an entire array of products.
 */
export function localizeProducts(products: Product[]): Product[] {
    return products.map(localizeProduct);
}
