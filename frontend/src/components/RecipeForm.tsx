import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const CATEGORIES = ["veg", "non-veg", "egg", "dessert", "beverage"];

export default function RecipeForm({ onAdd }: { onAdd: (data: any) => void }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTried, setIsTried] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const category = selectedCategories.join(",");

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
      setSelectedCategories([]);
      setIsTried(false);
      setImage(null);
    } catch (err) {
      console.error("Failed to add recipe", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" title="Add a Recipe">
      <div className="space-y-3">
        <Label>Title</Label>
        <Input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Label>Ingredients</Label>
        <Input
          required
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g: chopped-onions, potato"
        />

        <Label>Steps</Label>
        <Textarea value={steps} onChange={(e) => setSteps(e.target.value)} />

        <Label>Category</Label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="relative w-full justify-start flex-wrap min-h-[44px] rounded-md border px-3 py-2">
              {selectedCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center gap-1 font-bold bg-gray-800 px-2 py-1 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cat}
                      <X
                        size={14}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setSelectedCategories((prev) =>
                            prev.filter((c) => c !== cat)
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <span className="flex flex-row justify-between">
                  Select categories {isOpen ? <ChevronUp /> : <ChevronDown />}
                </span>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] bg-black text-white border border-white rounded-md shadow-lg"
            side="bottom"
            align="start"
          >
            <div className="flex flex-col space-y-2 max-h-60 overflow-y-auto">
              {CATEGORIES.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox
                    id={cat}
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  <label
                    htmlFor={cat}
                    className="capitalize text-sm cursor-pointer"
                  >
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="tried"
            checked={isTried}
            onCheckedChange={(checked: any) => setIsTried(Boolean(checked))}
          />
          <Label htmlFor="tried">Mark as tried</Label>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Image</Label>
          <div className="relative flex items-center gap-2">
            <input
              id="image-upload"
              type="file"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            <label
              htmlFor="image-upload"
              className="px-4 py-2 bg-blue-800 text-white rounded-md cursor-pointer hover:bg-blue-900 font-medium transition"
            >
              Choose File
            </label>
            <span className="text-gray-400 text-sm">
              {image ? image.name : "No file chosen"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          className="bg-gray-800 hover:bg-gray-700 cursor-pointer"
        >
          Add Recipe
        </Button>
      </div>
    </form>
  );
}
