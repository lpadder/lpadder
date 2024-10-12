import type { Component } from "solid-js";

const ProjectsHome: Component = () => {
  return (
    <>
      <Title>lpadder - projects: none</Title>

      <main class="flex flex-col justify-center items-center w-full h-full">
        <div class="flex flex-col gap-4 justify-center items-center max-w-md text-sm sm:text-base md:w-96">
          <h2 class="text-2xl font-medium text-slate-200">
            No project selected !
          </h2>

          <p class="p-4 mx-4 text-center text-slate-400 bg-slate-900 bg-opacity-60 rounded-lg">
            Take a look at the menu and select, create or import a project; then play or edit the project as you want !
          </p>
        </div>
      </main>
    </>
  );
};

export default ProjectsHome;
