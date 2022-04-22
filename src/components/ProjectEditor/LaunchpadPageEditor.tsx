import type { ProjectData } from "@/types/Project";
import type { ChangeEvent } from "react";

import logger from "@/utils/logger";

import { useUnsavedProjectStore } from "@/stores/unsaved_project";

import CardEditor from "./CardEditor";

interface LaunchpadPageEditorProps {
  page: ProjectData["launchpads"][number]["pages"][number] & { id: number } | null,
  launchpad: ProjectData["launchpads"][number] & { id: number },
  setCurrentLaunchpadPageSelected: (id: number) => void,
  handleLaunchpadPageSelection: (evt: ChangeEvent<HTMLSelectElement>) => void,

  addLaunchpadPage: () => void,
  removeLaunchpadPage: () => void
}

export default function LaunchpadPageEditor ({
  page,
  launchpad,
  handleLaunchpadPageSelection,
  setCurrentLaunchpadPageSelected,

  addLaunchpadPage,
  removeLaunchpadPage,
}: LaunchpadPageEditorProps) {
  const log = logger("/:slug~LaunchpadPageEditor");
  /** Debug. */ log.render();

  const { data, setData } = useUnsavedProjectStore();
  if (!data) return <p>Loading...</p>;

  /** Remove `1` to the page index. */
  const upLaunchpadPage = () => {
    if (!page) return;
    const data_copy = { ...data };
    const launchpad_copy = { ...data_copy.launchpads[launchpad.id] };
    const pages_copy = [...launchpad_copy.pages];
    const page_copy = { ...pages_copy[page.id] };
    const page_id = page.id;

    if (page_id === 0) return;

    pages_copy[page_id] = pages_copy[page_id - 1];
    pages_copy[page_id - 1] = page_copy;

    launchpad_copy.pages = pages_copy;
    data_copy.launchpads[launchpad.id] = launchpad_copy;
    setData(data_copy);

    setCurrentLaunchpadPageSelected(page_id - 1);
  };

  /** Add `1` to the page index. */
  const downLaunchpadPage = () => {
    if (!page) return;
    const data_copy = { ...data };
    const launchpad_copy = { ...data_copy.launchpads[launchpad.id] };
    const pages_copy = [...launchpad_copy.pages];
    const page_copy = { ...pages_copy[page.id] };
    const page_id = page.id;

    if (page_id === pages_copy.length - 1) return;

    pages_copy[page_id] = pages_copy[page_id + 1];
    pages_copy[page_id + 1] = page_copy;

    launchpad_copy.pages = pages_copy;
    data_copy.launchpads[launchpad.id] = launchpad_copy;
    setData(data_copy);

    setCurrentLaunchpadPageSelected(page_id + 1);
  };

  return (
    <CardEditor
      type="page"
      launchpad={launchpad}
      target={page}
    
      addToSelector={addLaunchpadPage}
      removeFromSelector={removeLaunchpadPage}

      selectorItems={launchpad.pages}
      handleSelection={handleLaunchpadPageSelection}

      upItem={upLaunchpadPage}
      downItem={downLaunchpadPage}
    >

      <div className="
        w-full aspect-square rounded-md
        bg-gray-400 bg-opacity-20
        border border-gray-400
      
        flex justify-center items-center
      ">

      </div>
    </CardEditor>
  );
}