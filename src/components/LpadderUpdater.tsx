import type { Component } from "solid-js";

import { useRegisterSW } from "virtual:pwa-register/solid";
import Modal from "@/components/Modal";
import toast from "solid-toast";

const LpadderUpdaterModal: Component = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered (registration) {
      console.info("[service-worker] Registered !", registration);
    },
    onRegisterError (error) {
      console.error("[service-worker] Error.", error);
    }
  });

  createEffect(() => {
    if (offlineReady()) {
      toast("lpadder is ready to be used offline !", {});
    }
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <Modal open={needRefresh()} onClose={close}>
      <div class="
        p-4 mb-4
        font-medium
        bg-blue-800 bg-opacity-40 rounded text-blue-200
      ">
        <span>New version available, click on <span class="font-bold">Reload</span> button to update.</span>
      </div>

      <div class="flex flex-row justify-end gap-4">
        <button
          onClick={() => close()}
          class="
            px-6 py-2 rounded
            hover:bg-blue-800 hover:bg-opacity-20
            font-medium transition bg-transparent
          "
        >
          Close
        </button>

        <button
          class="px-6 py-2 transition bg-blue-800 rounded hover:bg-opacity-60 font-medium"
          onClick={() => updateServiceWorker(true)}
        >
          Reload
        </button>
      </div>
    </Modal>
  );
};

export default LpadderUpdaterModal;
