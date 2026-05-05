import { Product, ProductCategory, AppPage } from './types.ts';

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
        unit: 'bundle' as any,
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

export const initialPages: AppPage[] = [
    {
        id: 'p1',
        slug: 'about-us',
        title: 'About Us',
        content: '# About Vegelo\n\nWelcome to **Vegelo**, your premium destination for the freshest delivery of fruits and vegetables. \n\n## Our Mission\nOur mission is simple: to connect local farmers with families who value quality and freshness. We believe that everyone deserves access to healthy, nutritious food without the hassle of market trips.\n\n### Why Choose Us?\n* **Direct from Farms:** We source directly to ensure peak freshness.\n* **Quality Guaranteed:** Every item is hand-picked and inspected.\n* **Fast Delivery:** From our hub to your door in record time.\n\nFounded in 2024, Vegelo has grown into a trusted name for thousands of households. Join our community today!',
        lastUpdated: new Date()
    },
    {
        id: 'p2',
        slug: 'terms-and-conditions',
        title: 'Terms and Conditions',
        content: '# Terms and Conditions\n\nBy using Vegelo, you agree to the following terms:\n\n## 1. Ordering\nAll orders are subject to availability. We reserve the right to cancel orders in case of stock shortages.\n\n## 2. Payment\nPayments must be made via **Easypaisa** or **JazzCash** as specified during checkout. Proof of payment (screenshot) is mandatory.\n\n## 3. Privacy\nYour data is used strictly for delivery and order fulfillment. We never share your personal information with third parties.\n\n## 4. Updates\nWe may update these terms from time to time. Your continued use of the app constitutes acceptance of new terms.',
        lastUpdated: new Date()
    },
    {
        id: 'p3',
        slug: 'return-policy',
        title: 'Return Policy',
        content: '# Return Policy\n\nWe want you to be 100% happy with your fresh delivery.\n\n## Replacement Policy\nIf you receive any item that is damaged or not fresh, we will replace it **free of charge**.\n\n## Timeframe\nComplaints must be lodged within **2 hours** of delivery. Since our products are perishable, we cannot accept returns beyond this window.\n\n### How to lodge a complaint:\n1. Take a picture of the item.\n2. Contact us via our support number provided in the order confirmation.\n3. We will process your replacement instantly.',
        lastUpdated: new Date()
    },
    {
        id: 'p4',
        slug: 'contact-us',
        title: 'Contact Us',
        content: '# Contact Vegelo\n\nWe are here to help you. Reach out to us via any of the following channels:\n\n## Customer Support\n* **Phone:** 0300-1234567\n* **WhatsApp:** 0300-1234567\n* **Email:** support@vegelo.com\n\n## Office Hours\n* **Monday - Saturday:** 9:00 AM - 10:00 PM\n* **Sunday:** 10:00 AM - 6:00 PM\n\n## Location\nMain Branch: Vegelo Hub, Fresh Street, Sector 7, Islamabad.',
        lastUpdated: new Date()
    }
];
