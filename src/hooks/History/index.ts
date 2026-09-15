import { type Draw, type History, loadHistory, toDraws } from "@utils/history";
import * as React from "react";

type State = {
  history: History | null;
  draws: Draw[];
  loading: boolean;
  error: string | null;
};

export function useHistory(): State {
  const [state, setState] = React.useState<State>({ history: null, draws: [], loading: true, error: null });

  React.useEffect(() => {
    const controller = new AbortController();
    loadHistory(controller.signal)
      .then((history) => setState({ history, draws: toDraws(history), loading: false, error: null }))
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setState({ history: null, draws: [], loading: false, error: error.message });
      });
    return () => controller.abort();
  }, []);

  return state;
}
