import {css} from 'lit';

export const templatesStyles = css`
  body {
    font-family: sans-serif;
    margin: 0;
    padding: 0;
  }

  .container {
    display: flex;
    height: 100vh;
  }

  .sidebar {
    width: 30%;
    background-color: #ddd;
    padding: 10px;
    box-sizing: border-box;
  }

  .sidebar .item {
    font-family: Helvetica, Arial;
    padding: 10px;
    background-color: transparent;
    cursor: pointer;
  }

  .sidebar .item.active {
    background-color: #aaaaaa;
  }

  .details {
    width: 70%;
    padding: 20px;
    box-sizing: border-box;
  }

  .section {
    margin-bottom: 20px;
  }

  .section label {
    font-family: Helvetica, Arial;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

  .recipients div {
    margin-bottom: 5px;
  }

  .recipients input[type='email'] {
    margin-right: 5px;
  }

  .rules {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
  }

  .rules select,
  .rules input {
    padding: 5px;
  }

  .rules-sub-label {
    margin-top: 10px;
    display: block;
    font-size: 0.9em;
  }

  label {
    font-size: 1.2em;
  }

  .separator {
    border: none;
    height: 1px;
    margin: 16px 0;
    opacity: 0.5;
  }

  .main-separator {
    height: 3px;
    background-color: #6b6868;
  }

  .sub-separator {
    height: 2px;
    background-color: #b7b1b1;
  }

  .button {
    font-weight: bold;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    color: #ffffff;
  }

  .button-small {
    font-weight: bold;
    border: none;
    padding: 5px 13px;
    cursor: pointer;
    color: #ffffff;
  }

  .positive-button {
    background-color: #4a90e2;
  }

  .positive-button:hover {
    background-color: #357abd;
  }

  .danger-button {
    background-color: #e27474;
  }

  .danger-button:hover {
    background-color: #d9534f;
  }

  .warn-button {
    background-color: #f5a623;
  }

  .warn-button:hover {
    background-color: #d48806;
  }

  select {
    width: 250px;
  }

  textarea {
    width: 100%;
    height: 100px;
  }

  select,
  input[type='number'],
  input[type='text'],
  textarea {
    font-family: Helvetica, Arial;
    padding: 6px 10px;
    font-size: 14px;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-sizing: border-box;
  }

  select:hover,
  input[type='number']:hover,
  input[type='text']:hover,
  textarea:hover {
    border-color: #999;
  }

  select:focus,
  input[type='number']:focus,
  input[type='text']:focus,
  textarea:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 4px rgba(74, 144, 226, 0.5);
  }
`;
