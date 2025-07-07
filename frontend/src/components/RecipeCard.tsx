import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer p-4 shadow hover:bg-gray-50">
          <h3 className="font-semibold text-lg">{recipe.title}</h3>
          <p className="text-sm text-gray-500">{recipe.category}</p>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-lg space-y-3">
        <h2 className="text-2xl font-bold">{recipe.title}</h2>
        <p>
          <strong>Category:</strong> {recipe.category}
        </p>
        <p>
          <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
        </p>
        <p>
          <strong>Steps:</strong> {recipe.steps}
        </p>
        <p>
          <strong>Tried:</strong> {recipe.is_tried ? "✅ Yes" : "❌ No"}
        </p>
        {recipe.image_url && (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-auto rounded border"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
