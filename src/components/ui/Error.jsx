import Container from "@/components/atoms/Container";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

export default function Error({ message, onRetry }) {
  return (
    <Container className="py-20">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertCircle" className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 mb-8">{message || "Please try again later"}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
        )}
      </div>
    </Container>
  );
}