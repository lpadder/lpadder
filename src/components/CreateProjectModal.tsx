import { useForm } from "react-hook-form";
import { RefCallBack, ChangeHandler } from "react-hook-form";
import stores from "../stores";

type FormInputProps = {
  labelName: string;
  ref: RefCallBack;
  onChange: ChangeHandler;
  onBlur: ChangeHandler;
  placeholder: string;
  name: string;
  informationText?: string;
};

const FormInput = ({
  labelName,
  ref,
  onChange,
  onBlur,
  placeholder,
  name,
  informationText = ""
}: FormInputProps) => (
  <div>
    <label htmlFor={name} className="text-sm font-medium mb-1">
      {labelName}
    </label>
    <input
      ref={ref}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      placeholder={placeholder}
      className="
        p-2 w-full rounded outline-none
        m:text-sm
        bg-gray-900
        transition-colors  focus:bg-gray-800
        border border-pink-400
      "
    />
    {informationText.length > 0 &&
      <p className="mt-2 text-sm text-gray-600 text-opacity-60">
        {informationText}
      </p>
    }
  </div>
);

type CreateProjectModalProps = {
  reloadSavedProjects: () => Promise<void>;
  closeModal: () => void;
};

type CreateProjectModalFormValues = {
  name: string;
  slug: string;
};

export default function CreateProjectModal ({
  reloadSavedProjects,
  closeModal
}: CreateProjectModalProps) {
  const { register, handleSubmit } = useForm<CreateProjectModalFormValues>();

  const handleCreation = handleSubmit(async (data) => {
    console.log(data);
    const [success, message] = await stores.projects.createEmptyProject({
      name: data.name,
      slug: data.slug
    });

    if (success) {
      await reloadSavedProjects();
      closeModal();
    }
    else {
      console.error(`[CreateProjectModal] ${message}`);
    }
  });

  return (
    <div
      className="
        z-50 fixed h-screen w-screen top-0 left-0
        flex justify-center items-center
        bg-gray-900 bg-opacity-60
      "
    >
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-gray-900 px-8 py-4 rounded-lg">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-200">
            Create a cover
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleCreation}>
            <FormInput
              labelName="Cover's name"
              placeholder="Author - Title (Launchpad Cover)"
              {...register("name", { required: true })}
            />
            <FormInput
              labelName="Personal slug"
              placeholder="some-amazing-cover"
              informationText="Slug used to identify the cover more easily from URL."
              {...register("slug", {
                required: true,
                pattern: /^[a-z0-9-]+$/,
                onChange: ({ target }) => {
                  if (target.value.length > 0) {
                    // Rewrite value to make it match slug pattern.
                    target.value = target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
                  }
                }
              })}
            />

            <div className="flex gap-2 justify-between">
              <button
                className="
                  w-full py-2 px-4 
                  text-sm font-medium
                  text-gray-400 text-opacity-60
                  hover:text-opacity-80 transition-colors
                "
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="
                  w-full py-2 px-4
                  text-sm font-medium
                  rounded-md
                  text-pink-400
                  bg-pink-800 bg-opacity-40
                  hover:bg-opacity-60 transition-colors
                  focus:bg-opacity-70
                "
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
