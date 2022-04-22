import type { ProjectData } from "@/types/Project";
import type WaveSuferType from "wavesurfer.js";

import { useRef, useEffect, useCallback, useState } from "react";

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

  const onMount = useCallback((waveSurfer: WaveSuferType) => {
    waveSurferRef.current = waveSurfer;

    const blob = new Blob([file.data], { type: file.type });
    waveSurferRef.current.loadBlob(blob);
  }, []);

  useEffect(() => {
    return () => {
      if (!waveSurferRef.current) return;
      waveSurferRef.current.destroy();
    };
  }, []);

  return (
    <WaveSurfer onMount={onMount}>
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