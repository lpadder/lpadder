import Modal from "@/components/Modal";

export type LpadderWrongVersionModalData = {
  /** Version from project's `cover.json`. */
  requiredVersion: string;
  
  /**
   * URL of the required lpadder version to run this project.
   * `undefined` when an error is thrown.
   */
  lpadderDeployUrl?: string;
  
  /** Error when fetching the deployment URL. */
  errorMessage?: string;
}

interface LpadderWrongVersionModalProps extends LpadderWrongVersionModalData {
  open: boolean;
  closeModal: () => void;
}

export default function LpadderWrongVersionModal ({
  open, closeModal,
  requiredVersion, lpadderDeployUrl, errorMessage
}: LpadderWrongVersionModalProps) {
  return (
    <Modal open={open} onClose={closeModal}>
      <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-200">
        Version not matching !
      </h2>

      <p className="p-3 bg-gray-600 bg-opacity-40 rounded-lg">
        To play and import this project, you need version <span className="font-bold text-blue-400">v{requiredVersion}</span> of lpadder
        while you&apos;re currently on version <span className="font-bold text-pink-400">v{APP_VERSION}</span>.
      </p>

      {(errorMessage && !lpadderDeployUrl) && (
        <div>
          <div className="mt-2 p-2 bg-pink-600 bg-opacity-40 rounded-lg text-center">
            {errorMessage}
          </div>
          
          <p className="text-gray-400 mt-2">
            As lpadder <span className="font-bold">v{requiredVersion}</span> is not available, you can&apos;t currently play this project.
          </p>
        </div>
      )}

      {(!errorMessage && lpadderDeployUrl) && (
        <p className="text-gray-400">
          A deployment URL for lpadder <span className="font-bold">v{requiredVersion}</span> is available.
          Click on the button below to access it !
        </p>
      )}

      <div className="flex gap-2 justify-between">
        <button
          type="button"
          className="px-4 py-2 w-full text-sm font-medium text-gray-400 text-opacity-60 transition-colors hover:text-opacity-80"
          onClick={closeModal}
        >
          {errorMessage ? "Abort" : "Cancel"}
        </button>

        {(!errorMessage && lpadderDeployUrl) && (
          <a
            href={lpadderDeployUrl}
            className="px-4 py-2 w-full text-center text-sm font-medium text-blue-400 bg-blue-800 bg-opacity-40 rounded-md transition-colors hover:bg-opacity-60 focus:bg-opacity-70"
          >
            Go to v{requiredVersion}
          </a>
        )}
      </div>
    </Modal>
  );
}
