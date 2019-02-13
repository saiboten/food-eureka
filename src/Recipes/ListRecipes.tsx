import React, { useEffect } from "react";
import { RecipeType } from "../types";
import { firebase } from "../firebase/firebase";
import { StyledListItem } from "../components/StyledList";

function deleteItem(id: string) {
  const db = firebase.firestore();
  const recipes = db
    .collection("recipes")
    .doc(id)
    .delete();
}

export const ListRecipes = ({
  state,
  dispatch
}: {
  state: RecipeType[];
  dispatch: any;
}) => {
  useEffect(() => {
    const db = firebase.firestore();
    db.collection("recipes").onSnapshot(querySnapshot => {
      dispatch({ type: "setRecipes", recipes: querySnapshot.docs });
    });

    return () => {};
  }, []);

  return (
    <ul>
      {state.map(el => (
        <StyledListItem key={el.id}>
          {el.name} - {el.description}
          <div onClick={() => deleteItem(el.id)}>Slett</div>
        </StyledListItem>
      ))}
    </ul>
  );
};
