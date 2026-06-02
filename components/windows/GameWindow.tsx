"use client";

import { useState, useEffect, useRef } from "react";
import WindowFloat from "../ui/WindowFloat";

interface GameState {
  board: number[][];
  revealed: boolean[][];
  flagged: boolean[][];
  rows: number;
  cols: number;
  mines: number;
  gameOver: boolean;
  won: boolean;
  minesLeft: number;
  time: number;
  timerStarted: boolean;
}

function buildEmptyState(): GameState {
  return {
    board: [],
    revealed: [],
    flagged: [],
    rows: 9,
    cols: 9,
    mines: 10,
    gameOver: false,
    won: false,
    minesLeft: 10,
    time: 0,
    timerStarted: false,
  };
}

function initBoard(state: GameState): GameState {
  const { rows, cols, mines } = state;
  const board = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(0));
  const revealed = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));
  const flagged = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c] !== -1) {
      board[r][c] = -1;
      placed++;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr,
            nc = c + dc;
          if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            board[nr][nc] !== -1
          )
            board[nr][nc]++;
        }
    }
  }
  return { ...state, board, revealed, flagged };
}

const numColors: Record<number, string> = {
  1: "text-blue-600",
  2: "text-green-600",
  3: "text-red-600",
  4: "text-purple-700",
  5: "text-red-800",
  6: "text-cyan-600",
  7: "text-black",
  8: "text-gray-600",
};

