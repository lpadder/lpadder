import type { Component } from "solid-js";
import Modal from "@/components/Modal";

import { modalsStore, setModalsStore } from "@/stores/modals";

const LpadderWrongVersionModal: Component = () => {

  const resetAndClose = () => {
    setModalsStore({
      lpadderWrongVersionModal: false,
      lpadderWrongVersionModalData: null
    });
  };

  const required_version = () => modalsStore.lpadderWrongVersionModalData?.required_version;
  const version_check_result = () => modalsStore.lpadderWrongVersionModalData?.success;
  const modal_data = () => modalsStore.lpadderWrongVersionModalData?.data;

  return (
    <Modal open={modalsStore.lpadderWrongVersionModal} onClose={resetAndClose}>
      <h2 class="mt-6 text-3xl font-extrabold text-center text-gray-200">
        Version not matching !
      </h2>

      <p class="p-3 bg-gray-600 bg-opacity-40 rounded-lg">
        To play and import this project, you need version <span class="font-bold text-blue-400">v{required_version()}</span> of lpadder
        while you&apos;re currently on version <span class="font-bold text-pink-400">v{APP_VERSION}</span>.
      </p>

      <Show when={!version_check_result()} fallback={
        <p class="text-gray-400">
          A deployment URL for lpadder <span class="font-bold">v{required_version()}</span> is available.
          Click on the button below to access it !
        </p>
      }>
        <div>
          <div class="mt-2 p-2 bg-pink-600 bg-opacity-40 rounded-lg text-center">
            {modal_data()}
          </div>

          <p class="text-gray-400 mt-2">
              As lpadder <span class="font-bold">v{required_version()}</span> is not available, you can&apos;t play this project.
          </p>
        </div>
      </Show>

      <div class="flex gap-2 justify-between">
        <button
          type="button"
          class="px-4 py-2 w-full text-sm font-medium text-gray-400 text-opacity-60 transition-colors hover:text-opacity-80"
          onClick={resetAndClose}
        >
          {version_check_result() ? "Abort" : "Cancel"}
        </button>

        <Show when={version_check_result() && modal_data()}>
          <a
            href={modal_data()}
            class="px-4 py-2 w-full text-center text-sm font-medium text-blue-400 bg-blue-800 bg-opacity-40 rounded-md transition-colors hover:bg-opacity-60 focus:bg-opacity-70"
          >
            Go to v{required_version()}
          </a>
        </Show>
      </div>
    </Modal>
  );
};

export default LpadderWrongVersionModal;
