const logger = (componentName: string) => ({
  render: (...args: unknown[]) => console.log(
    `%c[RENDER]%c[${componentName}]`,
    "color: #B48EAD;",
    "color: #88C0D0;",
    ...args
  ),
  log: (...args: unknown[]) => console.log(
    `%c[LOG]%c[${componentName}]`,
    "color: #5E81AC;",
    "color: #88C0D0;",
    ...args
  ),
  effectGroup: (...args: unknown[]) => console.group(
    `%c[EFFECT]%c[${componentName}]`,
    "color: #8FBCBB;",
    "color: #88C0D0;",
    ...args
  )
});

export default logger;