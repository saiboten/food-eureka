import React, { useReducer } from "react";
import { ListRecipes } from "./ListRecipes";
import { AddRecipe } from "./AddRecipe";

export const Recipes = () => (
  <div>
    <AddRecipe />
    <ListRecipes />
  </div>
);
