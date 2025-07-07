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
    <>
      <div className="flex flex-col items-center space-y-6 px-4 pt-12">
        <h1 className="text-2x1 font-bold">
          <span role="img" aria-label="pan">
            🍳
          </span>{" "}
          Rasoi Ghar
        </h1>
        <div className="w-full px-80">
          <RecipeForm
            onAdd={(newRecipe: any) => setRecipes([...recipes, newRecipe])}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipes.map((recipe, idx) => (
            <RecipeCard key={idx} recipe={recipe} />
          ))}
        </div>
      </div>
    </>
  );
}
