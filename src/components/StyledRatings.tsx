import React from "react";
import { StyledRadio, SmallStyledRadioLabel } from "./StyledRadio";

export const createRatings = () =>
  new Array(11).fill("").map((el: string, index: number) => {
    const rating = index + 0;
    return (
      <React.Fragment key={rating}>
        <StyledRadio
          id={`rating${rating}`}
          name="rating"
          component="input"
          type="radio"
          value={rating}
          parse={(value: any) => parseInt(value)}
        />
        <SmallStyledRadioLabel htmlFor={`rating${rating}`}>
          {rating}
        </SmallStyledRadioLabel>
      </React.Fragment>
    );
  });
