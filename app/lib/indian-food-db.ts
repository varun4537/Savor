// Indian Food Nutrition Database
// Based on IFCT (Indian Food Composition Tables) and common serving sizes
// All values are per standard serving

export interface FoodEntry {
    name: string;
    aliases: string[];  // Other names this food might be called
    category: 'grain' | 'curry' | 'dal' | 'vegetable' | 'protein' | 'snack' | 'breakfast' | 'bread' | 'rice' | 'sweet' | 'drink' | 'side';
    servingSize: string;
    servingGrams: number;
    calories: number;
    protein: number;  // grams
    carbs: number;    // grams
    fat: number;      // grams
    fiber: number;    // grams
}

export const indianFoodDatabase: FoodEntry[] = [
    // === BREAKFAST ITEMS ===
    { name: 'Idli', aliases: ['idly', 'steamed rice cake'], category: 'breakfast', servingSize: '2 pieces', servingGrams: 80, calories: 130, protein: 3, carbs: 28, fat: 0.5, fiber: 1 },
    { name: 'Dosa', aliases: ['plain dosa', 'sada dosa'], category: 'breakfast', servingSize: '1 medium', servingGrams: 100, calories: 170, protein: 4, carbs: 30, fat: 4, fiber: 1 },
    { name: 'Masala Dosa', aliases: ['potato dosa'], category: 'breakfast', servingSize: '1 piece', servingGrams: 180, calories: 290, protein: 6, carbs: 45, fat: 10, fiber: 3 },
    { name: 'Uttapam', aliases: ['uthappam', 'oothappam'], category: 'breakfast', servingSize: '1 medium', servingGrams: 150, calories: 200, protein: 5, carbs: 35, fat: 5, fiber: 2 },
    { name: 'Upma', aliases: ['uppuma', 'rava upma'], category: 'breakfast', servingSize: '1 cup', servingGrams: 200, calories: 250, protein: 6, carbs: 40, fat: 8, fiber: 3 },
    { name: 'Poha', aliases: ['pohe', 'flattened rice', 'aval'], category: 'breakfast', servingSize: '1 cup', servingGrams: 180, calories: 270, protein: 5, carbs: 45, fat: 9, fiber: 4 },
    { name: 'Pongal', aliases: ['ven pongal', 'khara pongal'], category: 'breakfast', servingSize: '1 cup', servingGrams: 200, calories: 280, protein: 8, carbs: 42, fat: 9, fiber: 2 },
    { name: 'Medu Vada', aliases: ['vada', 'urad vada', 'ulundu vadai'], category: 'breakfast', servingSize: '2 pieces', servingGrams: 80, calories: 220, protein: 7, carbs: 22, fat: 12, fiber: 2 },
    { name: 'Aloo Paratha', aliases: ['potato paratha'], category: 'breakfast', servingSize: '1 piece', servingGrams: 120, calories: 280, protein: 6, carbs: 38, fat: 12, fiber: 2 },
    { name: 'Paratha', aliases: ['plain paratha', 'lacha paratha'], category: 'bread', servingSize: '1 piece', servingGrams: 80, calories: 230, protein: 5, carbs: 32, fat: 10, fiber: 2 },

    // === EGG DISHES (NEW) ===
    { name: 'Boiled Egg', aliases: ['boiled eggs', 'hard boiled egg'], category: 'protein', servingSize: '2 eggs', servingGrams: 100, calories: 140, protein: 12, carbs: 1, fat: 10, fiber: 0 },
    { name: 'Egg Toast', aliases: ['bread egg toast', 'egg sandwich'], category: 'breakfast', servingSize: '2 slices', servingGrams: 150, calories: 280, protein: 14, carbs: 28, fat: 12, fiber: 2 },
    { name: 'Omelette', aliases: ['omelet', 'egg omelette', '2 egg omelette'], category: 'breakfast', servingSize: '2 eggs', servingGrams: 120, calories: 180, protein: 12, carbs: 2, fat: 14, fiber: 0 },
    { name: 'Egg Bhurji', aliases: ['scrambled eggs', 'anda bhurji'], category: 'breakfast', servingSize: '2 eggs', servingGrams: 140, calories: 220, protein: 14, carbs: 4, fat: 16, fiber: 1 },

    // === BREADS ===
    { name: 'Roti', aliases: ['chapati', 'phulka', 'chapathi'], category: 'bread', servingSize: '1 piece', servingGrams: 40, calories: 80, protein: 3, carbs: 15, fat: 1, fiber: 2 },
    { name: 'Naan', aliases: ['butter naan', 'tandoori naan'], category: 'bread', servingSize: '1 piece', servingGrams: 90, calories: 260, protein: 7, carbs: 42, fat: 7, fiber: 2 },
    { name: 'Puri', aliases: ['poori', 'luchi'], category: 'bread', servingSize: '2 pieces', servingGrams: 60, calories: 200, protein: 4, carbs: 26, fat: 9, fiber: 1 },
    { name: 'Bhatura', aliases: ['bhatoora', 'bhature'], category: 'bread', servingSize: '1 piece', servingGrams: 100, calories: 320, protein: 6, carbs: 40, fat: 15, fiber: 2 },
    { name: 'Kulcha', aliases: ['amritsari kulcha'], category: 'bread', servingSize: '1 piece', servingGrams: 80, calories: 240, protein: 6, carbs: 36, fat: 8, fiber: 2 },

    // === RICE DISHES ===
    { name: 'Rice', aliases: ['steamed rice', 'white rice', 'plain rice', 'chawal'], category: 'rice', servingSize: '1 cup cooked', servingGrams: 150, calories: 200, protein: 4, carbs: 45, fat: 0.5, fiber: 1 },
    { name: 'Jeera Rice', aliases: ['cumin rice', 'zeera rice'], category: 'rice', servingSize: '1 cup', servingGrams: 180, calories: 250, protein: 5, carbs: 48, fat: 5, fiber: 1 },
    { name: 'Biryani', aliases: ['veg biryani', 'vegetable biryani'], category: 'rice', servingSize: '1 plate', servingGrams: 300, calories: 450, protein: 10, carbs: 65, fat: 16, fiber: 3 },
    { name: 'Chicken Biryani', aliases: ['murgh biryani', 'hyderabadi biryani'], category: 'rice', servingSize: '1 plate', servingGrams: 350, calories: 550, protein: 25, carbs: 60, fat: 22, fiber: 2 },
    { name: 'Egg Biryani', aliases: ['anda biryani', 'egg fried rice'], category: 'rice', servingSize: '1 plate', servingGrams: 300, calories: 480, protein: 18, carbs: 62, fat: 18, fiber: 2 },
    { name: 'Mutton Biryani', aliases: ['gosht biryani', 'lamb biryani'], category: 'rice', servingSize: '1 plate', servingGrams: 350, calories: 600, protein: 28, carbs: 58, fat: 26, fiber: 2 },
    { name: 'Chicken Curry Rice', aliases: ['chicken rice', 'chicken with rice'], category: 'rice', servingSize: '1 cup rice + curry', servingGrams: 350, calories: 520, protein: 32, carbs: 55, fat: 18, fiber: 3 },
    { name: 'Pulao', aliases: ['pulav', 'pilaf', 'veg pulao'], category: 'rice', servingSize: '1 cup', servingGrams: 200, calories: 280, protein: 6, carbs: 48, fat: 7, fiber: 2 },
    { name: 'Lemon Rice', aliases: ['chitranna', 'nimmakaya annam'], category: 'rice', servingSize: '1 cup', servingGrams: 180, calories: 260, protein: 5, carbs: 46, fat: 6, fiber: 1 },
    { name: 'Curd Rice', aliases: ['thayir sadam', 'dahi chawal', 'mosaranna'], category: 'rice', servingSize: '1 cup', servingGrams: 200, calories: 220, protein: 7, carbs: 38, fat: 5, fiber: 1 },
    { name: 'Khichdi', aliases: ['khichri', 'kichadi'], category: 'rice', servingSize: '1 cup', servingGrams: 200, calories: 220, protein: 8, carbs: 38, fat: 4, fiber: 3 },

    // === DALS & LENTILS ===
    { name: 'Dal', aliases: ['toor dal', 'arhar dal', 'yellow dal'], category: 'dal', servingSize: '1 cup', servingGrams: 200, calories: 180, protein: 12, carbs: 28, fat: 3, fiber: 8 },
    { name: 'Dal Tadka', aliases: ['dal fry', 'tempered dal'], category: 'dal', servingSize: '1 cup', servingGrams: 200, calories: 220, protein: 12, carbs: 30, fat: 7, fiber: 8 },
    { name: 'Dal Makhani', aliases: ['maa ki dal', 'black dal'], category: 'dal', servingSize: '1 cup', servingGrams: 200, calories: 280, protein: 14, carbs: 32, fat: 12, fiber: 6 },
    { name: 'Sambar', aliases: ['sambhar', 'sambaar'], category: 'dal', servingSize: '1 cup', servingGrams: 200, calories: 150, protein: 8, carbs: 22, fat: 4, fiber: 5 },
    { name: 'Rasam', aliases: ['saaru', 'chaaru'], category: 'dal', servingSize: '1 cup', servingGrams: 200, calories: 80, protein: 3, carbs: 12, fat: 2, fiber: 2 },
    { name: 'Chana Masala', aliases: ['chole', 'chickpea curry', 'chhole'], category: 'dal', servingSize: '1 cup', servingGrams: 200, calories: 280, protein: 14, carbs: 40, fat: 8, fiber: 10 },
    { name: 'Rajma', aliases: ['rajma masala', 'kidney beans curry'], category: 'dal', servingSize: '1 cup', servingGrams: 200, calories: 260, protein: 14, carbs: 42, fat: 5, fiber: 12 },
    { name: 'Kadhi', aliases: ['punjabi kadhi', 'pakora kadhi'], category: 'dal', servingSize: '1 cup', servingGrams: 200, calories: 180, protein: 6, carbs: 18, fat: 10, fiber: 2 },

    // === VEGETABLE DISHES ===
    { name: 'Aloo Gobi', aliases: ['potato cauliflower', 'gobhi aloo'], category: 'vegetable', servingSize: '1 cup', servingGrams: 180, calories: 180, protein: 4, carbs: 24, fat: 8, fiber: 4 },
    { name: 'Palak Paneer', aliases: ['saag paneer', 'spinach paneer'], category: 'vegetable', servingSize: '1 cup', servingGrams: 200, calories: 320, protein: 16, carbs: 12, fat: 24, fiber: 4 },
    { name: 'Paneer Butter Masala', aliases: ['paneer makhani', 'butter paneer'], category: 'vegetable', servingSize: '1 cup', servingGrams: 200, calories: 380, protein: 18, carbs: 16, fat: 28, fiber: 2 },
    { name: 'Matar Paneer', aliases: ['paneer peas', 'peas paneer'], category: 'vegetable', servingSize: '1 cup', servingGrams: 200, calories: 340, protein: 17, carbs: 18, fat: 24, fiber: 4 },
    { name: 'Bhindi Masala', aliases: ['okra', 'ladies finger', 'bhindi fry'], category: 'vegetable', servingSize: '1 cup', servingGrams: 150, calories: 140, protein: 3, carbs: 16, fat: 8, fiber: 4 },
    { name: 'Baingan Bharta', aliases: ['eggplant bharta', 'brinjal bharta'], category: 'vegetable', servingSize: '1 cup', servingGrams: 180, calories: 160, protein: 4, carbs: 18, fat: 9, fiber: 5 },
    { name: 'Aloo Matar', aliases: ['potato peas', 'matar aloo'], category: 'vegetable', servingSize: '1 cup', servingGrams: 180, calories: 200, protein: 5, carbs: 28, fat: 8, fiber: 4 },
    { name: 'Mixed Vegetable', aliases: ['mix veg', 'sabzi'], category: 'vegetable', servingSize: '1 cup', servingGrams: 180, calories: 160, protein: 5, carbs: 20, fat: 7, fiber: 5 },
    { name: 'Kadai Paneer', aliases: ['karahi paneer'], category: 'vegetable', servingSize: '1 cup', servingGrams: 200, calories: 350, protein: 17, carbs: 14, fat: 26, fiber: 3 },
    { name: 'Malai Kofta', aliases: ['paneer kofta'], category: 'vegetable', servingSize: '3 pieces + gravy', servingGrams: 200, calories: 400, protein: 12, carbs: 24, fat: 30, fiber: 3 },

    // === NON-VEG CURRIES ===
    { name: 'Butter Chicken', aliases: ['murgh makhani', 'chicken makhani'], category: 'protein', servingSize: '1 cup', servingGrams: 200, calories: 380, protein: 28, carbs: 12, fat: 26, fiber: 2 },
    { name: 'Chicken Curry', aliases: ['chicken masala', 'murgh curry'], category: 'protein', servingSize: '1 cup', servingGrams: 200, calories: 320, protein: 30, carbs: 10, fat: 18, fiber: 2 },
    { name: 'Chicken Tikka Masala', aliases: ['tikka masala'], category: 'protein', servingSize: '1 cup', servingGrams: 200, calories: 350, protein: 28, carbs: 14, fat: 22, fiber: 2 },
    { name: 'Mutton Curry', aliases: ['gosht', 'lamb curry', 'mutton masala'], category: 'protein', servingSize: '1 cup', servingGrams: 200, calories: 380, protein: 32, carbs: 8, fat: 26, fiber: 1 },
    { name: 'Fish Curry', aliases: ['machli curry', 'meen curry'], category: 'protein', servingSize: '1 cup', servingGrams: 200, calories: 280, protein: 30, carbs: 8, fat: 14, fiber: 1 },
    { name: 'Egg Curry', aliases: ['anda curry', 'egg masala'], category: 'protein', servingSize: '2 eggs + gravy', servingGrams: 200, calories: 280, protein: 16, carbs: 10, fat: 20, fiber: 2 },
    { name: 'Tandoori Chicken', aliases: ['grilled chicken'], category: 'protein', servingSize: '2 pieces', servingGrams: 200, calories: 260, protein: 36, carbs: 4, fat: 12, fiber: 0 },
    { name: 'Grilled Chicken', aliases: ['tandoori chicken', 'roasted chicken'], category: 'protein', servingSize: '2 pieces', servingGrams: 200, calories: 260, protein: 36, carbs: 4, fat: 12, fiber: 0 },
    { name: 'Chicken Kebab', aliases: ['seekh kebab', 'kebab'], category: 'protein', servingSize: '3 pieces', servingGrams: 120, calories: 220, protein: 22, carbs: 6, fat: 12, fiber: 1 },

    // === SNACKS ===
    { name: 'Samosa', aliases: ['aloo samosa'], category: 'snack', servingSize: '1 piece', servingGrams: 80, calories: 250, protein: 4, carbs: 28, fat: 14, fiber: 2 },
    { name: 'Pakora', aliases: ['bhajiya', 'bhaji', 'pakoda'], category: 'snack', servingSize: '5 pieces', servingGrams: 80, calories: 200, protein: 4, carbs: 20, fat: 12, fiber: 2 },
    { name: 'Pav Bhaji', aliases: ['mumbai pav bhaji'], category: 'snack', servingSize: '2 pav + bhaji', servingGrams: 300, calories: 450, protein: 12, carbs: 58, fat: 20, fiber: 6 },
    { name: 'Vada Pav', aliases: ['batata vada'], category: 'snack', servingSize: '1 piece', servingGrams: 150, calories: 290, protein: 6, carbs: 40, fat: 12, fiber: 3 },
    { name: 'Bhel Puri', aliases: ['bhelpuri'], category: 'snack', servingSize: '1 plate', servingGrams: 150, calories: 280, protein: 6, carbs: 42, fat: 10, fiber: 4 },
    { name: 'Sev Puri', aliases: ['sevpuri'], category: 'snack', servingSize: '6 pieces', servingGrams: 120, calories: 240, protein: 5, carbs: 32, fat: 11, fiber: 3 },
    { name: 'Pani Puri', aliases: ['golgappa', 'puchka'], category: 'snack', servingSize: '6 pieces', servingGrams: 100, calories: 180, protein: 4, carbs: 30, fat: 5, fiber: 2 },
    { name: 'Dahi Puri', aliases: ['dahipuri'], category: 'snack', servingSize: '6 pieces', servingGrams: 150, calories: 260, protein: 6, carbs: 36, fat: 10, fiber: 3 },
    { name: 'Kachori', aliases: ['raj kachori', 'pyaaz kachori'], category: 'snack', servingSize: '1 piece', servingGrams: 80, calories: 280, protein: 6, carbs: 30, fat: 15, fiber: 3 },

    // === SIDES & ACCOMPANIMENTS ===
    { name: 'Raita', aliases: ['boondi raita', 'cucumber raita'], category: 'side', servingSize: '1 cup', servingGrams: 150, calories: 100, protein: 5, carbs: 10, fat: 4, fiber: 1 },
    { name: 'Pickle', aliases: ['achar', 'mango pickle'], category: 'side', servingSize: '1 tbsp', servingGrams: 15, calories: 25, protein: 0, carbs: 4, fat: 1, fiber: 0 },
    { name: 'Papad', aliases: ['papadum', 'appalam'], category: 'side', servingSize: '2 pieces', servingGrams: 20, calories: 70, protein: 3, carbs: 10, fat: 2, fiber: 1 },
    { name: 'Chutney', aliases: ['coconut chutney', 'green chutney'], category: 'side', servingSize: '2 tbsp', servingGrams: 30, calories: 40, protein: 1, carbs: 4, fat: 3, fiber: 1 },
    { name: 'Curd', aliases: ['dahi', 'yogurt', 'plain yogurt'], category: 'side', servingSize: '1 cup', servingGrams: 200, calories: 120, protein: 8, carbs: 12, fat: 5, fiber: 0 },
    { name: 'Butter', aliases: ['makhan'], category: 'side', servingSize: '1 tbsp', servingGrams: 14, calories: 100, protein: 0, carbs: 0, fat: 11, fiber: 0 },
    { name: 'Ghee', aliases: ['clarified butter'], category: 'side', servingSize: '1 tbsp', servingGrams: 14, calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0 },

    // === SWEETS ===
    { name: 'Gulab Jamun', aliases: ['gulaab jamun'], category: 'sweet', servingSize: '2 pieces', servingGrams: 80, calories: 300, protein: 4, carbs: 50, fat: 10, fiber: 0 },
    { name: 'Rasgulla', aliases: ['rosogolla'], category: 'sweet', servingSize: '2 pieces', servingGrams: 80, calories: 180, protein: 4, carbs: 36, fat: 2, fiber: 0 },
    { name: 'Jalebi', aliases: ['jilebi'], category: 'sweet', servingSize: '3 pieces', servingGrams: 60, calories: 220, protein: 2, carbs: 40, fat: 6, fiber: 0 },
    { name: 'Ladoo', aliases: ['laddoo', 'besan ladoo', 'motichoor ladoo'], category: 'sweet', servingSize: '2 pieces', servingGrams: 60, calories: 280, protein: 4, carbs: 36, fat: 14, fiber: 1 },
    { name: 'Kheer', aliases: ['rice pudding', 'payasam', 'payesh'], category: 'sweet', servingSize: '1 cup', servingGrams: 200, calories: 280, protein: 8, carbs: 42, fat: 10, fiber: 0 },
    { name: 'Halwa', aliases: ['suji halwa', 'gajar halwa', 'moong dal halwa'], category: 'sweet', servingSize: '1/2 cup', servingGrams: 100, calories: 300, protein: 4, carbs: 40, fat: 14, fiber: 1 },
    { name: 'Barfi', aliases: ['burfi', 'kaju katli', 'kaju barfi'], category: 'sweet', servingSize: '2 pieces', servingGrams: 50, calories: 220, protein: 4, carbs: 28, fat: 10, fiber: 0 },

    // === DRINKS ===
    { name: 'Chai', aliases: ['tea', 'masala chai', 'indian tea'], category: 'drink', servingSize: '1 cup', servingGrams: 200, calories: 80, protein: 2, carbs: 12, fat: 3, fiber: 0 },
    { name: 'Lassi', aliases: ['sweet lassi', 'punjabi lassi'], category: 'drink', servingSize: '1 glass', servingGrams: 300, calories: 220, protein: 8, carbs: 32, fat: 7, fiber: 0 },
    { name: 'Mango Lassi', aliases: ['aam lassi'], category: 'drink', servingSize: '1 glass', servingGrams: 300, calories: 280, protein: 7, carbs: 48, fat: 7, fiber: 1 },
    { name: 'Buttermilk', aliases: ['chaas', 'mattha', 'majjige'], category: 'drink', servingSize: '1 glass', servingGrams: 250, calories: 60, protein: 4, carbs: 8, fat: 1, fiber: 0 },
    { name: 'Nimbu Pani', aliases: ['lemonade', 'shikanji', 'lime water'], category: 'drink', servingSize: '1 glass', servingGrams: 250, calories: 50, protein: 0, carbs: 12, fat: 0, fiber: 0 },
    { name: 'Filter Coffee', aliases: ['south indian coffee', 'kaapi'], category: 'drink', servingSize: '1 cup', servingGrams: 150, calories: 90, protein: 2, carbs: 10, fat: 4, fiber: 0 },
];

