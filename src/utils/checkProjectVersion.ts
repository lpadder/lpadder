interface CheckVersionProjectSuccess {
  success: true;
}

interface CheckVersionProjectError {
  success: false;

  /**
   * Error message only when error while
   * fetching to GitHub API or deployment
   * not found.
   */
  error_message?: string;

  /** Deploy URL only when deployment was found. */
  deploy_url?: string;
}

/**
 * This will check the current version of lpadder
 * with the version given in the project.
 * 
 * When the version isn't matching, we'll fetch
 * the corresponding lpadder URL for this version.
 */
export default async function checkProjectVersion (
  version: string
): Promise<CheckVersionProjectSuccess | CheckVersionProjectError> {
  if (
    // We don't check the project version on the development environment.
    APP_VERSION !== "next" &&
    // We don't check if the project version is from the development environment.
    version !== "next" &&
    // We check if the project version is not matching with lpadder version.
    version !== APP_VERSION
  ) {               
    const release_url = `https://api.github.com/repos/Vexcited/lpadder/releases/tags/v${version}`;
    const release_response = await fetch(release_url);

    const release_data = await release_response.json() as {
      /** Content of the release. */
      body?: string;
      /** Only when an error was thrown. */
      message?: string;
    };

    if (release_data.message || !release_data.body) {
      // setLpadderWrongVersionModalData({
      //   requiredVersion: version,
      //   errorMessage: "GitHub API Error: " + release_data.message,
      //   lpadderDeployUrl: undefined
      // });

      // setLpadderWrongVersionModalOpen(true);
      // return;
      return {
        success: false,
        error_message: "GitHub API Error: " + release_data.message
      };
    }

    const deploy_url_regex = /Deployment URL: <(.*)>/;
    const deploy_url_results = release_data.body.match(deploy_url_regex);

    if (!deploy_url_results) {
      // setLpadderWrongVersionModalData({
      //   requiredVersion: version,
      //   errorMessage: "Deployment URL wasn't found !",
      //   lpadderDeployUrl: undefined
      // });

      // setLpadderWrongVersionModalOpen(true);
      return {
        success: false,
        error_message: "Deployment URL wasn't found !"
      };
    }

    const deploy_url = deploy_url_results[1];
    if (!deploy_url) {
      return {
        success: false,
        error_message: "Deployment URL wasn't found !"
      };
    }

    return {
      success: false,
      deploy_url
    };
  }

  return {
    success: true
  };
}