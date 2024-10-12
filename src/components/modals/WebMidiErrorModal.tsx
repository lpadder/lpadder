import type { Component } from "solid-js";

import Modal from "@/components/Modal";
import { webMidiInformations } from "@/stores/webmidi";

/**
 * Modal when WebMIDI can't be enabled.
 *
 * This warning explains what we can't do when
 * WebMIDI isn't enabled and tries to give advices.
 */
const WebMidiErrorModal: Component = () => {
  const [forceClose, setForceClose] = createSignal(false);
  const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

  return (
    <Modal
      onClose={() => null}
      open={
        (!webMidiInformations.isEnabled && webMidiInformations.wasRequested)
        && !forceClose()
      }
    >
      <div class="p-2 flex flex-col gap-4">
        <h2 class="text-center font-medium text-xl mb-2 text-fuchsia-200 bg-fuchsia-400 bg-opacity-20 rounded py-2">Can't enable WebMIDI !</h2>

        <p>
          Please, check if <a
            class="outline-none text-sky-300 focus:(text-sky-400 underline-sky-400) hover:(text-sky-400 underline-sky-400) transition underline underline-offset-2 underline-sky-300"
            href="https://caniuse.com/midi"
            target="_blank"
          >
            your browser supports WebMIDI
          </a>.
          If it does, then try to restart the application with the button below.
          If it still doesn't fix the problem, try to use another browser such as <span class="font-medium text-sky-200">Chrome, Opera, Brave or the latest versions of Firefox</span>.
        </p>

        <Show when={isFirefox}>
          <p class="p-4 bg-fuchsia-400 border border-fuchsia-400 text-fuchsia-200 bg-opacity-20 rounded">
            Since you're using Firefox, please make sure to have downloaded the <span class="font-medium">lpadder site permissions</span> to allow the usage of MIDI devices on lpadder.
          </p>
        </Show>

        <h3 class="font-medium text text-fuchsia-300">
          {">"} What are the downsides of my browser not supporting WebMIDI ?
        </h3>

        <ul class="list-disc ml-8 pr-2 space-y-2">
          <li>
            You <span class="font-medium text-fuchsia-200">can't use your MIDI devices</span> with lpadder.
          </li>

          <li>
            Sections where MIDI devices are needed <span class="font-medium text-fuchsia-200">will be unacessible</span>.
          </li>

          <li>
            Also, some <span class="font-medium text-fuchsia-200">utilities and games will not be usable or playable</span>.
          </li>
        </ul>

        <Show when={isFirefox}>
          <a class="py-2 text-center border text-sky-200 border-sky-200 rounded bg-sky-300 bg-opacity-0 transition hover:bg-opacity-20" href="https://addons.mozilla.org/firefox/downloads/file/3978142/35d4da3054064b769297-1.0.xpi">
            Request the site permission addons
          </a>
        </Show>

        <button
          class="py-2 border text-sky-200 border-transparent rounded bg-sky-600 bg-opacity-20 transition hover:(bg-opacity-40 border-sky-400)"
          onClick={() => document.location.reload()}
        >
          Refresh the page
        </button>

        <button
          class="py-2 transition rounded text-fuchsia-100 text-opacity-60 hover:(bg-fuchsia-400 bg-opacity-20 text-opacity-100)"
          onClick={() => setForceClose(true)}
        >
          Continue without WebMIDI
        </button>

      </div>
    </Modal>
  );
};

export default WebMidiErrorModal;