// Helper function to find food in database
export function findFoodMatch(searchTerm: string): FoodEntry | null {
    const term = searchTerm.toLowerCase().trim();

    // First try exact name match
    const exactMatch = indianFoodDatabase.find(
        food => food.name.toLowerCase() === term
    );
    if (exactMatch) return exactMatch;

    // Then try alias match
    const aliasMatch = indianFoodDatabase.find(
        food => food.aliases.some(alias => alias.toLowerCase() === term)
    );
    if (aliasMatch) return aliasMatch;

    // Then try partial match in name
    const partialMatch = indianFoodDatabase.find(
        food => food.name.toLowerCase().includes(term) || term.includes(food.name.toLowerCase())
    );
    if (partialMatch) return partialMatch;

    // Finally try partial match in aliases
    const partialAliasMatch = indianFoodDatabase.find(
        food => food.aliases.some(alias =>
            alias.toLowerCase().includes(term) || term.includes(alias.toLowerCase())
        )
    );

    return partialAliasMatch || null;
}

// Calculate nutrition for multiple foods
export function calculateMealNutrition(foodItems: string[], portionMultiplier: number = 1.0) {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let matchedItems: string[] = [];
    let unmatchedItems: string[] = [];

    for (const item of foodItems) {
        const match = findFoodMatch(item);
        if (match) {
            totalCalories += match.calories * portionMultiplier;
            totalProtein += match.protein * portionMultiplier;
            totalCarbs += match.carbs * portionMultiplier;
            totalFat += match.fat * portionMultiplier;
            matchedItems.push(match.name);
        } else {
            unmatchedItems.push(item);
        }
    }

    return {
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fat: Math.round(totalFat),
        matchedItems,
        unmatchedItems,
        accuracy: matchedItems.length > 0 ? 'database' : 'estimated'
    };
}
