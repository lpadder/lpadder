import type { ProjectData } from "@/types/Project";
import type WaveSuferType from "wavesurfer.js";

import { useRef, useEffect } from "react";

import { WaveSurfer, WaveForm } from "wavesurfer-react";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";

const waveSurferPlugins = [
  {
    plugin: RegionsPlugin,
    options: {
      dragSelection: true
    }
  }
];

interface AudioWaveProps {
  children: React.ReactNode;
  file: ProjectData["files"][string];

  /**
   * @param time - New position in seconds. 
   * @param position - New position of the cursor in [0..1] format.
   * @param duration - Duration in seconds.
  */
  onSeek: (time: number, position: number, duration: number) => void;
}

export default function AudioWave ({
  children,
  file,

  onSeek
}: AudioWaveProps) {
  const waveSurferRef = useRef<WaveSuferType>();

  /**
   * Prevent rendering twice with
   * React's StrictMode.
   */
  useEffect(() => {
    if (!waveSurferRef.current) return;
    const wave = waveSurferRef.current;

    // Subscribe to events.
    wave.on("seek", (position: number) => {
      const duration = wave.getDuration();
      const time = position * duration;

      return onSeek(time, position, duration);
    });

    return () => {
      if (!waveSurferRef.current) return;
      waveSurferRef.current.destroy();
    };
  }, []);

  /**
   * When the loaded file changes,
   * we update the waveform.
   */
  useEffect(() => {
    if (!file) return;
    if (!waveSurferRef.current) return;

    const blob = new Blob([file.data], { type: file.type });
    waveSurferRef.current.loadBlob(blob);
  }, [file]);

  return (
    <WaveSurfer
      plugins={waveSurferPlugins}
      onMount={(waveSurfer: WaveSuferType) => {
        // Storing the WaveSurfer instance into ref.
        waveSurferRef.current = waveSurfer;
      }}
    >
      <WaveForm
        id="waveform"
        hideCursor
        barWidth={2}

        cursorColor="#ffffff"
        responsive={true}
      >
        {children}
      </WaveForm>
    </WaveSurfer>
  );
}