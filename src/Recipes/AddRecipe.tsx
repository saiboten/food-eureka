import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Field, Form } from "react-final-form";
import { firebase } from "../firebase/firebase";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledError } from "../components/StyledError";
import { StyledInputWrapper } from "../components/StyledInputWrapper";
import { StyledInput } from "../components/StyledInput";
import { StyledForm } from "../components/StyledForm";
import { StyledFieldSet } from "../components/StyledFieldset";
import { StyledButton } from "../components/StyledButton";

interface RecipeErrors {
  name: string | undefined;
  description: string | undefined;
}

const StyledInputLabel = styled.label`
  padding: 10px;
  display: inline-block;
`;

const onSubmit = (values: any, form: any) => {
  const db = firebase.firestore();

  db.collection("recipes").add({
    ...values
  });

  form.reset();
};

const validate = (values: any) => {
  let errors: RecipeErrors = { name: undefined, description: undefined };

  if (!values.name) {
    errors.name = "Oppskriften må ha et navn";
  }

  return errors;
};

export function AddRecipe() {
  return (
    <Form
      onSubmit={(values, form) => onSubmit(values, form)}
      validate={validate}
      render={({ handleSubmit, submitting, pristine, reset }) => (
        <React.Fragment>
          <StyledHeaderH1>Legg til oppskrift</StyledHeaderH1>
          <StyledForm
            onSubmit={(event: React.SyntheticEvent<HTMLFormElement>) => {
              const promise = handleSubmit(event);
              if (promise) {
                promise.then(reset);
              }
            }}
          >
            <StyledFieldSet>
              <Field name="name" component="input" type="text">
                {({ input, meta }: { input: any; meta: any }) => (
                  <>
                    <StyledInputLabel>Oppskrift</StyledInputLabel>

                    <StyledInputWrapper>
                      {meta.error && meta.touched && (
                        <StyledError>{meta.error}</StyledError>
                      )}
                      <StyledInput
                        autoComplete="off"
                        placeholder="Navn på oppskrift"
                        {...input}
                      />
                    </StyledInputWrapper>
                  </>
                )}
              </Field>
            </StyledFieldSet>
            <StyledFieldSet>
              <Field name="description" component="input" type="text">
                {({ input, meta }: { input: any; meta: any }) => (
                  <>
                    <StyledInputLabel>Beskrivelse</StyledInputLabel>
                    <StyledInputWrapper>
                      {meta.error && meta.touched && (
                        <StyledError>{meta.error}</StyledError>
                      )}
                      <StyledInput
                        autoComplete="off"
                        placeholder="Beskrivelse"
                        {...input}
                      />
                    </StyledInputWrapper>
                  </>
                )}
              </Field>
            </StyledFieldSet>
            <StyledButton type="submit" disabled={pristine || submitting}>
              Legg til
            </StyledButton>
          </StyledForm>
        </React.Fragment>
      )}
    />
  );
}
