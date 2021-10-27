import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function ReloadPrompt () {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered (registration) {
        console.log("SW Registered !", registration);
    },
    onRegisterError (error) {
        console.error("SW registration error", error);
    }
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <React.Fragment>
      { (offlineReady || needRefresh) &&
        <div> {/** Toast */}
          <div> {/** Message */}
            { offlineReady
              ? <span>App ready to work offline !</span>
              : <span>New content available, click on reload button to update.</span>
            }
          </div>
          { needRefresh &&
            <button
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </button>
          }

          <button
            onClick={() => close()}
          >
            Close
          </button>
        </div>
      }
    </React.Fragment>
  )
}