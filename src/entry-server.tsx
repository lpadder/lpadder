/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { StartServer, createHandler, renderAsync } from "solid-start/entry-server";

export default createHandler(
  renderAsync(event => <StartServer event={event} />)
);
