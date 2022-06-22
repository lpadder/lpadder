import type { Component } from "solid-js";

const UtilitiesLayout: Component = () => {
  const location = useLocation();
  const isUtilitiesRoot = createMemo(() => location.pathname === "/utilities");

  return (
    <div class="relative min-h-screen">
      <header
        class="flex justify-start items-center px-8 w-full h-24"
      >
        <Link
          href={isUtilitiesRoot() ? "/" : "/utilities"}
          class="z-50 px-4 py-2 bg-gray-900 bg-opacity-60 rounded-lg transition-colors hover:bg-opacity-80"
        >
          Go back
        </Link>
      </header>
      
      <main class="relative p-4 h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default UtilitiesLayout;
