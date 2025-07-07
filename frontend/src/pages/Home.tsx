import RecipeForm from "@/components/RecipeForm";
import RecipeCard from "@/components/RecipeCard";
import { useState } from "react";

export default function Home() {
  type Recipe = {
    title: string;
    ingredients: string[];
    steps: string;
    category: string;
  };

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">🍳 Recipe Manager</h1>

      {/* Recipe Creation Form */}
      <RecipeForm
        onAdd={(newRecipe: any) => setRecipes([...recipes, newRecipe])}
      />

      {/* List of Recipes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe, idx) => (
          <RecipeCard key={idx} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
