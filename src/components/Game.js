import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../auth/auth";
import { fetchGame, makeMove } from "../api/api";
import classes from "./Game.module.css";

const Game = () => {
  const [game, setGame] = useState(null);
  const [error, setError] = useState(false);
  const { id } = useParams();
  const userCtx = useContext(UserContext);
  const token = userCtx.userData.token;
  const navigate = useNavigate();

  const fetchGameData = useCallback(async () => {
    const response = await fetchGame(token, id);
    if (response.status === "success") {
      setGame(response.data);
      return;
    } else {
      navigate("/games");
    }
  }, [token, id, navigate, setGame]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchGameData();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchGameData]);

  const playerSymbol = (id) => {
    if (id === game.first_player.id) {
      return "X";
    }
    return "O";
  };

  const cellClickHandler = async (rowIndex, columnIndex) => {
    const move = { row: rowIndex, col: columnIndex };
    const response = await makeMove(token, id, move);
    if (response.status === "success") {
      fetchGameData();
    }
    if (response.status === "error") {
      setError(true);
    }
  };

  const getBorderStyle = (rowIndex, cellIndex) => {
    let borderStyle;
    if (rowIndex === 2) {
      switch (cellIndex) {
        case 0:
          borderStyle = classes.borderLowerLeft;
          break;
        case 1:
          borderStyle = classes.borderLowerMiddle;
          break;
        case 2:
          borderStyle = classes.borderLowerRight;
          break;
      }
    } else {
      switch (cellIndex) {
        case 0:
          borderStyle = classes.borderLeft;
          break;
        case 1:
          borderStyle = classes.borderMiddle;
          break;
        case 2:
          borderStyle = classes.borderRight;
          break;
      }
    }
    return borderStyle;
  };

  const renderBorders = () => {
    const borderRows = [];
    for (let rowIndex = 0; rowIndex < game.board.length; rowIndex++) {
      const cells = [];
      for (
        let cellIndex = 0;
        cellIndex < game.board[rowIndex].length;
        cellIndex++
      ) {
        const cell = game.board[rowIndex][cellIndex];
        const borderStyle = getBorderStyle(rowIndex, cellIndex);
        cells.push(
          <div
            className={`${borderStyle} ${cell ? "" : classes.cellHovered}`}
            key={cellIndex}
            onClick={() =>
              cell ? null : cellClickHandler(rowIndex, cellIndex)
            }
          >
            <span style={{ fontSize: 58 }}>
              {cell === null ? null : playerSymbol(cell)}
            </span>
          </div>
        );
      }
      borderRows.push(
        <div style={{ display: "flex" }} key={rowIndex}>
          {cells}
        </div>
      );
    }
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {borderRows}
      </div>
    );
  };

  const erorrModal = () => {
    if (!error) {
      return null;
    }
    return (
      <div className={classes.errorDiv}>
        <div className={classes.innerErrorDiv}>
          <span className={classes.boldText}>It is not your turn to play!</span>
          <button
            className={classes.errorButton}
            onClick={() => setError(false)}
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  if (!game) {
    return (
      <div className={classes.loaderContainer}>
        <div className={classes.loader} />
      </div>
    );
  }

  //main return

  return (
    <div className={classes.mainDiv}>
      {erorrModal()}
      <div className={classes.playersGameDiv}>
        <div className={classes.playerOneDiv}>
          <span className={classes.boldText}>Player 1</span>
          <span className={classes.boldText}>{game.first_player.username}</span>
        </div>
        <div className={classes.gameDiv}>{renderBorders()}</div>
        <div className={classes.playerTwoDiv}>
          <span className={classes.boldText}>Player 1</span>
          <span className={classes.boldText}>
            {game.second_player.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Game;
