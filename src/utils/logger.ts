const wrapLabel = (label: string) => `[${label}]`;

export const logStart = (label: string, info: string) => {
  log(label, info);
  console.time(wrapLabel(label));
};

export const logEnd = (label: string) => {
  console.timeEnd(wrapLabel(label));
};

export const log = (label: string, ...message: unknown[]) => {
  console.info(wrapLabel(label) + ":", ...message);
};
