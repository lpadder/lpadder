import type { Component } from "solid-js";
import { useNavigate, Outlet } from "solid-app-router";

const UtilitiesHeader: Component = () => {
  const navigate = useNavigate();

  return (
    <div class="relative min-h-screen">
      <header
        class="flex justify-start items-center px-8 w-full h-24"
      >
        <button
          onClick={() => navigate(-1)}
          class="z-50 px-4 py-2 bg-gray-900 bg-opacity-60 rounded-lg transition-colors hover:bg-opacity-80"
        >
          Go back
        </button>
      </header>
      
      <main class="relative p-4 h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default UtilitiesHeader;
