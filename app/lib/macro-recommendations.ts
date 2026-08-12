// Indian food recommendations database by macronutrient
export interface FoodRecommendation {
    name: string;
    amount: string;
    macro: number; // grams of the target macro
    calories: number;
    description: string;
}

export const proteinRecommendations: FoodRecommendation[] = [
    { name: 'Boiled Eggs', amount: '2 eggs', macro: 12, calories: 140, description: 'Quick and easy protein boost' },
    { name: 'Paneer', amount: '100g', macro: 18, calories: 265, description: 'Rich in protein and calcium' },
    { name: 'Greek Yogurt', amount: '1 cup', macro: 15, calories: 120, description: 'High protein, low fat option' },
    { name: 'Grilled Chicken', amount: '100g', macro: 31, calories: 165, description: 'Lean protein source' },
    { name: 'Dal (Lentils)', amount: '1 cup', macro: 12, calories: 180, description: 'Plant-based protein' },
    { name: 'Chickpeas', amount: '1 cup cooked', macro: 14, calories: 280, description: 'Protein and fiber combo' },
    { name: 'Tofu', amount: '100g', macro: 8, calories: 76, description: 'Low-calorie protein' },
    { name: 'Fish', amount: '100g', macro: 20, calories: 150, description: 'Lean protein with omega-3' },
    { name: 'Protein Shake', amount: '1 scoop', macro: 25, calories: 120, description: 'Convenient post-workout' },
    { name: 'Peanut Butter', amount: '2 tbsp', macro: 8, calories: 190, description: 'Protein with healthy fats' },
];

export const carbRecommendations: FoodRecommendation[] = [
    { name: 'Brown Rice', amount: '1 cup cooked', macro: 45, calories: 215, description: 'Complex carbs for energy' },
    { name: 'Sweet Potato', amount: '1 medium', macro: 27, calories: 112, description: 'Nutrient-dense carbs' },
    { name: 'Oats', amount: '1 cup cooked', macro: 28, calories: 150, description: 'Fiber-rich breakfast option' },
    { name: 'Banana', amount: '1 large', macro: 31, calories: 121, description: 'Quick energy before workout' },
    { name: 'Roti (Whole Wheat)', amount: '2 pieces', macro: 30, calories: 160, description: 'Traditional healthy carbs' },
    { name: 'Quinoa', amount: '1 cup cooked', macro: 39, calories: 222, description: 'Complete protein + carbs' },
    { name: 'Idli', amount: '3 pieces', macro: 42, calories: 195, description: 'Light and digestible' },
    { name: 'Apple', amount: '1 medium', macro: 25, calories: 95, description: 'Natural sugars with fiber' },
    { name: 'Poha', amount: '1 cup', macro: 45, calories: 270, description: 'Quick breakfast option' },
    { name: 'Whole Grain Bread', amount: '2 slices', macro: 24, calories: 160, description: 'Easy sandwich base' },
];

export const fatRecommendations: FoodRecommendation[] = [
    { name: 'Almonds', amount: '30g (23 nuts)', macro: 14, calories: 170, description: 'Healthy fats and protein' },
    { name: 'Avocado', amount: '1/2 medium', macro: 15, calories: 160, description: 'Heart-healthy monounsaturated fats' },
    { name: 'Olive Oil', amount: '1 tbsp', macro: 14, calories: 120, description: 'For cooking or salads' },
    { name: 'Ghee', amount: '1 tbsp', macro: 14, calories: 120, description: 'Traditional healthy fat' },
    { name: 'Walnuts', amount: '30g (14 halves)', macro: 18, calories: 185, description: 'Omega-3 rich nuts' },
    { name: 'Peanuts', amount: '30g', macro: 14, calories: 170, description: 'Affordable protein + fat' },
    { name: 'Coconut', amount: '30g fresh', macro: 10, calories: 106, description: 'Tropical healthy fats' },
    { name: 'Chia Seeds', amount: '2 tbsp', macro: 9, calories: 120, description: 'Omega-3 and fiber' },
    { name: 'Full-Fat Yogurt', amount: '1 cup', macro: 8, calories: 150, description: 'Probiotics + healthy fats' },
    { name: 'Dark Chocolate', amount: '30g (85%)', macro: 13, calories: 170, description: 'Treat with healthy fats' },
];

export function getRecommendations(macro: 'protein' | 'carbs' | 'fats', needed: number): FoodRecommendation[] {
    let recommendations: FoodRecommendation[] = [];

    switch (macro) {
        case 'protein':
            recommendations = proteinRecommendations;
            break;
        case 'carbs':
            recommendations = carbRecommendations;
            break;
        case 'fats':
            recommendations = fatRecommendations;
            break;
    }

    // Sort by how well they match the needed amount
    return recommendations
        .map(rec => ({
            ...rec,
            score: Math.abs(rec.macro - needed)
        }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 5); // Return top 5 matches
}
