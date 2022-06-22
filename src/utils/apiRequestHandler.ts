/** Type of `req` from `handleApiRequest`. */
export type ApiRequestHandlerRequestType = Request;
/** Type of `res` from `handleApiRequest`. */
export type ApiRequestHandlerResponseType = {
  status: (status: number) => ApiRequestHandlerResponseType,
  statusText: (text: string) => ApiRequestHandlerResponseType,
  json: (data: unknown) => Response,
  text: (data: string) => Response
};

/** Typing of the props from an API route. */
type ApiRequestHandlerPropsType = { request: ApiRequestHandlerRequestType };
/** Helper type for the API routes handlers. */
export type ApiRequestHandlerType = (props: ApiRequestHandlerPropsType) => ReturnType<typeof handleApiRequest>;

/**
 * This is a helper for the API routes.
 * 
 * Instead of building all the Response object by ourselves,
 * we're gonna provide some utilities functions that are
 * similar to the Express API.
 * 
 * @example
 * export const get: ApiRequestHandlerType = (props) => handleApiRequest(props, (req, res) => {
 *   res.status(200).json({ success: true, message: "Hello World" });
 * });
 */
export const handleApiRequest = async (
  props: ApiRequestHandlerPropsType,
  callback: (
    req: ApiRequestHandlerRequestType,
    res: ApiRequestHandlerResponseType
  ) => Promise<Response>
) => {  

  const res_options = {
    status: 200,
    statusText: "",
    headers: new Map<string, string>()
      /** <https://developer.mozilla.org/docs/Web/HTTP/Headers/Server> */
      .set("Server", `lpadder/${import.meta.env.DEV ? "next" : APP_VERSION}`)
  };

  const parseResponseOptions = () => {
    return {
      ...res_options,
      headers: Object.fromEntries(res_options.headers)
    };
  };

  /** Response object that contains all the helpers. */
  const res: ApiRequestHandlerResponseType = {
    status: (status) => {
      res_options.status = status;
      return res;
    },
    statusText: (text) => {
      res_options.statusText = text;
      return res;
    },
    json: (data) => {
      res_options.headers.set("Content-Type", "application/json");
      return new Response(JSON.stringify(data), parseResponseOptions());
    },
    text: (data) => {
      return new Response(data, parseResponseOptions());
    }
  };

  return callback(props.request, res);
};
