export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Desktop Logo Section */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-violet-50 to-violet-100/50">
        <div className="space-y-8 text-center">
          <h1 className="text-7xl xl:text-8xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            WeddList
          </h1>
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-violet-500/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-12 h-12 text-violet-500 animate-pulse"
                role="img"
                aria-labelledby="heart-title"
              >
                <title id="heart-title">WeddList Logo</title>
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[520px]">{children}</div>
      </div>
    </div>
  );
}
