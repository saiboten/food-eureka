import React from "react";
import styled from "styled-components";
import { RecipeType } from "../types";
import { StyledHeaderH1NoMarginTop } from "../components/StyledHeaderH1";
import { Link } from "react-router-dom";
import { SeeIngredients } from "./SeeIngredients";

const StyledWrapper = styled.div`
  margin-top: 2.5rem;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

interface Props {
  recipe: RecipeType | undefined;
}

const StyledEmpesizedP = styled.p`
  font-weight: bold;
  margin-top: 1rem;
`;

interface ImageProps {
  src: string;
}

const Image = styled.img<ImageProps>`
  width: 100%;
  display: block;
  margin-top: -2.5rem;
  opacity: 0.2;
`;

export const RecipeDetails = ({ recipe }: Props) => {
  if (!recipe) {
    return null;
  }

  const { name, description, ingredients, id } = recipe;

  return (
    <StyledWrapper>
      <Image src="stock2.jpeg" />
      <StyledHeaderH1NoMarginTop
        style={{ padding: "0 1rem", paddingTop: "1rem", marginBottom: "0" }}
      >
        <Link to={`/recipes/${id}`}>{name}</Link>
      </StyledHeaderH1NoMarginTop>
      <div
        style={{ padding: "0 1rem", paddingBottom: "1rem", textAlign: "left" }}
      >
        {description && (
          <>
            <StyledEmpesizedP>Beskrivelse</StyledEmpesizedP>
            <p>{description}</p>
          </>
        )}
        <SeeIngredients ingredientsIds={ingredients} />
      </div>
    </StyledWrapper>
  );
};
