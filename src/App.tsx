import AppRoutes from "@/routes/AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { App as CapApp } from "@capacitor/app";

const App = () => {
  const queryClient = new QueryClient();

  // For double-back-to-exit on home page
  const lastBackPress = useRef(0);

  useEffect(() => {
    const backHandler = CapApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        // Navigate to previous page
        window.history.back();
        return;
      }

      // When on root ("/") — prevent auto exit
      const now = Date.now();

      if (now - lastBackPress.current < 1500) {
        CapApp.exitApp(); // Exit on second press
      } else {
        lastBackPress.current = now;
        // Replace this with a better toast if you want
        alert("Press back again to exit");
      }
    });

    return () => backHandler.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
};

export default App;
