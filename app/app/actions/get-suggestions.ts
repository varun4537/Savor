"use server";

export async function getSuggestions(mood: string = "balanced") {
    // Mock suggestions for speed/reliability in MVP
    // In real app, this would query OpenAI based on user history

    const suggestions = [
        {
            id: "1",
            title: "Warm Lentil Soup",
            description: "Comforting and protein-rich. Perfect for a gentle evening.",
            time: "20 min",
            calories: "350 kcal",
            tags: ["High Protein", "Vegetarian"]
        },
        {
            id: "2",
            title: "Quinoa & Avocado Bowl",
            description: "Light but satisfying with healthy fats.",
            time: "15 min",
            calories: "420 kcal",
            tags: ["Vegan", "Fiber Rich"]
        },
        {
            id: "3",
            title: "Grilled Paneer Salad",
            description: "Crunchy veggies with soft paneer cubes.",
            time: "10 min",
            calories: "380 kcal",
            tags: ["Low Carb", "Quick"]
        }
    ];

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return suggestions;
}
