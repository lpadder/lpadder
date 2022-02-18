import LpadderLogo from "@/assets/icon.png";

type LoaderProps = {
  loadingText: string;
}

export default function Loader (
  { loadingText }: LoaderProps
) {
  return (
    <div
      className="flex fixed top-0 left-0 flex-col gap-6 justify-center items-center w-screen h-screen bg-gray-900 bg-opacity-60"
    >
      <div
        className="flex flex-col gap-4 justify-center items-center"
      >
        <img
          className="w-24 h-24" alt="lpadder's logo"
          src={LpadderLogo}
        />
        <span
          className="font-medium text-gray-400 text-opacity-80"
        >
          lpadder.
        </span>
      </div>
      <h2
        className="px-6 py-2 text-lg bg-gradient-to-r from-blue-500 to-pink-500 rounded-full"
      >
        {loadingText}
      </h2>
    </div>
  );
}