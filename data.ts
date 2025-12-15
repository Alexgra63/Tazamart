
import { Product, ProductCategory } from './types';

export const initialProducts: Product[] = [
    { 
        id: 1, 
        name: 'Fresh Tomatoes', 
        price: 120, 
        image: 'https://picsum.photos/id/1080/400/300', 
        category: ProductCategory.Vegetables, 
        unit: 'kg',
        description: 'Locally grown, vine-ripened red tomatoes. Perfect for salads, sauces, and sandwiches.'
    },
    { 
        id: 2, 
        name: 'Crisp Onions', 
        price: 80, 
        image: 'https://picsum.photos/id/292/400/300', 
        category: ProductCategory.Vegetables, 
        unit: 'kg',
        description: 'High-quality red onions with a sharp flavor and crisp texture. Essential for desi cooking.' 
    },
    { 
        id: 3, 
        name: 'Organic Potatoes', 
        price: 60, 
        image: 'https://picsum.photos/id/1078/400/300', 
        category: ProductCategory.Vegetables, 
        unit: 'kg',
        description: 'Versatile organic potatoes. Great for baking, mashing, or frying.' 
    },
    { 
        id: 4, 
        name: 'Sweet Apples', 
        price: 250, 
        image: 'https://picsum.photos/id/102/400/300', 
        category: ProductCategory.Fruits, 
        unit: 'kg',
        description: 'Crunchy and sweet seasonal apples picked from the orchards of the north.' 
    },
    { 
        id: 5, 
        name: 'Ripe Bananas', 
        price: 150, 
        image: 'https://picsum.photos/id/219/400/300', 
        category: ProductCategory.Fruits, 
        unit: 'dozen' as any,
        description: 'Energy-rich ripe bananas, naturally sweet and perfect for smoothies or snacks.' 
    },
    { 
        id: 6, 
        name: 'Juicy Oranges', 
        price: 180, 
        image: 'https://picsum.photos/id/40/400/300', 
        category: ProductCategory.Fruits, 
        unit: 'kg',
        description: 'Vitamin C packed juicy oranges. Sweet, tangy, and refreshing.' 
    },
    { 
        id: 7, 
        name: 'Weekly Veggie Box', 
        price: 800, 
        image: 'https://picsum.photos/id/312/400/300', 
        category: ProductCategory.Bundles, 
        unit: 'bundle',
        description: 'A curated selection of seasonal vegetables enough for a small family for a week.' 
    },
    { 
        id: 8, 
        name: 'Fruit Fiesta Basket', 
        price: 1200, 
        image: 'https://picsum.photos/id/355/400/300', 
        category: ProductCategory.Bundles, 
        unit: 'bundle',
        description: 'A premium assortment of the freshest seasonal fruits presented in a lovely basket.' 
    },
    { 
        id: 9, 
        name: 'Summer Mangoes', 
        price: 300, 
        image: 'https://picsum.photos/id/211/400/300', 
        category: ProductCategory.Seasonal, 
        unit: 'kg',
        description: 'The king of fruits! Sweet, aromatic, and pulpy mangoes available for a limited time.' 
    },
    { 
        id: 10, 
        name: 'Winter Greens', 
        price: 100, 
        image: 'https://picsum.photos/id/1015/400/300', 
        category: ProductCategory.Seasonal, 
        unit: 'kg',
        description: 'Fresh mustard greens (Sarson) and spinach, perfect for traditional winter dishes.' 
    },
];
