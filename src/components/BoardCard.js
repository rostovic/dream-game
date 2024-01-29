import { useContext, useState } from "react";
import classes from "./BoardCard.module.css";
import { UserContext } from "../auth/auth";
import { joinAsSecondPlayer } from "../api/api";
import { useNavigate } from "react-router-dom";

const BoardCard = ({ game }) => {
  const userCtx = useContext(UserContext);
  const [joinGame, setJoinGame] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const myID = userCtx.userData.id;
  const token = userCtx.userData.token;
  let gameStatus;

  const navigate = useNavigate();

  switch (game.status) {
    case "finished":
      gameStatus = (
        <span style={{ color: "grey", fontWeight: "700" }}>Finished</span>
      );
      break;
    case "progress":
      gameStatus = (
        <span style={{ color: "red", fontWeight: "700" }}>In progress</span>
      );
      break;
    case "open":
      gameStatus = (
        <span style={{ color: "green", fontWeight: "700" }}>Open</span>
      );
      break;
    default:
      gameStatus = (
        <span style={{ color: "red", fontWeight: "700" }}>In progress</span>
      );
  }

  const playerSymbol = (id) => {
    if (id === game.first_player.id) {
      return "X";
    }
    return "O";
  };

  const mouseEventHandler = (event) => {
    if (game.status === "finished") {
      return;
    }
    if (event === "leave") {
      setJoinGame(null);
      return;
    }
    if (
      game.status === "open" &&
      game.first_player.id === myID &&
      game.second_player === null
    ) {
      return;
    }
    if (
      game.status === "progress" &&
      (game.first_player.id === myID || game.second_player.id === myID)
    ) {
      setJoinGame("Continue");
      return;
    }

    if (game.status !== "open") {
      return;
    }
    if (event === "enter") {
      setJoinGame("Join game");
      return;
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
          <div className={borderStyle} key={cellIndex}>
            <span style={{ fontSize: 36 }}>
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

  const gameWinner = () => {
    let text;
    if (game.winner === null && game.status === "finished") {
      text = "Draw";
    }

    if (game.winner !== null) {
      text = `Winner: ${game.winner.username}`;
    }

    return <span style={{ fontWeight: "bold" }}>{text}</span>;
  };

  const joinGameHandler = async () => {
    setIsJoining(true);
    if (joinGame === "Join game") {
      const response = await joinAsSecondPlayer(token, game.id);
      if (response.status === "success") {
        navigate(`/games/${game.id}`);
      }
      setIsJoining(false);
      return;
    }
    setIsJoining(false);
  };

  const continueGameHandler = () => {
    navigate(`/games/${game.id}`);
  };

  const renderIsJoining = () => {
    if (isJoining) {
      return (
        <div className={classes.loaderContainer}>
          <div className={classes.loader} />
        </div>
      );
    }
    return null;
  };

  const renderJoinGameButton = () => {
    if (game.status === "open" && joinGame !== null && !isJoining) {
      return (
        <div className={classes.joinGameDiv}>
          <button className={classes.joinButton} onClick={joinGameHandler}>
            {joinGame}
          </button>
        </div>
      );
    }
    if (game.status === "progress" && joinGame !== null && !isJoining) {
      return (
        <div className={classes.joinGameDiv}>
          <button className={classes.joinButton} onClick={continueGameHandler}>
            {joinGame}
          </button>
        </div>
      );
    }
  };

  const renderPlayerText = (player) => {
    if (player === "1") {
      return (
        <>
          <span>Player 1</span>
          <span>{game.first_player.username}</span>
        </>
      );
    }
    return (
      <>
        <span>Player 2</span>
        <span>
          {game?.second_player !== null ? game.second_player.username : "N/A"}
        </span>
      </>
    );
  };

  // main return

  return (
    <div
      className={classes.boardCard}
      onMouseEnter={() => mouseEventHandler("enter")}
      onMouseLeave={() => mouseEventHandler("leave")}
    >
      {renderIsJoining()}
      {renderJoinGameButton()}
      <div className={classes.statusTextDiv}>{gameStatus}</div>
      <div className={classes.bordersDiv}>{renderBorders()}</div>
      <div className={classes.informationGameDiv}>
        <div className={classes.gameWinnerDiv}>{gameWinner()}</div>
        <div className={classes.playerInformationDiv}>
          <div className={classes.singlePlayerDiv}>{renderPlayerText("1")}</div>
          <div className={classes.singlePlayerDiv}>{renderPlayerText("2")}</div>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
