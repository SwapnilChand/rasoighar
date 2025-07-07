import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onAdd: (recipe: any) => void;
}

export default function RecipeForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRecipe = { title };
    onAdd(newRecipe);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Recipe title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button
        type="submit"
        className="hover:bg-grey-700 hover:text-grey-200 transition"
      >
        Add
      </Button>
    </form>
  );
}
