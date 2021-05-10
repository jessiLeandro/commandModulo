import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import multi from "redux-multi";
import promise from "redux-promise";
import { persistReducer, persistStore } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";

import storage from "redux-persist/lib/storage";

import reducers from "./reducers";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = applyMiddleware(thunk, multi, promise)(createStore)(
  persistedReducer,
  composeWithDevTools()
);

const persistor = persistStore(store);

export { store, persistor };
