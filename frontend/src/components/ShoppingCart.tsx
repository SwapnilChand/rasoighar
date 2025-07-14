import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import type { Recipe } from "@/pages/Home";
import { API_BASE } from "@/lib/api";

export default function ShoppingCart({
  items,
  isCartOpen,
  onToggle,
  onRemoveItem,
}: {
  items: Recipe[];
  isCartOpen: boolean;
  onToggle: () => void;
  onRemoveItem: (id: number) => void;
}) {
  const allIngredients = items.flatMap((item) => item.ingredients);
  const uniqueIngredients = new Set(allIngredients);

  return (
    <>
      {isCartOpen ? (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            style={{ pointerEvents: "auto" }}
            onClick={onToggle}
          />
          <div className="w-[80%] px-3.5 transition-height duration-300 rounded-t-lg absolute bottom-0 bg-brand-secondary text-brand-text  z-50">
            <div className="flex flex-col justify-between p-4 rounded-t-lg bg-white mt-2.5 gap-5">
              <h1 className="font-sans font-bold">Shopping List</h1>
              <hr />
              <ul className="flex-grow overflow-y-auto">
                {/* Map over the full recipe objects */}
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-2 border-b"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={`${API_BASE}${item.image_url}`}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-400">
                          {item.ingredients.join(", ")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500"
                    >
                      <Trash className="cursor-pointer" size={20} />
                    </button>
                  </li>
                ))}
              </ul>
              <Button
                onClick={onToggle}
                className="cursor-pointer rounded-xl text-brand-text hover:bg-brand-subtle hover:text-white border"
              >
                Close
              </Button>
            </div>
          </div>
        </>
      ) : (
        items.length > 0 && (
          <div
            className="w-[80%] px-3.5 rounded-t-lg absolute bottom-0 bg-brand-secondary text-brand-text cursor-pointer"
            onClick={onToggle}
          >
            <div className="flex justify-between p-4 rounded-t-lg bg-white mt-2.5">
              {/* counter */}
              <h1>{items.length} items added</h1>
              <h1>VIEW CART</h1>
            </div>
          </div>
        )
      )}
    </>
  );
}
