import React, { useEffect, useReducer, useContext } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Ingredients } from "./ingredients/Ingredients";
import { createGlobalStyle } from "styled-components";
import { Recipes } from "./recipes/Recipes";
import { RecipeContext } from "./context/RecipeContext";
import { EditRecipeDetails } from "./recipes/EditRecipeDetails";
import { IngredientsContext } from "./context/IngredientsContext";
import { Week } from "./menu/Week";
import { firebase } from "./firebase/firebase";
import { StyledLoader } from "./components/StyledLoader";
import { Login } from "./login/Login";
import { UserContext } from "./context/UserContext";
import { Nav } from "./components/Nav";
import { UserDataContext } from "./context/UserDataContext";
import { GroupDataContext } from "./context/GroupDataContext";
import { JoinGroupRouter } from "./group/JoinOrCreateGroup";
import { Settings } from "./settings/Settings";
import { Providers } from "./Providers";
import { AddRecipe } from "./recipes/AddRecipe";
import { ListRecipesAndRedirect } from "./recipes/ListRecipesAndRedirect";
import { AdminGroup } from "./settings/AdminGroup";

const GlobalStyle = createGlobalStyle`
  *,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
}

a:link, a:visited {
  color: black;
}

html {
    // This defines what 1 rem is
    background-color: #f5f5f5;
    font-size: 62.5%; // 1 rem == 10px
    font-family: Palatino,Palatino Linotype,Palatino LT STD,Book Antiqua,Georgia,serif;
}

body {
    box-sizing: border-box;
    font-size: 1.6rem;
}

ul {
  list-style-type: none;
}

li {
  text-decoration: none;
}

::selection {

}

`;

const App = () => {
  return (
    <Router>
      <>
        <GlobalStyle />
        <Providers>
          <AppRouter />
        </Providers>
      </>
    </Router>
  );
};

interface State {
  recipesLoading: boolean;
  ingredientsLoading: boolean;
  userdataLoaded: boolean;
  loggedIn: boolean;
  loggedInStateClarified: boolean;
}

const initialState: State = {
  recipesLoading: true,
  ingredientsLoading: true,
  userdataLoaded: false,
  loggedIn: false,
  loggedInStateClarified: false
};

function reducer(state: State, action: any) {
  switch (action.type) {
    case "loggedInStateClarified":
      return {
        ...state,
        loggedInStateClarified: true
      };
    case "userLoggedIn":
      return {
        ...state,
        loggedIn: true
      };
    case "userLoggedOut":
      return {
        ...state,
        loggedIn: false
      };
    case "userdataLoaded":
      return {
        ...state,
        userdataLoaded: true
      };
    case "recipesLoaded":
      return {
        ...state,
        recipesLoading: false
      };
    case "ingredientsLoaded":
      return {
        ...state,
        ingredientsLoading: false
      };
    default:
      throw new Error();
  }
}

const AppRouter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { setUser } = useContext(UserContext);
  const { userdata, setUserdata } = useContext(UserDataContext);
  const { setRecipes } = useContext(RecipeContext);
  const { setIngredients } = useContext(IngredientsContext);
  const { setGroupdata } = useContext(GroupDataContext);

  useEffect(
    () => {
      let unsubUserData = () => {};
      let unsubRecipes = () => {};
      let unsubIngredients = () => {};
      let unsubGroupData = () => {};

      let unsubAuthChange = firebase.auth().onAuthStateChanged((user: any) => {
        dispatch({ type: "loggedInStateClarified" });
        if (user) {
          setUser(user);
          dispatch({ type: "userLoggedIn" });
          const db = firebase.firestore();

          unsubUserData = db
            .collection("userdata")
            .doc(user.uid)
            .onSnapshot(querySnapshot => {
              const userdata: any = querySnapshot.data() || { group: "" };

              setUserdata(userdata);
              dispatch({ type: "userdataLoaded" });
              if (userdata.group) {
                unsubRecipes = db
                  .collection("recipes")
                  .where("group", "==", userdata.group)
                  .onSnapshot(querySnapshot => {
                    dispatch({ type: "recipesLoaded" });
                    setRecipes(
                      querySnapshot.docs.map((doc: any) => ({
                        id: doc.id,
                        ...doc.data()
                      }))
                    );
                  });
              }

              unsubIngredients = db
                .collection("ingredients")
                .where("group", "==", userdata.group)
                .onSnapshot(querySnapshot => {
                  dispatch({ type: "ingredientsLoaded" });
                  setIngredients(
                    querySnapshot.docs.map((doc: any) => ({
                      id: doc.id,
                      ...doc.data()
                    }))
                  );
                });

              if (userdata.group) {
                unsubGroupData = db
                  .collection("groups")
                  .doc(userdata.group)
                  .onSnapshot(querySnapshot => {
                    const groupData: any = querySnapshot.data();

                    setGroupdata({
                      id: querySnapshot.id,
                      ...groupData
                    });
                  });
              }
            });
        } else {
          dispatch({ type: "userLoggedOut" });
        }
      });

      return () => {
        unsubUserData();
        unsubAuthChange();
        unsubGroupData();
        unsubRecipes();
        unsubIngredients();
      };
    },
    [
      setGroupdata,
      setIngredients,
      setRecipes,
      setUser,
      setUserdata,
      userdata.group
    ]
  );

  if (!state.loggedInStateClarified) {
    return <StyledLoader />;
  }

  if (!state.loggedIn) {
    return <Login />;
  }

  if (state.userdataLoaded && !userdata.group) {
    return (
      <>
        <Nav />
        <JoinGroupRouter />
      </>
    );
  }

  if (
    state.ingredientsLoading ||
    state.recipesLoading ||
    !state.userdataLoaded
  ) {
    return <StyledLoader />;
  }

  return (
    <div>
      <Nav />
      <main>
        <Route path="/" exact component={Week} />
        <Route path="/wunderlist-callback" component={Week} />
        <Route path="/admin" exact component={AdminGroup} />
        <Route path="/recipes" exact component={Recipes} />
        <Route path="/find-recipes" exact component={ListRecipesAndRedirect} />
        <Route path="/add-recipe" exact component={AddRecipe} />
        <Route path="/recipe-feedback/:feedback" exact component={Recipes} />
        <Route path="/recipes/:id" exact component={EditRecipeDetails} />
        <Route path="/ingredients/" component={Ingredients} />
        <Route path="/login/" component={Login} />
        <Route path="/settings/" component={Settings} />
      </main>
    </div>
  );
};

export default App;
