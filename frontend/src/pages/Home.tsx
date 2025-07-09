import { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "@/components/RecipeCard";
import RecipeForm from "@/components/RecipeForm";
import AddRecipeCard from "@/components/AddRecipeCard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Home() {
  type Recipe = {
    title: string;
    ingredients: string[];
    steps: string;
    category: string;
    image_url?: string;
    is_tried?: number;
  };

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [open, setOpen] = useState(false);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/recipes", {
        headers: { "Content-Type": "application/json" },
      });
      const data = res.data.map((r: any) => ({
        ...r,
        ingredients: r.ingredients.split(",").map((i: string) => i.trim()),
      }));
      setRecipes(data);
    } catch (err) {
      console.error("Error during fetching recipes", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAdd = (newRecipe: Recipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
    setOpen(false);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col space-y-6 px-4 pt-12">
        <h1 className="max-w-4xl text-xl font-bold mx-auto">
          <span role="img" aria-label="pan">
            🍳
          </span>{" "}
          Rasoi Ghar
        </h1>

        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full px-4 py-2 border rounded-md shadow-sm"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recipes.map((recipe, idx) => (
            <RecipeCard key={idx} recipe={recipe} />
          ))}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button>
                <AddRecipeCard />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-black rounded-md">
              <RecipeForm onAdd={handleAdd} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
