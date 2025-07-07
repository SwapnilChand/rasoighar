import { Card, CardContent } from "@/components/ui/card";

interface Props {
  recipe: {
    title: string;
  };
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold">{recipe.title}</h2>
      </CardContent>
    </Card>
  );
}
