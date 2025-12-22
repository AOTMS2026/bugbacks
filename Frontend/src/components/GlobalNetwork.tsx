import { WorldMap } from "./ui/map";
import { motion } from "framer-motion";

export function GlobalNetwork() {
  return (
    <section id="destinations" className="py-40 bg-white dark:bg-black transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <WorldMap
            dots={[
              {
                start: { lat: 64.2008, lng: -149.4937, label: "Fairbanks" },
                end: { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
              },
              {
                start: { lat: 64.2008, lng: -149.4937, label: "Fairbanks" },
                end: { lat: -15.7975, lng: -47.8919, label: "Brasília" },
              },
              {
                start: { lat: -15.7975, lng: -47.8919, label: "Brasília" },
                end: { lat: 38.7223, lng: -9.1393, label: "Lisbon" },
              },
              {
                start: { lat: 51.5074, lng: -0.1278, label: "London" },
                end: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
              },
              {
                start: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
                end: { lat: 43.1332, lng: 131.9113, label: "Vladivostok" },
              },
              {
                start: { lat: 28.6139, lng: 77.209, label: "New Delhi" },
                end: { lat: -1.2921, lng: 36.8219, label: "Nairobi" },
              },
            ]}
          />
        </motion.div>
      </div>
    </section>
  );
}
