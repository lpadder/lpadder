/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { StartServer, createHandler, renderStream } from "solid-start/entry-server";

export default createHandler(
  renderStream(context => <StartServer context={context} />)
);
