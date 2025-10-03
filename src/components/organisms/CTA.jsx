import { motion } from "framer-motion";
import Container from "@/components/atoms/Container";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

export default function CTA() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-primary relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -90, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />
      </div>

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Billing?
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-white/90 mb-10 leading-relaxed"
          >
            Join thousands of businesses that have automated their billing with
            BillFlow. Start your free trial today and see the difference.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
          >
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto shadow-xl hover:shadow-2xl"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white/50 text-white shadow-xl"
            >
              Schedule Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 text-white/80"
          >
            <div className="flex items-center gap-2">
              <ApperIcon name="Check" className="w-5 h-5 text-green-300" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Check" className="w-5 h-5 text-green-300" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Check" className="w-5 h-5 text-green-300" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}