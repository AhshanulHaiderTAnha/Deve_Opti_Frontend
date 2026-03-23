import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { Suspense } from "react";
import LoadingState from "./components/base/LoadingState";
import { SettingsProvider } from "./context/SettingsContext";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <SettingsProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <Suspense fallback={<LoadingState />}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </SettingsProvider>
    </I18nextProvider>
  );
}

export default App;
