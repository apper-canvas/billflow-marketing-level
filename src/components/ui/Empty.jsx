import Container from "@/components/atoms/Container";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

export default function Empty({ message, actionLabel, onAction }) {
  return (
    <Container className="py-20">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="Inbox" className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No data available
        </h2>
        <p className="text-gray-600 mb-8">
          {message || "There's nothing to display here yet"}
        </p>
        {onAction && actionLabel && (
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        )}
      </div>
    </Container>
  );
}