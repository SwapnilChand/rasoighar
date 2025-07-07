import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function RecipeForm({ onAdd }: { onAdd: (data: any) => void }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [category, setCategory] = useState("");
  const [isTried, setIsTried] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("steps", steps);
    formData.append("category", category);
    formData.append("is_tried", isTried ? "1" : "0");
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/add-recipe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const recipe = {
        title,
        ingredients: ingredients.split(",").map((i) => i.trim()),
        steps,
        category,
        is_tried: isTried ? 1 : 0,
        image_url: res.data.image_url || null,
      };

      onAdd(recipe);
      // Reset form
      setTitle("");
      setIngredients("");
      setSteps("");
      setCategory("");
      setIsTried(false);
      setImage(null);
    } catch (err) {
      console.error("Failed to add recipe", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />

        <Label>Ingredients</Label>
        <Input
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g: chopped-onions, potato"
        />

        <Label>Steps</Label>
        <Textarea value={steps} onChange={(e) => setSteps(e.target.value)} />

        <Label>Category</Label>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="tried"
            checked={isTried}
            onCheckedChange={(checked: any) => setIsTried(Boolean(checked))}
          />
          <Label htmlFor="tried">Mark as tried</Label>
        </div>

        <Label>Image</Label>
        <Input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>

      <Button type="submit">Add Recipe</Button>
    </form>
  );
}
