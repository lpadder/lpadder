import type { ApiRequestHandlerType } from "@/utils/apiRequestHandler";
import { handleApiRequest } from "@/utils/apiRequestHandler";

export const get: ApiRequestHandlerType = (props) => handleApiRequest(props, async (req, res) => {

  return res.json({
    success: true,
    message: "Something amazing is coming here, soon !"
  });
});