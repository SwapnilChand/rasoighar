import { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "@/components/RecipeCard";
import RecipeForm from "@/components/RecipeForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { API_BASE } from "@/lib/api";

export type Recipe = {
  id: number;
  title: string;
  ingredients: string[];
  steps: string;
  category: string[];
  image_url?: string;
  is_tried: number;
};

export default function Home() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleRequestEdit = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsEditDialogOpen(true);
  };

  const handleRequestDelete = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDeleteDialogOpen(true);
  };

  // FETCH all recipes on mount
  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/recipes", {
        headers: { "Content-Type": "application/json" },
      });
      setRecipes(res.data);
    } catch (err) {
      console.error("Error during fetching recipes", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  //ADD new recipe
  const handleAdd = async (formData: FormData) => {
    try {
      const res = await axios.post(`${API_BASE}/add-recipe`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRecipes((prev) => [...prev, res.data]);
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error("Failed to add Recipe:", err);
    }
  };

  //DELETE a recipe
  const handleDelete = async () => {
    if (!selectedRecipe) return;
    try {
      await axios.delete(`${API_BASE}/recipes/${selectedRecipe.id}`);

      setRecipes((prev) => prev.filter((r) => r.id !== selectedRecipe.id));
      setIsDeleteDialogOpen(false);
      setSelectedRecipe(null);
    } catch (err) {
      console.error("Error trying to delete", err);
    }
  };

  //EDIT a recipe
  const handleEdit = async (formData: FormData) => {
    if (!selectedRecipe) return;
    try {
      const res = await axios.patch(
        `${API_BASE}/recipes/${selectedRecipe.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setRecipes((prev) =>
        prev.map((r) => (r.id === selectedRecipe.id ? res.data : r))
      );
      setIsEditDialogOpen(false);
      setSelectedRecipe(null);
    } catch (err) {
      console.error("Error while patching a new recipe", err);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col space-y-6 px-4 pt-12">
        <div className="flex flex-row justify-between">
          <h1 className="max-w-4xl text-xl font-bold mx-auto">
            <span role="img" aria-label="pan">
              🍳
            </span>{" "}
            Rasoi Ghar
          </h1>
          {/* Dialog for adding a recipe */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer text-gray-300 hover:bg-gray-600 border">
                Add Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-black rounded-md">
              <RecipeForm onSubmit={handleAdd} />
            </DialogContent>
          </Dialog>
        </div>

        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full px-4 py-2 border rounded-md shadow-sm"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recipes.map((recipe, idx) => (
            <RecipeCard
              key={idx}
              recipe={recipe}
              onRequestEdit={() => handleRequestEdit(recipe)}
              onRequestDelete={() => handleRequestDelete(recipe)}
            />
          ))}
        </div>

        {/* Edit dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          {" "}
          <DialogContent className="max-w-md bg-black rounded-md">
            <RecipeForm
              isEdit
              initialData={selectedRecipe}
              onSubmit={handleEdit}
            />
          </DialogContent>
        </Dialog>
        {/* Delete dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          {" "}
          <DialogContent className="max-w-md bg-black rounded-md">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This will permanently delete the recipe for "
                {selectedRecipe?.title}". This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="secondary"
                className="border cursor-pointer"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="border cursor-pointer"
                onClick={handleDelete}
              >
                Yes, Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
