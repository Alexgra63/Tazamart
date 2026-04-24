import { Product, ProductCategory } from './types.ts';

export const initialProducts: Product[] = [
    { 
        id: 1, 
        name: 'Fresh Tomatoes', 
        nameUrdu: 'تازہ ٹماٹر',
        price: 120, 
        image: 'https://picsum.photos/id/1080/400/300', 
        category: ProductCategory.Vegetables, 
        unit: 'kg',
        description: 'Locally grown, vine-ripened red tomatoes. Perfect for salads, sauces, and sandwiches.',
        descriptionUrdu: 'مقامی طور پر اگائے گئے، سرخ ٹماٹر۔ سلاد، سالن اور سینڈوچ کے لیے موزوں ہیں۔'
    },
    { 
        id: 2, 
        name: 'Crisp Onions', 
        nameUrdu: 'کرکرے پیاز',
        price: 80, 
        image: 'https://picsum.photos/id/292/400/300', 
        category: ProductCategory.Vegetables, 
        unit: 'kg',
        description: 'High-quality red onions with a sharp flavor and crisp texture. Essential for desi cooking.',
        descriptionUrdu: 'تیز ذائقے اور کرکرے پن کے ساتھ اعلیٰ معیار کے سرخ پیاز۔ دیسی کھانا پکانے کے لیے ضروری ہیں۔' 
    },
    { 
        id: 3, 
        name: 'Organic Potatoes', 
        nameUrdu: 'نامیاتی آلو',
        price: 60, 
        image: 'https://picsum.photos/id/1078/400/300', 
        category: ProductCategory.Vegetables, 
        unit: 'kg',
        description: 'Versatile organic potatoes. Great for baking, mashing, or frying.',
        descriptionUrdu: 'ہر دل عزیز آلو۔ ابالنے، میش کرنے یا فرائی کرنے کے لیے بہترین ہیں۔' 
    },
    { 
        id: 4, 
        name: 'Sweet Apples', 
        nameUrdu: 'میٹھے سیب',
        price: 250, 
        image: 'https://picsum.photos/id/102/400/300', 
        category: ProductCategory.Fruits, 
        unit: 'kg',
        description: 'Crunchy and sweet seasonal apples picked from the orchards of the north.',
        descriptionUrdu: 'شمال کے باغات سے چنے گئے کرکرے اور میٹھے موسمی سیب۔' 
    },
    { 
        id: 5, 
        name: 'Ripe Bananas', 
        nameUrdu: 'پکے ہوئے کیلے',
        price: 150, 
        image: 'https://picsum.photos/id/219/400/300', 
        category: ProductCategory.Fruits, 
        unit: 'bundle' as any,
        description: 'Energy-rich ripe bananas, naturally sweet and perfect for smoothies or snacks.',
        descriptionUrdu: 'توانائی سے بھرپور پکے ہوئے کیلے، قدرتی طور پر میٹھے اور اسموتھیز یا اسنیکس کے لیے موزوں۔' 
    },
    { 
        id: 6, 
        name: 'Juicy Oranges', 
        nameUrdu: 'رسیلے مالٹے',
        price: 180, 
        image: 'https://picsum.photos/id/40/400/300', 
        category: ProductCategory.Fruits, 
        unit: 'kg',
        description: 'Vitamin C packed juicy oranges. Sweet, tangy, and refreshing.',
        descriptionUrdu: 'وٹامن سی سے بھرپور رسیلے مالٹے۔ میٹھے اور تازگی بخش۔' 
    },
    { 
        id: 7, 
        name: 'Weekly Veggie Box', 
        nameUrdu: 'ہفتہ وار سبزیوں کا ڈبہ',
        price: 800, 
        image: 'https://picsum.photos/id/312/400/300', 
        category: ProductCategory.Bundles, 
        unit: 'bundle',
        description: 'A curated selection of seasonal vegetables enough for a small family for a week.',
        descriptionUrdu: 'ایک ہفتے کے لیے ایک چھوٹے خاندان کے لیے کافی موسمی سبزیوں کا انتخاب۔' 
    },
    { 
        id: 8, 
        name: 'Fruit Fiesta Basket', 
        nameUrdu: 'پھلوں کی خوبصورت ٹوکری',
        price: 1200, 
        image: 'https://picsum.photos/id/355/400/300', 
        category: ProductCategory.Bundles, 
        unit: 'bundle',
        description: 'A premium assortment of the freshest seasonal fruits presented in a lovely basket.',
        descriptionUrdu: 'ایک پیاری ٹوکری میں پیش کیے گئے تازہ ترین موسمی پھلوں کا مجموعہ۔' 
    },
    { 
        id: 9, 
        name: 'Summer Mangoes', 
        nameUrdu: 'گرمیوں کے آم',
        price: 300, 
        image: 'https://picsum.photos/id/211/400/300', 
        category: ProductCategory.Seasonal, 
        unit: 'kg',
        description: 'The king of fruits! Sweet, aromatic, and pulpy mangoes available for a limited time.',
        descriptionUrdu: 'پھلوں کا بادشاہ! میٹھے، خوشبودار اور گودے دار آم محدود وقت کے لیے دستیاب ہیں۔' 
    },
    { 
        id: 10, 
        name: 'Winter Greens', 
        nameUrdu: 'سردیوں کا ساگ',
        price: 100, 
        image: 'https://picsum.photos/id/1015/400/300', 
        category: ProductCategory.Seasonal, 
        unit: 'kg',
        description: 'Fresh mustard greens (Sarson) and spinach, perfect for traditional winter dishes.',
        descriptionUrdu: 'تازہ سرسوں کا ساگ اور پالک، روایتی موسم سرما کے پکوانوں کے لیے موزوں۔' 
    },
];