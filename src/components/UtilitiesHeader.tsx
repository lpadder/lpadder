import { useNavigate } from "react-router-dom";

export default function UtilitiesHeader () {
  const navigate = useNavigate();

  return (
    <header
      className="flex justify-start items-center px-8 w-full h-24"
    >
      <button
        onClick={() => navigate(-1)}
        className="z-50 px-4 py-2 bg-gray-900 bg-opacity-60 rounded-lg transition-colors hover:bg-opacity-80"
      >
          Go back
      </button>
    </header>
  );
}