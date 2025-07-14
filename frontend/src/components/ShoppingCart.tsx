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
        <div className="w-[80%] px-5 absolute bottom-0 bg-brand-secondary text-brand-text">
          <div className="flex justify-between p-4">
            {/* counter */}
            <h1>{items.length} items added</h1>
            <h1>VIEW CART</h1>
          </div>
        </div>
      ) : (
        items.length > 0 && (
          <div className="w-[80%] px-5 rounded-t-lg absolute bottom-0 bg-brand-secondary text-brand-text">
            <div className="flex justify-between p-4">
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
