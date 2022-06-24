import type { Component } from "solid-js";

import DropdownButton from "@/components/DropdownButton";
import { deleteProject } from "@/utils/covers";

import { currentProjectStore } from "@/stores/current_cover";

const NavbarItem: Component<{
  name: string,
  slug: string
}> = (props) => {
  const navigate = useNavigate();
  const current_slug = () => currentProjectStore.slug;
  
  /** Reference of the main div. */
  let navitem_ref: HTMLDivElement | undefined;
  
  const handleProjectUpdate = (evt: Event) => {
    /** Prevent the project update when clicking on the dropdown button. */
    if (evt.target !== navitem_ref) return;

    /** When the project is already selected, skip. */
    if (currentProjectStore.slug === props.slug) return;

    navigate(`/projects/${props.slug}`);
  };

  return (
    <div
      ref={navitem_ref}
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
        buttonIcon={<IconMdiDotsVertical  />}
        buttonClassName="text-lg p-2 rounded-lg transition-colors hover:bg-opacity-40 hover:bg-gray-900 cursor-pointer"
        
        items={[[
          {
            name: "Delete",
            action: async () => {
              const response = await deleteProject(props.slug);
              if (!response.success) return;

              /**
               * When the current project is removed, we
               * redirect to root to prevent unexistant project.
               */
              if (current_slug() === props.slug) {
                navigate("/projects");
              }
            }
          }
        ]]}
      /> 
    </div>
  );
};

export default NavbarItem;
