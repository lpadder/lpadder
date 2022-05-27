import type { Component } from "solid-js";

import { Show } from "solid-js";
import { useRegisterSW } from "virtual:pwa-register/solid";

import Modal from "@/components/Modal";

const ReloadPrompt: Component = () => {
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

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <Modal open={offlineReady() || needRefresh()} onClose={close}>
      <div class="
        p-4 mb-4
        font-medium
        bg-blue-800 bg-opacity-40 rounded text-blue-200
      ">
        <Show
          when={offlineReady()}
          fallback={
            <span>New content available, click on <span class="font-bold">Reload</span> button to update.</span>
          }
        >
          <span>App ready to work offline !</span>
        </Show>
      </div>

      <div class="flex flex-row justify-end gap-4">
        <button
          class="
            px-6 py-2 rounded
            hover:bg-blue-800 hover:bg-opacity-20
            font-medium transition
          "
          classList={{
            "bg-transparent": needRefresh(),
            "bg-blue-900 bg-opacity-40": !needRefresh()
          }}
          onClick={() => close()}
        >
          Close
        </button>

        <Show when={needRefresh()}>
          <button
            class="px-6 py-2 transition bg-blue-800 rounded hover:bg-opacity-60 font-medium"
            onClick={() => updateServiceWorker(true)}
          >
            Reload
          </button>
        </Show>
      </div>
    </Modal>
  );
};

export default ReloadPrompt;