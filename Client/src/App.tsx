import AppRouter from './AppRouter'
import { Toaster } from "sonner";

function App() {

  return (
     <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-softAqua)",
            color: "white",
            fontSize: "16px",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          },
        }}
      />
      <AppRouter />
    </>
  )
}

export default App
