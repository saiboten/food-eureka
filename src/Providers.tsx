import React, { useState } from "react";
import { UserContextState, User, UserContext } from "./context/UserContext";
import { UserDataContext, UserData } from "./context/UserDataContext";
import { RecipeContextState, RecipeContext } from "./context/RecipeContext";
import {
  IngredientsContextState,
  IngredientsContext
} from "./context/IngredientsContext";
import { GroupDataContext, GroupData } from "./context/GroupDataContext";

export const Providers = ({ children }: { children: any }) => {
  const [user, setUser]: [User, any] = useState({
    displayName: "",
    email: "",
    uid: ""
  });

  const [groupData, setGroupdata]: [GroupData, any] = useState({
    id: "",
    trelloApiKey: "",
    trelloApiToken: "",
    trelloList: "",
    owner: "",
    name: "",
    invites: [],
    members: []
  });

  const [userdata, setUserdata]: [UserData, any] = useState({
    group: ""
  });

  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const userContextValue: UserContextState = {
    user,
    setUser
  };

  const userDataContextValue: UserDataContext = {
    userdata,
    setUserdata
  };

  const recipesContextValue: RecipeContextState = {
    recipes,
    setRecipes
  };

  const ingredientsContextValue: IngredientsContextState = {
    ingredients,
    setIngredients
  };

  const groupDataContextValue: GroupDataContext = {
    groupData,
    setGroupdata
  };

  return (
    <RecipeContext.Provider value={recipesContextValue}>
      <IngredientsContext.Provider value={ingredientsContextValue}>
        <UserContext.Provider value={userContextValue}>
          <UserDataContext.Provider value={userDataContextValue}>
            <GroupDataContext.Provider value={groupDataContextValue}>
              {children}
            </GroupDataContext.Provider>
          </UserDataContext.Provider>
        </UserContext.Provider>
      </IngredientsContext.Provider>
    </RecipeContext.Provider>
  );
};