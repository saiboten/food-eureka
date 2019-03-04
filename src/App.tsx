import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Ingredients } from "./ingredients/Ingredients";
import { createGlobalStyle } from "styled-components";
import { Recipes } from "./recipes/Recipes";
import { RecipeContext, RecipeContextState } from "./context/RecipeContext";
import { EditRecipeDetails } from "./recipes/EditRecipeDetail";
import {
  IngredientsContext,
  IngredientsContextState
} from "./context/IngredientsContext";
import {
  primaryColor,
  minBreakPoint,
  secondaryColor
} from "./components/Constants";
import { Week } from "./menu/Week";
import { firebase } from "./firebase/firebase";
import { StyledLoader } from "./components/StyledLoader";
import { Login } from "./login/Login";
import { StyledSecondaryActionButton } from "./components/StyledActionButton";
import { UserContext, UserContextState, User } from "./context/UserContext";

const GlobalStyle = createGlobalStyle`
  *,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
}

html {
    // This defines what 1 rem is
    font-size: 62.5%; // 1 rem == 10px
    background-color: ${secondaryColor};
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

const StyledUl = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: flex-end;
  padding: 5px 0;
  background-color: ${primaryColor};
  align-items: center;
  font-size: 20px;

  @media screen and (max-width: ${minBreakPoint}px) {
    flex-direction: column;
  }
`;

const StyledLeftItemLi = styled.li`
  margin-right: auto;

  @media screen and (max-width: ${minBreakPoint}px) {
    margin-right: 0;
  }
`;

const StyledLi = styled.li`
  margin-right: 5px;
  padding: 20px 0;
  border: 2px solid transparent;

  @media screen and (max-width: ${minBreakPoint}px) {
    padding: 5px 0;
  }

  &:hover {
    border: 2px solid grey;
  }
`;

const StyledLink = styled(Link)`
  &:visited,
  &:link {
    color: #f3f3f3;
    text-decoration: none;
  }
  padding: 10px;
`;

const LogOut = (setLoggedIn: (val: boolean) => void) => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
    })
    .catch(function(error) {
      // An error happened.
    });
  setLoggedIn(false);
};

const App = () => {
  return (
    <Router>
      <>
        <GlobalStyle />
        <AppRouter />
      </>
    </Router>
  );
};

const AppRouter = () => {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInStateClarified, setLoggedInStateClarified] = useState(false);
  const [user, setUser]: [User, any] = useState({
    displayName: "",
    email: "",
    uid: ""
  });

  const userContextValue: UserContextState = {
    user,
    setUser
  };

  const recipesContextValue: RecipeContextState = {
    recipes,
    setRecipes
  };

  const ingredientsContextValue: IngredientsContextState = {
    ingredients,
    setIngredients
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user: any) => {
      setLoggedInStateClarified(true);
      if (user) {
        setUser(user);
        setLoggedIn(true);
        const db = firebase.firestore();
        db.collection("recipes").onSnapshot(querySnapshot => {
          recipesContextValue.setRecipes(
            querySnapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data()
            }))
          );
        });

        db.collection("ingredients").onSnapshot(querySnapshot => {
          ingredientsContextValue.setIngredients(
            querySnapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data()
            }))
          );
        });
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  if (!loggedInStateClarified) {
    return <StyledLoader />;
  }

  if (!loggedIn) {
    return <Login />;
  }

  return (
    <div>
      <RecipeContext.Provider value={recipesContextValue}>
        <IngredientsContext.Provider value={ingredientsContextValue}>
          <UserContext.Provider value={userContextValue}>
            <nav>
              <StyledUl>
                <StyledLeftItemLi>
                  <StyledLink to="/">Food-Eureka!</StyledLink>
                </StyledLeftItemLi>
                <StyledLi>
                  <StyledLink to="/recipes">Oppskrifter</StyledLink>
                </StyledLi>
                <StyledLi>
                  <StyledLink to="/ingredients/">Ingredienser</StyledLink>
                </StyledLi>
                <StyledLi>
                  <StyledLink to="/">Ukesmeny</StyledLink>
                </StyledLi>
                <StyledLi>
                  <StyledSecondaryActionButton
                    onClick={() => LogOut(setLoggedIn)}
                  >
                    Logg ut
                  </StyledSecondaryActionButton>
                </StyledLi>
              </StyledUl>
            </nav>
            <main>
              <Route path="/" exact component={Week} />
              <Route path="/recipes" exact component={Recipes} />
              <Route
                path="/recipe-feedback/:feedback"
                exact
                component={Recipes}
              />
              <Route path="/recipes/:id" exact component={EditRecipeDetails} />
              <Route path="/ingredients/" component={Ingredients} />
              <Route path="/login/" component={Login} />
            </main>
          </UserContext.Provider>
        </IngredientsContext.Provider>
      </RecipeContext.Provider>
    </div>
  );
};

export default App;
