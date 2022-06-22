import type { Component } from "solid-js";

import DropdownButton from "@/components/DropdownButton";
import { deleteProject } from "@/utils/projects";

import {
  currentProjectStore,
  setCurrentProjectStore
} from "@/stores/current_project";

const NavbarItem: Component<{
  name: string,
  slug: string
}> = (props) => {
  const navigate = useNavigate();
  const current_slug = () => currentProjectStore.slug;
  
  const handleProjectUpdate = () => {
    /** When the project is already selected, skip. */
    if (currentProjectStore.slug === props.slug) return;

    console.info("[PROJECT_UPDATE] Switching from", current_slug(), "to", props.slug);
    navigate(`/covers/${props.slug}`);
  };

  return (
    <div
      onClick={handleProjectUpdate}
      class={`
        flex flex-row items-center justify-between
        w-full px-4 py-6 cursor-pointer
        ${current_slug() === props.slug ? "bg-gray-600" : "bg-gray-700"}
        hover:bg-gray-800 hover:bg-opacity-40
        border-solid border-t-2 border-gray-800
      `}
    >
      <div>
        <h3 class="text-lg font-medium">{props.name}</h3>
        <span class="font-light text-md">{props.slug}</span>
      </div>
      <DropdownButton
        buttonClassName="p-2 rounded-lg transition-colors hover:bg-opacity-40 hover:bg-gray-900 cursor-pointer"
        items={[
          {
            name: "Delete",
            action: async () => {
              const response = await deleteProject(props.slug);
              if (!response.success) return;

              // If the current project was removed, we redirect
              // to root because project will be inexistant.
              // Also remove the useless components.
              if (current_slug() === props.slug) {
                navigate("/covers");
                
                // We remove any currently opened project.
                setCurrentProjectStore({
                  data: null,
                  metadata: null
                });
              }
            }
          }
        ]}

        buttonIcon={<button />}
      /> 
    </div>
  );
};

export default NavbarItem;
