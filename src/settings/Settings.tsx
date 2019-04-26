import React, { useContext, useState } from "react";
import { StyledWrapper } from "../components/StyledWrapper";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import {
  StyledActionButtonForText,
  StyledSecondaryActionButtonWithMargins
} from "../components/StyledActionButton";
import { firebase } from "../firebase/firebase";
import { UserContext } from "../context/UserContext";
import { Redirect } from "react-router";
import { StyledLogOut } from "../components/StyledSvgIcons";
import styled from "styled-components";

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const LogOut = (setLeave: any) => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
    })
    .catch(function(error) {
      // An error happened.
    });

  setLeave(true);
};

export const Settings = () => {
  const user = useContext(UserContext).user;
  const [leave, setLeave] = useState(false);

  const leaveGroup = () => {
    const db = firebase
      .firestore()
      .collection("userdata")
      .doc(user.uid)
      .delete();
    setLeave(true);
  };

  if (leave) {
    return <Redirect to="/" push />;
  }

  return (
    <StyledWrapper backgroundColor="white">
      <StyledHeaderH1>Innstillinger</StyledHeaderH1>
      <StyledButtonContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <span>Logg ut</span>
          <StyledSecondaryActionButtonWithMargins
            onClick={() => {
              LogOut(setLeave);
            }}
          >
            <StyledLogOut />
          </StyledSecondaryActionButtonWithMargins>{" "}
        </div>

        <StyledActionButtonForText onClick={leaveGroup}>
          Forlat gruppe
        </StyledActionButtonForText>
      </StyledButtonContainer>
    </StyledWrapper>
  );
};
