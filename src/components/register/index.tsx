import { fecthCreateUser } from "lib/api";
import { checkEmail } from "hooks";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "ui/buttons";
import { InputPasswordText, InputText } from "ui/text-field";
import ClipLoader from "react-spinners/ClipLoader";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

export function Register() {
  const navigate = useNavigate();
  const { emailDataState } = checkEmail();
  useEffect(() => {
    if (emailDataState.length == 0) {
      navigate("/login");
    }
  }, []);

  const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    const emailInput = e.target.email.value;
    const userName = e.target.fullname.value;
    const password = e.target.password.value;
    const passCheck = e.target[`pass-check`].value;
    let fieldsOk = true;

    if (userName == "") {
      toast.error('El campo "Nombre" es obligatorio');
      fieldsOk = false;
    }
    if (password != passCheck || password == "") {
      Swal.fire({
        icon: "error",
        text: "Las contraseñas no coinciden o los campos estan vacios, vuelva a intentarlo...",
      });
      fieldsOk = false;
    }
    if (fieldsOk) {
      setLoading(true);
      const respuesta = await fecthCreateUser(userName, emailInput, password);
      if (respuesta) {
        Swal.fire({
          icon: "success",
          text: "Se creo el usuario correctamente!",
        });
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          text: "Ocurrió un error, vuelva a intentarlo...",
        });
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "70px" }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <InputText
          value=""
          name="fullname"
          label="Nombre"
          placeholder="Ingrese su nombre"
        />
        <InputText
          value={emailDataState}
          name="email"
          label="Email"
          placeholder="Ingrese su email"
          readyonly={true}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <InputPasswordText name="password" label="Contraseña" />
        <InputPasswordText name="pass-check" label="Repetir contraseña" />
      </div>
      {loading ? (
        <span style={{ display: "flex", justifyContent: "center" }}>
          <ClipLoader color="#FF9DF5" loading size={50} />
        </span>
      ) : (
        <Button color="pink" text="Guardar" />
      )}
    </form>
  );
}
