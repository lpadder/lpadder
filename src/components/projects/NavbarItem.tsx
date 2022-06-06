import type { Component } from "solid-js";

import { mergeProps } from "solid-js";
import { useNavigate } from "solid-app-router";

const NavbarItem: Component<{
  name: string,
  slug: string,

  /** Defaults to false. */
  selected?: boolean
}> = (_props) => {
  const props = mergeProps({ selected: false }, _props);
  const navigate = useNavigate();

  const handleProjectUpdate = () => {
    if (project_slug.current === props.slug) return;
    console.info("[handleProjectUpdate] Switching from", project_slug.current, "to", props.slug);

    // We remove any currently opened project.
    project.setIsGloballySaved(true);
    project.setData(null);
    project.setMetadata(null);
    console.info("[handleProjectUpdate] Project data and metadata cleared.");

    // We update the current project slug
    // and navigate to its page to load it.
    project.setSlug(props.slug);
    navigate(props.slug);

    // Close the projects' menu.
    toggleProjectsMenu();

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
              const wasRemovedFromMetadata = await storedProjectsMetadata.deleteProjectMetadata(props.slug);
              const wasRemovedFromData = await storedProjectsData.deleteProjectData(props.slug);
              if (!wasRemovedFromMetadata || !wasRemovedFromData) return;

              const localProjectsUpdated = [ ...localProjectsMetadata as ProjectLoadedMetadata[] ];
              setLocalProjectsMetadata([
                ...localProjectsUpdated.filter(
                  project => project.slug !== props.slug
                )
              ]);

              // If the current project was removed, we redirect
              // to root because project will be inexistant.
              // Also remove the useless components.
              if (project_slug.current === props.slug) {
                navigate("/projects");
                
                // We remove any currently opened project.
                project.setIsGloballySaved(true);
                project.setData(null);
                project.setMetadata(null);
                project.setSlug(null);
              }
            }
          }
        ]}
      >
        <HiOutlineDotsVertical size={24} />
      </DropdownButton>
    </div>
  );
};

export default NavbarItem;
