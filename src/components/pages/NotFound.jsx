import { useNavigate } from "react-router-dom";
import Container from "@/components/atoms/Container";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-2xl">
              <ApperIcon name="AlertTriangle" size={64} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-gradient mb-4">404</h1>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="min-w-[200px]"
            >
              <ApperIcon name="Home" size={20} className="mr-2" />
              Back to Home
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
              className="min-w-[200px]"
            >
              <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}