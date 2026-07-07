
import { motion } from 'framer-motion';
import { Zap, FileCheck, BarChart3 } from 'lucide-react';

const steps = [
  {
    step: "01",
    icon: Zap,
    title: "Describe Your Idea",
    description: "Enter your startup concept, target market, and problem statement. Our AI takes it from there.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    step: "02",
    icon: BarChart3,
    title: "AI Analyzes & Generates",
    description: "In seconds, our AI validates the idea, researches the market, analyzes competitors, and builds financial models.",
    color: "from-primary to-blue-500"
  },
  {
    step: "03",
    icon: FileCheck,
    title: "Download & Launch",
    description: "Export professional pitch decks, business plans, and reports. You're ready to approach investors and build.",
    color: "from-emerald-500 to-teal-500"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Three steps to your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">startup blueprint</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            No MBA required. Just your idea and a few seconds of patience.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              {/* Step Number Circle */}
              <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-8 shadow-lg`}>
                <step.icon className="w-8 h-8 text-white" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                  {step.step}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
