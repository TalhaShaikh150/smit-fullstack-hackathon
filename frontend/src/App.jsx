import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import router from "@/router";
import { useGetMeQuery } from "@/features/auth/authApi";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const App = () => {
  const { isLoading } = useGetMeQuery();

  // Don't render until we've checked for existing session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
        toastOptions={{
          style: {
            fontSize: "14px",
          },
        }}
      />
    </>
  );
};

export default App;
