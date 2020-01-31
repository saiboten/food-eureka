import { calculate } from "../calculate";
import { RecipeType } from "../../types";

test("Scoring one recipe against a date", () => {
  const recipeToScore: RecipeType = {
    description: "Hei",
    id: "1",
    ingredients: [],
    lastTimeSelected: new Date("2019-02-01T12:00:00"),
    name: "Something",
    weekdays: ["monday"],
    rating: 5,
    hasBeenSelected: false,
    recipetype: ["fish"]
  };

  // random 0
  // weekday: 100
  // weeks since: 2?
  expect(calculate(new Date("2019-02-18T12:00:00"), recipeToScore, 0)).toBe(
    107
  );
});
