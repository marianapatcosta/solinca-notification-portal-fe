import { sha256 } from "js-sha256";
import { validate } from "./validators";

export const encryptPassword = (password) => sha256.create().update(password).hex();

export const handleInputTouch = (setter) =>
setter((prevState) => ({ ...prevState, isTouched: true }));

export const handleInputChange = (value, validators, setter) =>
setter((prevState) => ({
  ...prevState,
  value,
  isValid: validate(value, validators),
}));

export const toggleIsPasswordVisible = (setter) =>
setter((prevPassword) => ({
  ...prevPassword,
  isVisible: !prevPassword.isVisible,
}));
