export enum Unit {
  Liter = 1,
  Units,
  Kg,
  Cups
}

export interface Ingredient {
  name: string;
  unit: Unit;
  id: string;
}

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface RecipeType {
  name: string;
  description: string;
  id: string;
  ingredients: string[];
  weekdays: WeekDay[];
  lastTimeSelected: Date;
  rating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}
