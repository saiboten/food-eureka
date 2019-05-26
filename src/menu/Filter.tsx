import React, { useState, useContext } from "react";
import { availableFilters } from "./availableFilters";
import { StyledActionButtonForText } from "../components/StyledActionButton";
import { RecipeType } from "../types";
import { StyledInputLabel } from "../components/StyledInputLabel";
import Select from "react-select";
import { IngredientsContext } from "../context/IngredientsContext";

interface Props {
  activeFilters: any;
  setActiveFilters: any;
}

export interface Filter {
  name: string;
  filter: (list: RecipeType[]) => RecipeType[];
}

export const Filter = ({ activeFilters, setActiveFilters }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(undefined);

  const { ingredients } = useContext(IngredientsContext);

  const handleChange = (selectedOption: any) => {
    console.log(`Option selected:`, selectedOption);
  };

  if (!open) {
    return (
      <StyledActionButtonForText onClick={() => setOpen(true)}>
        Filtrer oppskrifter
      </StyledActionButtonForText>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "white",
        padding: "1rem",
        justifyContent: "flex-start",
        flexWrap: "wrap"
      }}
    >
      <Select
        value={selectedIngredient}
        onChange={handleChange}
        isMulti
        options={ingredients.map(({ name, id }) => ({
          label: name,
          value: id
        }))}
      />

      {availableFilters().map((el: Filter) => (
        <StyledInputLabel key={el.name}>
          <input
            type="checkbox"
            onChange={() =>
              activeFilters.some(
                (activeFilter: Filter) => el.name === activeFilter.name
              )
                ? setActiveFilters(
                    activeFilters.filter(
                      (activeFilter: Filter) => el.name !== activeFilter.name
                    )
                  )
                : setActiveFilters([el, ...activeFilters])
            }
          />
          {el.name}
        </StyledInputLabel>
      ))}
      <StyledActionButtonForText
        style={{ marginLeft: "auto" }}
        onClick={() => setOpen(false)}
      >
        Lukk filtrering
      </StyledActionButtonForText>
    </div>
  );
};
