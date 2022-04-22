import type { ProjectData } from "@/types/Project";
import type { ChangeEvent } from "react";

import logger from "@/utils/logger";

import { useUnsavedProjectStore } from "@/stores/unsaved_project";

// Components
import Select from "@/components/Select";
import Input from "@/components/Input";
import { Fragment } from "react";

// Icons
import {
  HiArrowDown,
  HiArrowUp,
  HiOutlinePlus,
  HiOutlineTrash
} from "react-icons/hi";

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

  /** Remove 1 to the page index.  */
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
    <div className="
      flex flex-col sm:flex-row gap-4 p-4
      bg-gray-700 rounded-lg w-fit mx-auto
    ">
      <div className="
        h-full max-w-xs sm:w-60 md:w-64 m-auto flex flex-col gap-4
      ">
        <div className="
          flex gap-2
        ">
          <Select
            value={page?.id}
            onChange={handleLaunchpadPageSelection}

            placeholder="Select a page"
            title="Select a launchpad page"
          >
            {launchpad?.pages.map((page, pageKey) =>
              <option value={pageKey} key={pageKey}>
                {page.name}
              </option>
            )}
          </Select>

          <button
            className="
              whitespace-nowrap px-4 py-2 rounded-lg
              text-gray-300
              hover:bg-blue-600
              bg-gray-900 bg-opacity-20
              border border-gray-900 hover:border-blue-600
              transition-all
            "
            title="Add a new page to the current Launchpad"
            onClick={addLaunchpadPage}
          >
            <HiOutlinePlus size={18} />
          </button>
        </div>

        <div className="
          flex gap-2 justify-around
        ">
          {page
            ? (
              <Fragment>
                {page.id !== 0 && (
                  <button
                    className="
                      px-4 py-2 rounded-lg w-full flex justify-center
                      text-gray-300 hover:text-blue-600
                      bg-gray-900 bg-opacity-20 hover:bg-opacity-60
                      border border-gray-900 hover:border-blue-600
                    "

                    title="Move the current launchpad page up"
                    onClick={upLaunchpadPage}
                  >
                    <HiArrowUp size={18} />
                  </button>
                )}

                <button
                  className="
                    px-4 py-2 rounded-lg w-full flex justify-center
                    text-gray-300 hover:text-pink-600
                    bg-gray-900 bg-opacity-20 hover:bg-opacity-60
                    border border-gray-900 hover:border-pink-600
                  "

                  title="Remove the current launchpad page"
                  onClick={removeLaunchpadPage}
                >
                  <HiOutlineTrash size={18} />
                </button>

                {page.id !== (launchpad.pages.length - 1) && (
                  <button
                    className="
                      px-4 py-2 rounded-lg w-full flex justify-center
                      text-gray-300 hover:text-blue-600
                      bg-gray-900 bg-opacity-20 hover:bg-opacity-60
                      border border-gray-900 hover:border-blue-600
                    "

                    title="Move the current launchpad page down"
                    onClick={downLaunchpadPage}
                  >
                    <HiArrowDown size={18} />
                  </button>
                )}
              </Fragment>
            )
            : (
              <p className="
                text-gray-300
                px-4 py-2 rounded-lg
                bg-gray-900 bg-opacity-40
                h-fit my-auto
              ">
                No page selected
              </p>
            )
          }
        </div>


        {page && (
          <Input
            placeholder={page.name}
            value={page.name}
            onChange={evt => {
              const data_copy = { ...data };
              data_copy.launchpads[launchpad.id].pages[page.id].name = evt.target.value;
              setData(data_copy);
            }}
          />
        )}
      </div>
    </div>
  );
}