export default function GameWindow({
  onClose,
  onMinimize,
}: {
  onClose: () => void;
  onMinimize: () => void;
}) {
  const [gs, setGs] = useState<GameState>(() => initBoard(buildEmptyState()));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gs.timerStarted && !gs.gameOver && !gs.won) {
      timerRef.current = setInterval(() => {
        setGs((prev) => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gs.timerStarted, gs.gameOver, gs.won]);

  function reset() {
    if (timerRef.current) clearInterval(timerRef.current);
    setGs(initBoard(buildEmptyState()));
  }

  function reveal(row: number, col: number, state: GameState): GameState {
    if (
      state.gameOver ||
      state.won ||
      state.revealed[row][col] ||
      state.flagged[row][col]
    )
      return state;
    const next = {
      ...state,
      timerStarted: true,
      revealed: state.revealed.map((r) => [...r]),
    };
    next.revealed[row][col] = true;

    if (next.board[row][col] === -1) {
      // Reveal all mines
      for (let r = 0; r < next.rows; r++)
        for (let c = 0; c < next.cols; c++)
          if (next.board[r][c] === -1) next.revealed[r][c] = true;
      return { ...next, gameOver: true };
    }

    if (next.board[row][col] === 0) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr,
            nc = col + dc;
          if (
            nr >= 0 &&
            nr < next.rows &&
            nc >= 0 &&
            nc < next.cols &&
            !next.revealed[nr][nc]
          )
            Object.assign(next, reveal(nr, nc, next));
        }
    }

    // Check win
    let revealedCount = 0;
    for (let r = 0; r < next.rows; r++)
      for (let c = 0; c < next.cols; c++)
        if (next.revealed[r][c] && next.board[r][c] !== -1) revealedCount++;
    if (revealedCount === next.rows * next.cols - next.mines)
      return { ...next, won: true, minesLeft: 0 };

    return next;
  }

  function handleClick(row: number, col: number) {
    setGs((prev) => reveal(row, col, prev));
  }

  function handleRightClick(e: React.MouseEvent, row: number, col: number) {
    e.preventDefault();
    setGs((prev) => {
      if (prev.gameOver || prev.won || prev.revealed[row][col]) return prev;
      const flagged = prev.flagged.map((r) => [...r]);
      flagged[row][col] = !flagged[row][col];
      return {
        ...prev,
        timerStarted: true,
        flagged,
        minesLeft: prev.minesLeft + (flagged[row][col] ? -1 : 1),
      };
    });
  }

  function cellContent(row: number, col: number) {
    if (gs.flagged[row][col]) return "🚩";
    if (!gs.revealed[row][col]) return "";
    if (gs.board[row][col] === -1) return "💣";
    if (gs.board[row][col] === 0) return "";
    return gs.board[row][col];
  }

  const face = gs.gameOver ? "😵" : gs.won ? "😎" : "🙂";

  return (
    <WindowFloat
      onclose={onClose}
      onminimize={onMinimize}
      maxWidth="350px"
      title="Minesweeper"
      contentStyle={{ background: "#c0c0c0", padding: 8 }}
    >
      <div style={{ direction: "ltr" }}>
        {/* Panel */}
        <div
          className="p-3 rounded-sm"
          style={{
            background: "#c0c0c0",
            border: "3px solid",
            borderColor: "#ffffff #808080 #808080 #ffffff",
          }}
        >
          {/* Stats row */}
          <div className="flex flex-row items-center justify-center gap-3 mb-3">
            {/* Mines left */}
            <div
              className="px-2 py-1 flex items-center justify-center"
              style={{
                background: "#000",
                border: "2px solid",
                borderColor: "#808080 #ffffff #ffffff #808080",
                minWidth: 60,
              }}
            >
              <span
                className="font-bold"
                style={{
                  color: "#ff0000",
                  fontFamily: "Courier New, monospace",
                  fontSize: 20,
                }}
              >
                {String(gs.minesLeft).padStart(3, "0")}
              </span>
            </div>
            {/* Reset */}
            <button
              onClick={reset}
              className="px-3 py-2 rounded-sm transition-all active:border-[#ffffff]"
              style={{
                background: "#c0c0c0",
                border: "3px solid",
                borderColor: "#ffffff #808080 #808080 #ffffff",
                fontSize: 28,
              }}
            >
              {face}
            </button>
            {/* Timer */}
            <div
              className="px-2 py-1 flex items-center justify-center"
              style={{
                background: "#000",
                border: "2px solid",
                borderColor: "#808080 #ffffff #ffffff #808080",
                minWidth: 60,
              }}
            >
              <span
                className="font-bold"
                style={{
                  color: "#ff0000",
                  fontFamily: "Courier New, monospace",
                  fontSize: 20,
                }}
              >
                {String(gs.time).padStart(3, "0")}
              </span>
            </div>
          </div>

          {/* Board */}
          <div
            className="p-2 rounded-sm"
            style={{
              background: "#c0c0c0",
              border: "3px solid",
              borderColor: "#808080 #ffffff #ffffff #808080",
            }}
          >
            {gs.board.map((row, ri) => (
              <div key={ri} className="flex flex-row gap-0">
                {row.map((_, ci) => (
                  <button
                    key={`${ri}-${ci}`}
                    onClick={() => handleClick(ri, ci)}
                    onContextMenu={(e) => handleRightClick(e, ri, ci)}
                    className="w-8 h-8 flex items-center justify-center font-bold"
                    style={{
                      background: gs.revealed[ri][ci] ? "#bdbdbd" : "#c0c0c0",
                      border: gs.revealed[ri][ci]
                        ? "1px solid #808080"
                        : "3px solid",
                      borderColor: gs.revealed[ri][ci]
                        ? "#808080"
                        : "#ffffff #808080 #808080 #ffffff",
                      fontSize: 16,
                    }}
                  >
                    <span className={numColors[gs.board[ri][ci]] ?? ""}>
                      {cellContent(ri, ci)}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Status */}
          {(gs.gameOver || gs.won) && (
            <div className="flex items-center justify-center mt-3">
              <span
                className="font-bold px-4 py-2 rounded"
                style={{
                  background: gs.won ? "#00aa00" : "#ff0000",
                  color: "#ffffff",
                  fontSize: 14,
                }}
              >
                {gs.won ? "🎉 You Won!" : "💥 Game Over!"}
              </span>
            </div>
          )}

          {/* Instructions */}
          <div
            className="flex flex-col items-start mt-3 pt-3"
            style={{ borderTop: "1px solid #808080" }}
          >
            <span
              className="text-gray-700 text-center w-full"
              style={{ fontSize: 11 }}
            >
              Left click to reveal • Right click to flag
            </span>
          </div>
        </div>
      </div>
    </WindowFloat>
  );
}
