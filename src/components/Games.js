import { useContext, useEffect, useState } from "react";
import classes from "./Games.module.css";
import { UserContext } from "../auth/auth";
import { createNewGame, fetchGames } from "../api/api";
import Board from "./BoardCard";

const Games = () => {
  const userCtx = useContext(UserContext);
  const { token } = userCtx.userData;
  const [games, setGames] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatingNewGame, setIsCreatingNewGame] = useState(false);
  const itemsPerPage = 3;

  useEffect(() => {
    const getGames = async () => {
      const response = await fetchGames(token);
      setGames(response.results);
    };
    getGames();
  }, [token]);

  const createNewGameHandler = async () => {
    if (isCreatingNewGame) {
      return;
    }
    setIsCreatingNewGame(true);
    await createNewGame(token);
    const response = await fetchGames(token);
    setGames(response.results);
    setTimeout(() => {
      setIsCreatingNewGame(false);
    }, 250);
  };
  if (games === null) {
    return (
      <div className={classes.loaderContainer}>
        <div className={classes.loader} />
      </div>
    );
  }

  const previousPageHandler = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const goToPageHandler = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    return (
      <>
        {games.length / itemsPerPage < currentPage ? (
          <div
            className={classes.paginateDiv}
            onClick={() => goToPageHandler(currentPage - 2)}
          >
            {currentPage - 2}
          </div>
        ) : null}
        {currentPage - 1 >= 1 ? (
          <div className={classes.paginateDiv} onClick={previousPageHandler}>
            {currentPage - 1}
          </div>
        ) : null}
        <div className={classes.paginateActiveDiv}>{currentPage}</div>
        {games.length / itemsPerPage > currentPage ? (
          <div
            className={classes.paginateDiv}
            onClick={() => goToPageHandler(currentPage + 1)}
          >
            {currentPage + 1}
          </div>
        ) : null}
        {currentPage === 1 ? (
          <div
            className={classes.paginateDiv}
            onClick={() => goToPageHandler(currentPage + 2)}
          >
            {currentPage + 2}
          </div>
        ) : null}
      </>
    );
  };

  const renderCreateGameButton = () => {
    return (
      <div className={classes.createGameButtonDiv}>
        <button
          className={classes.createGameButton}
          style={{ position: "relative" }}
          onClick={createNewGameHandler}
        >
          {isCreatingNewGame ? (
            <div className={classes.loaderContainer_2}>
              <div className={classes.loader_2} />
            </div>
          ) : (
            <span>Create new game</span>
          )}
        </button>
      </div>
    );
  };

  const renderGames = () => {
    return (
      <div className={classes.gamesInnerDiv}>
        {games
          .slice((currentPage - 1) * 3, itemsPerPage * currentPage)
          .map((game) => (
            <Board game={game} key={game.id} />
          ))}
      </div>
    );
  };

  return (
    <div className={classes.mainDiv}>
      {renderCreateGameButton()}
      <div className={classes.gamesDiv}>
        {renderGames()}
        <div className={classes.paginationDiv}>{renderPagination()}</div>
      </div>
    </div>
  );
};

export default Games;
