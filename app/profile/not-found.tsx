export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)]">
      <h1 className="text-2xl mb-5">Please log in to continue</h1>
      <a href="/login" className="p-2 bg-purple-500 text-white rounded">
        Log in
      </a>
    </div>
  );
}
