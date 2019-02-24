import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";
import { RecipeType, RecipeWithRatingType } from "../types";
import nbLocale from "date-fns/locale/nb";
import { StyledActionButton } from "../components/StyledActionButton";
import { calculate } from "../calculator/calculate";

interface Props {
  date: Date;
}

const StyledDay = styled.div`
  width: 150px;
  border: 1px solid black;
  display: inline-block;
  padding: 20px 10px;
  text-align: center;
  margin: 5px;
`;

const initialState: RecipeType = {
  name: "",
  description: "",
  id: "",
  ingredients: [],
  weekdays: [],
  lastTimeSelected: new Date(),
  rating: 1
};

const storeSelectedRecipe = (date: Date, recipe: RecipeType) => {
  firebase
    .firestore()
    .collection("days")
    .add({
      date,
      recipe: recipe.id
    });
};

const findRecipe = (date: Date) => {
  return new Promise(resolve => {
    firebase
      .firestore()
      .collection("recipes")
      .onSnapshot(snapshot => {
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

        console.log(logThis);

        const bestRecipe = recipesWithRating.reduce(
          (
            bestRecipe: RecipeWithRatingType,
            testRecipe: RecipeWithRatingType
          ) =>
            bestRecipe.score.totalScore > testRecipe.score.totalScore
              ? bestRecipe
              : testRecipe
        );
        resolve(bestRecipe);
      });
  });
};

const GenerateDay = ({ date }: { date: Date }) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [showConfirm, setShowConfirm]: [boolean, any] = useState(false);
  const [stored, setStored]: [boolean, any] = useState(false);

  if (stored) {
    return <div>{recipe.name}</div>;
  }

  return (
    <div>
      <div>{recipe.name}</div>
      <StyledActionButton
        onClick={() => {
          setShowConfirm(true);
          findRecipe(date).then((recipe: any) => setRecipe(recipe));
        }}
      >
        Lag dag
      </StyledActionButton>
      {showConfirm && (
        <StyledActionButton
          onClick={() => {
            storeSelectedRecipe(date, recipe);
            setStored(true);
          }}
        >
          Lagre dag
        </StyledActionButton>
      )}
    </div>
  );
};

export const Day = ({ date }: Props) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [recipeFound, setRecipeFound]: any = useState(false);
  const [showConfirm, setShowConfig]: [boolean, any] = useState(false);

  useEffect(
    () => {
      setRecipe(initialState);
      const db = firebase.firestore();
      setRecipeFound(false);
      const daysQuery = db.collection("days").where("date", "==", date);
      daysQuery.get().then(daysMatches => {
        daysMatches.forEach(daysMatch => {
          db.collection("recipes")
            .doc(daysMatch.data().recipe)
            .get()
            .then(doc => {
              setRecipeFound(true);
              setRecipe(doc.data());
            });
        });
      });
    },
    [date]
  );

  return (
    <StyledDay>
      <p>{format(date, "dddd DD.MM.YYYY", { locale: nbLocale })}</p>
      <div>
        {recipe.name === "" ? <GenerateDay date={date} /> : recipe.name}
      </div>
    </StyledDay>
  );
};
