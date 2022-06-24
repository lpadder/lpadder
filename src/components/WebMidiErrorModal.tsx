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

  return (
    <Modal
      onClose={() => null}
      open={
        (!webMidiInformations.isEnabled && webMidiInformations.wasRequested)
        && !forceClose()
      }
    >
      <div class="p-2 flex flex-col gap-4">
        <h2 class="text-center font-medium text-xl mb-2 text-pink-200 bg-pink-400 bg-opacity-20 rounded py-2">Can't enable WebMIDI !</h2>

        <p>
          Please, check if <a
            class="outline-none text-blue-300 focus:(text-blue-400 underline-blue-400) hover:(text-blue-400 underline-blue-400) transition underline underline-offset-2 underline-blue-300"
            href="https://caniuse.com/midi"
            target="_blank"
          >
            your browser supports WebMIDI
          </a>.
          If it does, then try to restart the application with the button below.
          If it still doesn't fix the problem, try to use another browser such as <span class="font-medium text-blue-200">Chrome, Opera or Brave</span>.
        </p>

        <h3 class="font-medium text text-pink-300">
          {">"} What are the downsides of my browser not supporting WebMIDI ?
        </h3>

        <ul class="list-disc ml-8 pr-2">
          <li class="pb-2">
            You <span class="font-medium text-pink-200">can't use your MIDI devices</span> with lpadder.
          </li>

          <li class="pb-2">
            Sections where MIDI devices are needed <span class="font-medium text-pink-200">will be unacessible</span>.
          </li>

          <li class="pb-2">
            Also, some <span class="font-medium text-pink-200">utilities will not be usable and games unplayable</span>.
          </li>
        </ul>

        <button
          class="py-2 border text-blue-200 border-transparent rounded bg-blue-600 bg-opacity-20 transition hover:(bg-opacity-40 border-blue-400)"
          onClick={() => document.location.reload()}
        >
          Restart
        </button>

        <button
          class="py-2 transition rounded text-pink-100 text-opacity-60 hover:(bg-pink-400 bg-opacity-20 text-opacity-100)"
          onClick={() => setForceClose(true)}
        >
          Continue without WebMIDI
        </button>

      </div>
    </Modal>
  );
};

export default WebMidiErrorModal;
