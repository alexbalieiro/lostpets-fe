import { checkEmail, loadingButton } from "hooks";
import { fetchAuthToken } from "lib/api";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "ui/buttons";
import { InputPasswordText } from "ui/text-field";
import { LinkText } from "ui/texts";

export function Password() {
  const { emailDataState } = checkEmail();
  const navigate = useNavigate();
  const email = emailDataState[`email`];
  const { setLoadButton } = loadingButton();
  async function handleSubmit(e) {
    e.preventDefault();
    if (emailDataState.length == 0) {
      navigate("/login");
    } else {
      const { token } = await fetchAuthToken(email, e.target.password.value);
      if (!token) {
        alert("Contraseña incorrecta! Vuelva a intentarlo");
        setLoadButton(false);
      } else {
        sessionStorage.setItem("token", token);
        navigate("/my-pets");
      }
    }
  }
  function handleForgotPassword() {
    navigate("/forgot-password");
  }
  return (
    <form onSubmit={handleSubmit}>
      <InputPasswordText name="password" label="Contraseña" />
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <LinkText text="olvidé mi contraseña" onClick={handleForgotPassword} />
      </div>
      <Button color="pink" text="Ingresar" />
    </form>
  );
}
