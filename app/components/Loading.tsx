export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-ping h-5 w-5 bg-blue-700 rounded-full"></div>
      <div className="animate-ping h-5 w-5 bg-pink-700 rounded-full mx-10"></div>
      <div className="animate-ping h-5 w-5 bg-blue-700 rounded-full"></div>
    </div>
  );
}
