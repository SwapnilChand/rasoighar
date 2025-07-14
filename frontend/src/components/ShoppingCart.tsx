import { Button } from "./ui/button";
export default function ShoppingCart({
  items,
  isCartOpen,
  onToggle,
}: {
  items: any;
  isCartOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      {isCartOpen ? (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            style={{ pointerEvents: "auto" }}
            onClick={onToggle}
          />
          <div className="w-[80%] px-3.5 transition-height duration-300 rounded-t-lg absolute bottom-0 bg-brand-secondary text-brand-text cursor-pointer z-50">
            <div className="flex flex-col justify-between p-4 rounded-t-lg bg-white mt-2.5 gap-5">
              <h1 className="font-sans font-bold">Shopping List</h1>
              <hr />
              <ul>
                {items.map((item: string) => (
                  <li key={item}>{item}</li>
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
