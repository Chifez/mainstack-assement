// Fix the floating toolbar styling
export function FloatingToolbar() {
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
      <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.5 8.33334H2.5M17.5 8.33334C17.9602 8.33334 18.3333 8.70644 18.3333 9.16667V15.8333C18.3333 16.2936 17.9602 16.6667 17.5 16.6667H2.5C2.03976 16.6667 1.66667 16.2936 1.66667 15.8333V9.16667C1.66667 8.70644 2.03976 8.33334 2.5 8.33334M17.5 8.33334V6.66667C17.5 6.20644 17.1269 5.83334 16.6667 5.83334H3.33333C2.8731 5.83334 2.5 6.20644 2.5 6.66667V8.33334M7.5 11.6667H12.5"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 4.16666V15.8333M10 15.8333L15 10.8333M10 15.8333L5 10.8333"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 16.6667C13.6819 16.6667 16.6667 13.6819 16.6667 10C16.6667 6.31811 13.6819 3.33334 10 3.33334C6.31814 3.33334 3.33337 6.31811 3.33337 10C3.33337 13.6819 6.31814 16.6667 10 16.6667Z"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 6.66666V10L12.5 11.6667"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.8333 9.16666L17.6666 2.33333M17.6666 2.33333H12.6666M17.6666 2.33333V7.33333M9.16663 2.33333H7.49996C4.27996 2.33333 2.66663 3.94666 2.66663 7.16666V12.8333C2.66663 16.0533 4.27996 17.6667 7.49996 17.6667H13.1666C16.3866 17.6667 18 16.0533 18 12.8333V11.1667"
            stroke="#888888"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
