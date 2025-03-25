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
    padding: 10px;
    background-color: transparent;
    cursor: pointer;
  }
  .sidebar .item.active {
    background-color: #aaa;
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
  textarea {
    width: 100%;
    height: 100px;
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
  button {
    font-size: 15px;
    padding: 7px 20px;
  }
  select {
    width: 250px;
  }
  .separator {
    border: none;
    height: 1px;
    background-color: #ccc;
    margin: 16px 0;
    opacity: 0.5;
  }
`;
