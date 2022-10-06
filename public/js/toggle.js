// Making the toggle button work
const toggle = document.getElementById(`toggle`);
const body = document.querySelector(`body`);
const urlTxt = document.querySelector(`.upper-body-txt`);
const urlInput =  document.getElementById(`urlInput`)
const indicator = document.querySelector(`.indicator`)
const toggleMode = function () {
  toggle.classList.toggle(`active`);
  body.classList.toggle(`active`);
  urlTxt.classList.toggle(`active`);
  urlInput.classList.toggle(`active`);
  indicator.classList.toggle(`active`);
};
