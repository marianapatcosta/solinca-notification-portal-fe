import { sha256 } from "js-sha256";
import { validate } from "./validators";
import { KEYBOARD_CODES } from "../constants";
const { SPACE_KEY, ENTER_KEY } = KEYBOARD_CODES;

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

export const isEventValid = (event) =>
  event.type === "click" ||
  event.which === SPACE_KEY ||
  event.which === ENTER_KEY;
