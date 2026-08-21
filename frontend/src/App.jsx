import { Routes, Route } from "react-router"
import ChatPage from "./pages/ChatPage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import { useAuthStore } from "./store/useAuthStore"

function App() {
  const { authUser, isLoading, login } = useAuthStore();

  return (
<div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* Decorators - added pointer-events-none so clicks pass through */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_#6366f1_0%,_#8b5cf6_100%)] opacity-20 pointer-events-none" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px] pointer-events-none" />

      {/* Adding relative z-10 is a good safety measure to ensure your interactive content stays on top */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <button onClick={login} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">
          login
        </button>

        <Routes>
          <Route path="/" element={<ChatPage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} /> 
        </Routes>
      </div>
    </div>
  )
}

export default App
