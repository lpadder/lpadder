import type { ProjectData } from "@/types/Project";
import type { ChangeEvent } from "react";

// Stores
import { useUnsavedProjectStore } from "@/stores/unsaved_project";

// Components
import Button from "@/components/Button";
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

          <Button
            className="hover:bg-blue-600 hover:border-blue-500"

            onClick={addToSelector}
            title={`Add a ${type} to the project`}
          >
            <HiOutlinePlus size={18} />
          </Button>
        </div>

        {children}

        <div className="
          flex gap-2 justify-around
        ">
          {target
            ? (
              <Fragment>
                {target.id !== 0 && (
                  <Button
                    className="hover:bg-blue-600 hover:border-blue-500 w-full"

                    title={`Move the current ${type} up`}
                    onClick={upItem}
                  >
                    <HiArrowUp size={18} />
                  </Button>
                )}

                <Button
                  className="hover:text-pink-600 hover:border-pink-600 w-full"

                  title={`Remove the current ${type}`}
                  onClick={removeFromSelector}
                >
                  <HiOutlineTrash size={18} />
                </Button>

                {launchpad && target.id !== ((type === "launchpad" ? data.launchpads : launchpad.pages).length - 1) && (
                  <Button
                    className="hover:bg-blue-600 hover:border-blue-500 w-full"

                    title={`Move the current ${type} down`}
                    onClick={downItem}
                  >
                    <HiArrowDown size={18} />
                  </Button>
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
