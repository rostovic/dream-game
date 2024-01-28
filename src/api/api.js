const BACKEND_URL = "https://tictactoe.aboutdream.io";

export const createNewAccount = async (username, password) => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    const response = await fetch(`${BACKEND_URL}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log("Request failed with status:", response.status);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return "Unable to create an account! Try again later!";
  }
};

export const loginUser = async (username, password) => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    const response = await fetch(`${BACKEND_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return "error";
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return "Unable to create an account! Try again later!";
  }
};

export const fetchGames = async (token) => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    const response = await fetch(`${BACKEND_URL}/games/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return "error";
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return "Unable to fetch games! Try again later!";
  }
};

export const logoutUser = async (token) => {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    const response = await fetch(`${BACKEND_URL}/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw Error(response.statusText);
    }
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const createNewGame = async (token) => {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    const response = await fetch(`${BACKEND_URL}/games/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const joinAsSecondPlayer = async (token, gameID) => {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    const response = await fetch(`${BACKEND_URL}/games/${gameID}/join/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) {
      return { status: "error", message: response.statusText };
    }
    return { status: "success" };
  } catch (error) {
    return { status: "error" };
  }
};

export const fetchGame = async (token, gameID) => {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    const response = await fetch(`${BACKEND_URL}/games/${gameID}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) {
      return { status: "error", message: response.statusText };
    }
    const data = await response.json();
    return { status: "success", data };
  } catch (error) {
    return { status: "error" };
  }
};

export const makeMove = async (token, gameID, move) => {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    const response = await fetch(`${BACKEND_URL}/games/${gameID}/move/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      signal,
      body: JSON.stringify(move),
    });

    clearTimeout(timeoutId);
    console.log(response);
    if (!response.ok) {
      return { status: "error", message: response.statusText };
    }
    return { status: "success" };
  } catch (error) {
    return { status: "error" };
  }
};
