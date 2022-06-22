import { For } from "solid-js";
import type { Component } from "solid-js";

/**
 * List the description of the available utilities.
 * The slugs are actually the routes in the `@/routes/utilities` directory.
 */
const utilities = [
  {
    slug: "ableton-parse",
    description: "Parse Ableton Live Set (.als) file.",
  },
  {
    slug: "convert-midi",
    description: "Convert your MIDI files to Launchpad's programmer or live layout.",
  },
  {
    slug: "midi-checker",
    description: "Connect your MIDI device and listen to it's IO. You can also send input to them.",
  },
  {
    slug: "midi-visualizer",
    description: "Parse any MIDI file and visualize it on an Launchpad. Useful when making lightshows.",
  }
];

const UtilitiesHome: Component = () => {
  return (
    <div
      class="flex flex-col gap-12 justify-center items-center"
    >
      <div class="text-center">
        <h1
          class="text-3xl font-medium"
        >
          Welcome to the Utilities
        </h1>
        <p>Here you&apos;ll find a lot of utilities around the Launchpad and MIDI devices.</p>
      </div>

      <div
        class="max-w-[968px] grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <For each={utilities}>
          {({ slug, description }) => (
            <Link
              href={`/utilities/${slug}`}
              class="group p-4 rounded-lg w-full bg-gray-900 bg-opacity-20 shadow-gray-900/50 hover:bg-opacity-60 shadow-sm hover:shadow-lg transition cursor-pointer"
            >
              <h2
                class="transition-colors text-gray-400 group-hover:text-gray-200 font-medium text-xl mb-2"
              >
                {slug}
              </h2>
              <p
                class="transition-colors text-gray-400 text-opacity-60 group-hover:text-opacity-100"
              >
                {description}
              </p>
            </Link>
          )}
        </For>
      </div>
    </div>
  );
};

export default UtilitiesHome;