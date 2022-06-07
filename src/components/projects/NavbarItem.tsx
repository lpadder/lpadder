import type { Component } from "solid-js";
import { useNavigate } from "solid-app-router";

import DropdownButton from "@/components/DropdownButton";

import {
  currentProjectStore,
  setCurrentProjectStore
} from "@/stores/current_project";

import { deleteProject } from "@/utils/projects";

import { HiOutlineDotsVertical } from "solid-icons/hi";

const NavbarItem: Component<{
  name: string,
  slug: string,

  selected?: boolean
}> = (props) => {
  const navigate = useNavigate();

  const handleProjectUpdate = () => {
    if (currentProjectStore.slug === props.slug) return;
    console.info("[handleProjectUpdate] Switching from", currentProjectStore.slug, "to", props.slug);

    // We remove any currently opened project.
    setCurrentProjectStore({
      data: null,
      metadata: null
    });
    
    console.info("[handleProjectUpdate] Project data and metadata cleared.");

    // We update the current project slug
    // and navigate to its page to load it.
    setCurrentProjectStore({ slug: props.slug });
    navigate(props.slug);

    console.info("[handleProjectUpdate] Project slug updated and navigated to route.");
  };

  return (
    <div
      onClick={handleProjectUpdate}
      class={`
        flex flex-row items-center justify-between
        w-full px-4 py-6 cursor-pointer
        ${props.selected ? "bg-gray-600" : "bg-gray-700"}
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
              if (currentProjectStore.slug === props.slug) {
                navigate("/projects");
                
                // We remove any currently opened project.
                setCurrentProjectStore({
                  slug: null,
                  data: null,
                  metadata: null
                });
              }
            }
          }
        ]}

        buttonIcon={<HiOutlineDotsVertical size={24} />}
      /> 
    </div>
  );
};

export default NavbarItem;
