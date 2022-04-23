import type { ProjectData } from "@/types/Project";
import type WaveSuferType from "wavesurfer.js";

import { useRef, useEffect } from "react";

import { WaveSurfer, WaveForm } from "wavesurfer-react";

interface AudioWaveProps {
  children: React.ReactNode;
  file: ProjectData["files"][string];
}

export default function AudioWave ({
  children,
  file
}: AudioWaveProps) {
  const waveSurferRef = useRef<WaveSuferType>();

  /**
   * Prevent rendering twice with
   * React's StrictMode.
   */
  useEffect(() => {
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
    if (!waveSurferRef.current) return;

    const blob = new Blob([file.data], { type: file.type });
    waveSurferRef.current.loadBlob(blob);
    console.info("Create new wave.");
  }, [file]);

  return (
    <WaveSurfer onMount={(waveSurfer: WaveSuferType) => {
      // Storing the WaveSurfer instance into ref.
      waveSurferRef.current = waveSurfer;
    }}>
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