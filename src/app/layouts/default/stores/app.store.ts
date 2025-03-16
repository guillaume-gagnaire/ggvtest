import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type AppState = {
  title: string;
  page: string;
};

const initialState: AppState = {
  title: '',
  page: '',
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setMeta(title: string, page: string) {
      patchState(store, () => ({
        title: title,
        page: page,
      }));
    },
  }))
);
