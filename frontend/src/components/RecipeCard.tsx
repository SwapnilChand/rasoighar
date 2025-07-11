import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { API_BASE } from "@/lib/api";
import { CATEGORY_EMOJIS } from "./RecipeForm";

export default function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col cursor-pointer rounded-xl border border-gray-600 h-100 overflow-hidden">
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
            {recipe.category.split(",").length > 0 ? (
              recipe.category
                .split(",")
                .map((cat: string) => (
                  <label className="text-sm">
                    {CATEGORY_EMOJIS[cat] || "🍽"}{" "}
                  </label>
                ))
            ) : (
              <div className="text-sm">
                {CATEGORY_EMOJIS[recipe.category] || "🍽"} {recipe.category}
              </div>
            )}

            <div className="h-5" />
            <h5 className="font-semibold text-xl">{recipe.title}</h5>
            <h1 className="text-sm text-gray-400 ">
              {recipe.ingredients.join(", ")}
            </h1>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-lg space-y-3 bg-black max-h-[80%]">
        <h2 className="text-2xl font-bold">{recipe.title}</h2>
        <div>
          {recipe.category.split(",").length > 0 ? (
            recipe.category.split(",").map((cat: string) => (
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
          <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
        </p>
        <p>
          <strong>Steps:</strong> {recipe.steps}
        </p>
        <p>
          <strong>Tried:</strong> {recipe.is_tried ? "✅ Yes" : "❌ No"}
        </p>
        <div className="flex justify-center">
          {recipe.image_url && (
            <img
              src={`${API_BASE}${recipe.image_url}`}
              alt={recipe.title}
              className="w-auto rounded-md max-h-[60%]"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
