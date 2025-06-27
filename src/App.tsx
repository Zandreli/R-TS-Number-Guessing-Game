import { useReducer } from "react";
import type { ChangeEvent } from "react";
import "./App.css";

function generateSecretNumber(): number {
  return Math.trunc(Math.random() * 100);
}

type State = {
  newGameButtonDisabled: boolean;
  guessButtonDisabled: boolean;
  guessInputDisabled: boolean;
  inputReadOnly: boolean;
  secretNumber: number;
  playerGuess: string;
  feedback: string;
  numGuesses: number;
};

type Action =
  | { type: "NEW_GAME" }
  | { type: "SET_PLAYER_GUESS"; payload: string }
  | { type: "SUBMIT_GUESS" }
  | { type: "GAME_OVER" }
  | { type: "FEEDBACK"; payload: string };

const initialState: State = {
  newGameButtonDisabled: false,
  guessButtonDisabled: true,
  guessInputDisabled: true,
  inputReadOnly: false,
  secretNumber: generateSecretNumber(),
  playerGuess: "",
  feedback: "",
  numGuesses: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NEW_GAME":
      return {
        ...initialState,
        newGameButtonDisabled: true,
        guessInputDisabled: false,
        guessButtonDisabled: false,
        inputReadOnly: false,
        secretNumber: generateSecretNumber(),
        feedback: "Guess a number between 0 and 100",
        numGuesses: 10,
        playerGuess: "",
      };
    case "SET_PLAYER_GUESS":
      return { ...state, playerGuess: action.payload };
    case "FEEDBACK":
      return { ...state, feedback: action.payload };
    case "SUBMIT_GUESS": {
      const guess = parseInt(state.playerGuess, 10);
      if (isNaN(guess) || guess < 0 || guess > 100) {
        return {
          ...state,
          feedback: "Please enter a valid number between 0 and 100.",
        };
      }
      if (guess === state.secretNumber) {
        const accuracy = state.numGuesses * 10;
        return {
          ...state,
          feedback: `Congratulations! You've guessed the number! The secret number was ${state.secretNumber}. You guessed it with ${accuracy}% accuracy`,
          guessButtonDisabled: true,
          guessInputDisabled: true,
          inputReadOnly: true,
          newGameButtonDisabled: false,
        };
      }
      const updatedNumGuesses = state.numGuesses - 1;
      if (updatedNumGuesses <= 0) {
        return {
          ...state,
          numGuesses: 0,
          feedback: `Game over! You've run out of guesses. The secret number was ${state.secretNumber}.`,
          guessButtonDisabled: true,
          guessInputDisabled: true,
          inputReadOnly: true,
          newGameButtonDisabled: false,
        };
      }
      return {
        ...state,
        feedback:
          guess < state.secretNumber!
            ? "Your Guess is Too low! Try again."
            : "Your Guess is Too high! Try again.",
        numGuesses: updatedNumGuesses,
        playerGuess: "",
      };
    }
    default:
      return state;
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleNewGame = () => {
    dispatch({ type: "NEW_GAME" });
  };
  const handleGuessChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_PLAYER_GUESS", payload: e.target.value });
  };
  const handleGuessSubmit = () => {
    dispatch({ type: "SUBMIT_GUESS" });
  };

  return (
    <div className="app-container">
      <button
        className="new-game-button"
        onClick={handleNewGame}
        disabled={state.newGameButtonDisabled}
      >
        NEW GAME
      </button>

      <h1>GUESS A NUMBER BETWEEN 0 AND 100</h1>
      <p>{state.numGuesses} GUESSES REMAINING</p>
      <p>{state.feedback}</p>

      <label htmlFor="guess-input" style={{ display: "none" }}>
        Enter your guess
      </label>
      <input
        id="guess-input"
        type="number"
        placeholder="0 - 100"
        title="Enter your guess ranging from 0 to 100"
        value={state.playerGuess}
        onChange={handleGuessChange}
        disabled={state.guessInputDisabled}
        className="guess-input"
      />

      <div>
        <button
          onClick={handleGuessSubmit}
          disabled={state.guessButtonDisabled}
          className="guess-button"
        >
          GUESS
        </button>
      </div>
    </div>
  );
}

export default App;
