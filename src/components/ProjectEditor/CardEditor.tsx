import type { ProjectData, ProjectDataSample } from "@/types/Project";
import type { ChangeEvent } from "react";

// Stores
import { useUnsavedProjectStore } from "@/stores/unsaved_project";

// Components
import Select from "@/components/Select";
import Input from "@/components/Input";
import { Fragment } from "react";

// Icons
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiArrowDown,
  HiArrowUp
} from "react-icons/hi";

interface CardEditorProps {
  handleSelection: (evt: ChangeEvent<HTMLSelectElement>) => void;
  selectorItems:
    | ProjectData["launchpads"][number]["pages"]
    | ProjectData["launchpads"]
  ;
  
  type: "launchpad" | "page";
  launchpad: ProjectData["launchpads"][number] & { id: number } | null;

  target:
    | ProjectData["launchpads"][number] & { id: number } | null
    | ProjectData["launchpads"][number]["pages"][number] & { id: number } | null

  addToSelector: () => void,
  removeFromSelector: () => void,

  upItem: () => void,
  downItem: () => void,

  children: React.ReactNode
}

export default function CardEditor ({
  handleSelection,
  selectorItems,

  type,
  launchpad,
  target,

  addToSelector,
  removeFromSelector,

  upItem,
  downItem,

  children
}: CardEditorProps) {
  const { data, setData } = useUnsavedProjectStore();
  if (!data) return <p>Loading...</p>;

  return (
    <div className="
      flex flex-col sm:flex-row gap-4 p-4
      bg-gray-700 rounded-lg w-fit mx-auto
    ">
      <div className="
        max-w-xs sm:w-60 md:w-64 m-auto flex flex-col gap-4
      ">
        <div className="
          flex gap-2 justify-around
        ">
          <Select
            value={target?.id}
            onChange={handleSelection}

            placeholder={`Select a ${type}`}
            title={`Select a ${type}`}
          >
            {selectorItems.map((item, itemKey) =>
              <option value={itemKey} key={itemKey}>
                {item.name}
              </option>
            )}
          </Select>

          <button
            className="
              whitespace-nowrap px-4 py-2 rounded-lg
              text-gray-300
              hover:bg-blue-600
              bg-gray-900 bg-opacity-20
              border border-gray-900 hover:border-blue-500
              transition-all
            "

            onClick={addToSelector}
            title={`Add a ${type} to the project`}
          >
            <HiOutlinePlus size={18} />
          </button>
        </div>

        {children}

        <div className="
          flex gap-2 justify-around
        ">
          {target
            ? (
              <Fragment>
                {target.id !== 0 && (
                  <button
                    className="
                      px-4 py-2 rounded-lg w-full flex justify-center
                      text-gray-300 hover:text-blue-600
                      bg-gray-900 bg-opacity-20 hover:bg-opacity-60
                      border border-gray-900 hover:border-blue-600
                    "

                    title={`Move the current ${type} up`}
                    onClick={upItem}
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

                  title={`Remove the current ${type}`}
                  onClick={removeFromSelector}
                >
                  <HiOutlineTrash size={18} />
                </button>

                {launchpad && target.id !== ((type === "launchpad" ? data.launchpads : launchpad.pages).length - 1) && (
                  <button
                    className="
                      px-4 py-2 rounded-lg w-full flex justify-center
                      text-gray-300 hover:text-blue-600
                      bg-gray-900 bg-opacity-20 hover:bg-opacity-60
                      border border-gray-900 hover:border-blue-600
                    "

                    title={`Move the current ${type} down`}
                    onClick={downItem}
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
                No {type} selected
              </p>
            )
          }
        </div>

        {launchpad && target && (
          <Input
            placeholder={target.name}
            value={target.name}
            onChange={evt => {
              const data_copy = { ...data };

              if (type === "launchpad") {
                data_copy.launchpads[target.id].name = evt.target.value;
              }
              else if (type === "page") {
                data_copy.launchpads[launchpad.id].pages[target.id].name = evt.target.value;
              }
              else return;

              setData(data_copy);
            }}
          />
        )}
      </div>
    </div>
  );
}
