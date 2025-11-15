// Receipt parsing utility
// This parses OCR text from receipts to extract clothing items

export interface ParsedItem {
  name: string;
  brand?: string;
  category?: string;
  size?: string;
  price?: string;
  quantity?: number;
}

export const parseReceiptText = (text: string): ParsedItem[] => {
  const items: ParsedItem[] = [];
  const lines = text.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);

  // Extract store/brand from receipt header (usually first few lines)
  let storeBrand = '';
  const storePattern = /(?:Store|Shop|Retailer|Brand|From):\s*(.+)/i;
  const brandPattern = /\b(Zara|H&M|H&M|Nike|Adidas|Puma|Gap|Old Navy|Forever 21|Uniqlo|Target|Walmart|Macy|Nordstrom|Banana Republic|J.Crew|Anthropologie|Urban Outfitters|ASOS|Shein|Fashion Nova)\b/i;
  
  // Look for store name in first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const storeMatch = lines[i].match(storePattern);
    if (storeMatch) {
      storeBrand = storeMatch[1].trim();
      break;
    }
    const brandMatch = lines[i].match(brandPattern);
    if (brandMatch) {
      storeBrand = brandMatch[1];
      break;
    }
  }

  // Common clothing keywords
  const clothingKeywords = [
    'shirt',
    'pants',
    'dress',
    'jacket',
    'sweater',
    'jeans',
    'top',
    'bottom',
    'shoes',
    'sneakers',
    'boots',
    'saree',
    'blazer',
    'coat',
    'hoodie',
    't-shirt',
    'tshirt',
    'shorts',
    'skirt',
    'accessories',
    'blouse',
    'trouser',
    'sweatshirt',
    'sweatpants',
    'sweat pants',
  ];

  // Category mapping
  const categoryMap: { [key: string]: string } = {
    shirt: 'Top',
    't-shirt': 'Top',
    tshirt: 'Top',
    top: 'Top',
    blouse: 'Top',
    pants: 'Bottom',
    jeans: 'Bottom',
    shorts: 'Bottom',
    skirt: 'Bottom',
    trouser: 'Bottom',
    bottom: 'Bottom',
    dress: 'Dress',
    jacket: 'Outerwear',
    coat: 'Outerwear',
    blazer: 'Blazer',
    sweater: 'Top',
    sweatshirt: 'Top',
    hoodie: 'Top',
    'sweat pants': 'Bottom',
    sweatpants: 'Bottom',
    shoes: 'Shoes',
    sneakers: 'Shoes',
    boots: 'Shoes',
    saree: 'Saree',
    accessories: 'Accessories',
  };

  // Size patterns
  const sizePattern = /\b(Size|SZ|SIZE)[\s:]*([XS|S|M|L|XL|XXL|XXXL|\d+]+)\b/i;
  const sizePatternSimple = /\b(XS|S|M|L|XL|XXL|XXXL|\d+)\b/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    const originalLine = lines[i];
    const hasClothingKeyword = clothingKeywords.some((keyword) => line.includes(keyword));

    if (hasClothingKeyword) {
      // Clean up item name - remove quantity, price, size indicators
      let itemName = originalLine
        .replace(/^\d+x\s*/i, '') // Remove "1x " prefix
        .replace(/\s*-\s*Size.*$/i, '') // Remove " - Size M" suffix
        .replace(/\$\d+\.?\d*/g, '') // Remove prices
        .replace(/\s+/g, ' ')
        .trim();

      // If item name is too short or generic, try to extract more context
      if (itemName.length < 3) {
        itemName = originalLine.split('-')[0].trim();
      }

      const item: ParsedItem = {
        name: itemName || originalLine,
      };

      // Extract category
      for (const [keyword, category] of Object.entries(categoryMap)) {
        if (line.includes(keyword)) {
          item.category = category;
          break;
        }
      }

      // Extract size (try both patterns)
      const sizeMatch = originalLine.match(sizePattern) || originalLine.match(sizePatternSimple);
      if (sizeMatch) {
        item.size = sizeMatch[2] || sizeMatch[1];
      }

      // Extract brand - first try from item line, then use store brand
      const brandMatch = originalLine.match(brandPattern);
      if (brandMatch) {
        item.brand = brandMatch[1];
      } else if (storeBrand) {
        item.brand = storeBrand;
      }

      // Look for price in current or next line
      const priceMatch = originalLine.match(/\$(\d+\.?\d*)/) || 
                        (i + 1 < lines.length ? lines[i + 1].match(/\$(\d+\.?\d*)/) : null);
      if (priceMatch) {
        item.price = priceMatch[1];
      }

      items.push(item);
    }
  }

  return items;
};

// Mock OCR function - replace with real OCR service
export const performOCR = async (imageUri: string): Promise<string> => {
  // FIREBASE COMMENTED OUT - MOCK IMPLEMENTATION
  // In production, use a real OCR service like:
  // - Google Cloud Vision API
  // - AWS Textract
  // - Tesseract.js
  // - expo-text-recognition (if available)

  // Mock: Return Nike receipt with sneakers, sweatshirt, and sweatpants
  return `RECEIPT
Store: Nike
Date: 12/15/2024

1x Nike Sneakers - Size 10        $129.99
1x Nike Sweatshirt - Size M       $79.99
1x Nike Sweatpants - Size M       $69.99

Subtotal: $279.97
Tax: $22.40
Total: $302.37`;
};

