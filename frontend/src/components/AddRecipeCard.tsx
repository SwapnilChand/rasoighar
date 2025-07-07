import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function AddRecipeCard() {
  return (
    <Card className="cursor-pointer flex items-center justify-center text-gray-500 hover:bg-gray-100 min-h-[180px]">
      <Plus size={40} />
    </Card>
  );
}
