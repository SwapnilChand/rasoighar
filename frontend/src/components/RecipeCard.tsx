import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { API_BASE } from "@/lib/api";
import { CATEGORY_EMOJIS } from "./RecipeForm";
import { PencilIcon, Trash } from "lucide-react";
import { Button } from "./ui/button";

export default function RecipeCard({
  recipe,
  onRequestEdit,
  onRequestDelete,
  onAddIngredients,
}: {
  recipe: any;
  onRequestEdit: () => void;
  onRequestDelete: () => void;
  onAddIngredients: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col cursor-pointer rounded-xl border border-gray-600 h-70 overflow-hidden">
          <div
            className="h-full transition-transform duration-300 ease-in-out hover:scale-102 p-4"
            style={{
              backgroundImage: `radial-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url(${API_BASE}${recipe.image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundImage = `radial-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${API_BASE}${recipe.image_url})`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundImage = `radial-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url(${API_BASE}${recipe.image_url})`)
            }
          >
            {recipe.category.length > 0 &&
              recipe.category.map((cat: string) => (
                <label className="text-sm">
                  {CATEGORY_EMOJIS[cat] || "🍽"}{" "}
                </label>
              ))}

            <div className="h-5" />
            <div className="flex justify-between">
              <div>
                <h5 className="font-semibold text-xl text-white">
                  {recipe.title}
                </h5>
                <h1 className="text-sm text-gray-400 ">
                  {recipe.ingredients.join(", ")}
                </h1>
              </div>
              {/* Add ingredients to Cart Button */}
              <div className="flex justify-end">
                <Button
                  title="Add Ingredients to Cart"
                  className="rounded-md bg-brand-bg text-green hover:bg-gray-200 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddIngredients;
                  }}
                >
                  {" "}
                  Add{" "}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-row justify-between min-w-250 space-y-3 bg-black text-white min-h-150 border border-gray-700">
        <div
          className="w-1/2 flex flex-col shadow shadow-md rounded-md p-4 gap-y-4"
          style={{
            backgroundImage: `radial-gradient(rgba(0,0,0,0.8), rgba(0,0,0,1)), url(${API_BASE}${recipe.image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h2 className="text-2xl font-bold">{recipe.title}</h2>
          <div>
            {recipe.category.length > 0 ? (
              recipe.category.map((cat: string) => (
                <label className="text-sm">
                  {CATEGORY_EMOJIS[cat] || "🍽"}
                  {cat}
                  <br />
                </label>
              ))
            ) : (
              <div className="text-sm">
                {CATEGORY_EMOJIS[recipe.category] || "🍽"} {recipe.category}
              </div>
            )}
          </div>
          <p>
            <strong>Tried</strong> <br />
            {recipe.is_tried ? "✅ Yes" : "❌ No"}
          </p>
          <p>
            <strong>Ingredients</strong>{" "}
            <h1 className="text-sm text-gray-400 ">
              {recipe.ingredients.join(", ")}
            </h1>
          </p>
        </div>
        <div className="flex flex-col flex-1 justify-between p-4 ">
          <p className="max-h-100">
            <strong>Steps:</strong>{" "}
            <p className="whitespace-pre-wrap">{recipe.steps}</p>
          </p>
          <div className="mt-4">
            <div className="flex flex-row justify-end gap-2">
              <Button
                className="border rounded-md hover:text-grey-700 cursor-pointer hover:bg-gray-800"
                onClick={onRequestDelete}
              >
                <Trash />
              </Button>
              <Button
                className="border rounded-md hover:text-grey-700 cursor-pointer hover:bg-gray-800"
                onClick={onRequestEdit}
              >
                <PencilIcon />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
