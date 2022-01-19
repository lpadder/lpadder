import { Fragment } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function ReloadPrompt () {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered (registration) {
      console.log("[service-worker] Registered !", registration);
    },
    onRegisterError (error) {
      console.error("[service-worker] Error.", error);
    }
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <Fragment>
      {(offlineReady || needRefresh) &&
        <div className="
          fixed top-0 h-full w-full
          flex items-center justify-center
          bg-opacity-70 bg-gray-900
        ">
          <div className="
            p-4 m-4
            shadow-md rounded-lg
            bg-gray-800
          ">
            <div className="
              p-4 mb-4
              font-medium
              bg-blue-800 bg-opacity-40 rounded text-blue-200
            "> {/** Message */}
              { offlineReady
                ? <span>App ready to work offline !</span>
                : <span>New content available, click on <span className="font-bold">Reload</span> button to update.</span>
              }
            </div>

            <div className="
              flex flex-row justify-end gap-4
            ">
              <button
                className={`
                  px-6 py-2 rounded
                  ${needRefresh ? "bg-transparent" : "bg-blue-800 bg-opacity-60"}
                  hover:bg-blue-800 hover:bg-opacity-20
                  font-medium transition
                `}
                onClick={() => close()}
              >
                Close
              </button>

              {needRefresh &&
                <button
                  className="px-6 py-2 transition bg-blue-800 rounded hover:bg-opacity-60 font-medium"
                  onClick={() => updateServiceWorker(true)}
                >
                  Reload
                </button>
              }
            </div>
          </div>
        </div>
      }
    </Fragment>
  );
}