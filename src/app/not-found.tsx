export default function NotFound() {
  return (
    <>
      <div className="relative z-1"></div>
      <div className="min-h-[calc(100vh-151px)] sm:min-h-[calc(100vh-181px)]">
        <main className="w-full">
          <div className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center bg-white px-4 py-30 text-center">
            <div className="mb-5 flex h-50 w-50 items-center justify-center rounded-full bg-gray-200 text-9xl font-bold text-gray-800">
              <h1 className="text-6xl font-bold">404</h1>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">Page Not Found</h1>
            <p className="mb-6 text-gray-500">{"Sorry, we couldn't find the page you're looking for."}</p>
          </div>
        </main>
      </div>
      <div className="relative z-1"></div>
    </>
  );
}
