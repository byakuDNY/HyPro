const LoadingUi = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex h-28 w-28 animate-spin items-center justify-center rounded-full border-8 border-t-primary">
        <svg
          width="32"
          height="32"
          viewBox="0 -960 960 960"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M480-80q-83 0-156-31.5T197-197t-85.5-127T80-480t31.5-156T197-763t127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480t93.5 226.5T480-160q32 0 62-6t58-17l60 61q-41 20-86 31t-94 11m280-80v-120H640v-80h120v-120h80v120h120v80H840v120zM424-296 254-466l56-56 114 114 400-401 56 56z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default LoadingUi;
