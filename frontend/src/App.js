import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";

// store
import store from "./store/Store.js";

//router
import Router from "./router/Router.js";

//reactquery
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GoogleOAuthProvider } from '@react-oauth/google';
const GOOGLE_CLIENT_ID=  process.env.REACT_APP_GOOGLEID;
const API_BASE_URL = process.env.REACT_APP_BACKENDURL;
console.log(GOOGLE_CLIENT_ID ,API_BASE_URL);
const queryClient = new QueryClient();

function App() {
  return (
    <>
     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AuthProvider>
            <Router></Router>
          </AuthProvider>
        </Provider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      
    </GoogleOAuthProvider>
    </>
  );
}

export default App;
