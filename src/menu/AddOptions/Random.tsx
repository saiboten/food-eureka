import React, { useEffect, useState, useContext } from "react";
import { RecipeType, RecipeWithRatingType, ScoreDetails } from "../../types";
import { RecipeDetails } from "../RecipeDetail";
import {
  StyledActionButtonWithMargins,
  StyledSecondaryActionButtonWithMargins
} from "../../components/StyledActionButton";
import { firebase } from "../../firebase/firebase";
import styled from "styled-components";
import { calculate } from "../../calculator/calculate";
import {
  StyledBack,
  StyledCheck,
  StyledRotate
} from "../../components/StyledSvgIcons";
import { UserDataContext, UserData } from "../../context/UserDataContext";

interface Props {
  date: Date;
  back: () => void;
}

const storeSelectedRecipe = (date: Date, recipeId: string, group: string) => {
  firebase
    .firestore()
    .collection("days")
    .add({
      date,
      recipe: recipeId,
      group
    });

  firebase
    .firestore()
    .collection("recipes")
    .doc(recipeId)
    .update({
      lastTimeSelected: date,
      hasBeenSelected: true
    });
};

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const findRecipe = (date: Date, userData: UserData) => {
  return new Promise(resolve => {
    firebase
      .firestore()
      .collection("recipes")
      .where("group", "==", userData.group)
      .get()
      .then(snapshot => {
        const recipes = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          lastTimeSelected: doc.data().lastTimeSelected.toDate()
        }));

        const recipesWithRating = recipes.map(
          (recipe: RecipeWithRatingType) => ({
            ...recipe,
            score: calculate(date, recipe, 50)
          })
        );
        const logThis = recipesWithRating.map(({ name, score }: any) => ({
          ...score,
          name
        }));

        console.log(
          logThis.sort((el1, el2) => el2.totalScore - el1.totalScore)
        );

        const bestRecipe = recipesWithRating.reduce(
          (
            bestRecipe: RecipeWithRatingType,
            testRecipe: RecipeWithRatingType
          ) =>
            bestRecipe.score.totalScore > testRecipe.score.totalScore
              ? bestRecipe
              : testRecipe
        );
        resolve({ bestRecipe, logThis });
      });
  });
};

const initialState: RecipeType = {
  name: "",
  description: "",
  id: "",
  ingredients: [],
  weekdays: [],
  lastTimeSelected: new Date(),
  rating: 1,
  hasBeenSelected: false
};

export const Random = ({ date, back }: Props) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [scoreDetails, setScoreDetails]: [any[], any] = useState([]);

  const userdata = useContext(UserDataContext).userdata;

  useEffect(() => {
    findRecipe(date, userdata).then((data: any) => {
      setRecipe(data.bestRecipe);
      setScoreDetails(data.logThis);
    });
  }, []);

  console.log(scoreDetails);

  return (
    <>
      <StyledButtonContainer>
        <StyledSecondaryActionButtonWithMargins onClick={back}>
          <StyledBack />
        </StyledSecondaryActionButtonWithMargins>
        <StyledActionButtonWithMargins
          onClick={() => {
            storeSelectedRecipe(date, recipe.id, userdata.group);
          }}
        >
          <StyledCheck />
        </StyledActionButtonWithMargins>
        <StyledActionButtonWithMargins
          onClick={() =>
            findRecipe(date, userdata).then(({ bestRecipe, logThis }: any) => {
              setRecipe(bestRecipe);
              setScoreDetails(logThis);
            })
          }
        >
          <StyledRotate />
        </StyledActionButtonWithMargins>
      </StyledButtonContainer>
      <RecipeDetails recipe={recipe} />
      {scoreDetails.length > 0 &&
        scoreDetails.map(
          (
            {
              name,
              totalScore,
              dateScore,
              frequencyScore,
              neverEatenScore,
              randomScore
            },
            index
          ) => (
            <li style={{ marginBottom: "1rem", textAlign: "left" }} key={index}>
              {name}. Tot: {totalScore}. Date: {dateScore}. Freq:{" "}
              {frequencyScore}. Never: {neverEatenScore}. Random: {randomScore}
            </li>
          )
        )}
    </>
  );
};
