import React from "react";

import { AddIngredient } from "./AddIngredient";
import { ListIngredients } from "./ListIngredients";
import { StyledWrapper } from "../components/StyledWrapper";

export function Ingredients() {
  return (
    <StyledWrapper>
      <AddIngredient />
      <ListIngredients />
    </StyledWrapper>
  );
}
