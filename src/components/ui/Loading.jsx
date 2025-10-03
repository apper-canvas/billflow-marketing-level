import Container from "@/components/atoms/Container";

export default function Loading() {
  return (
    <Container className="py-20">
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4" />
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}