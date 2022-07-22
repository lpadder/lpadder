/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { StartServer, createHandler, renderAsync } from "solid-start/entry-server";

export default createHandler(
  renderAsync(context => <StartServer context={context} />)
);
