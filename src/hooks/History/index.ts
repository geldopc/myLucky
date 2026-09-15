import { type Draw, type History, loadHistory, toDraws } from "@utils/history";
import { fetchDrawsSince } from "@utils/live";
import * as React from "react";

type State = {
  history: History | null;
  draws: Draw[];
  loading: boolean;
  error: string | null;
  liveContests: number;
};

export function useHistory(): State {
  const [state, setState] = React.useState<State>({
    history: null,
    draws: [],
    loading: true,
    error: null,
    liveContests: 0,
  });

  React.useEffect(() => {
    const controller = new AbortController();

    loadHistory(controller.signal)
      .then((history) => {
        setState({ history, draws: toDraws(history), loading: false, error: null, liveContests: 0 });
        return fetchDrawsSince(history.last, controller.signal);
      })
      .then((live) => {
        if (!live) return;
        setState((current) => {
          const known = current.history;
          if (!known) return current;

          const fresh = live.draws.filter((draw) => draw.contest > known.last);
          if (fresh.length === 0) {
            if (known.nextDrawDate === live.nextDrawDate) return current;
            return { ...current, history: { ...known, nextDrawDate: live.nextDrawDate } };
          }

          const history: History = {
            ...known,
            last: fresh[fresh.length - 1].contest,
            nextDrawDate: live.nextDrawDate,
            dates: [...known.dates, ...fresh.map((draw) => draw.date)],
            draws: [...known.draws, ...fresh.map((draw) => draw.numbers)],
          };
          return { ...current, history, draws: [...current.draws, ...fresh], liveContests: fresh.length };
        });
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setState((current) =>
          current.history
            ? current
            : { history: null, draws: [], loading: false, error: error.message, liveContests: 0 }
        );
      });

    return () => controller.abort();
  }, []);

  return state;
}
