import type { FlowComponent } from "solid-js";
import { useLocation } from "@solidjs/router";

const UtilitiesLayout: FlowComponent = (props) => {
  const location = useLocation();
  const isUtilitiesRoot = createMemo(() => location.pathname === "/utilities");

  return (
    <>
      <Title>lpadder - utilities</Title>

      <div class="relative min-h-screen">
        <header
          class="flex justify-start items-center px-8 w-full h-24"
        >
          <A
            href={isUtilitiesRoot() ? "/" : "/utilities"}
            class="z-50 px-4 py-2 bg-slate-900 bg-opacity-60 rounded-lg transition-colors hover:bg-opacity-80"
          >
            Go back
          </A>
        </header>

        <main class="relative p-4 h-full">
          {props.children}
        </main>
      </div>
    </>
  );
};

export default UtilitiesLayout;
