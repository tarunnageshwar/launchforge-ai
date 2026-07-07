
import { motion } from 'framer-motion';
import { 
  Lightbulb, TrendingUp, Users, BarChart3, 
  Palette, Megaphone, PresentationIcon, Bot, 
  FileText, Shield
} from 'lucide-react';

const features = [
  {
    icon: Lightbulb,
    title: "AI Idea Validation",
    description: "Get an instant viability score with deep analysis of your problem, solution, and market fit.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/20"
  },
  {
    icon: TrendingUp,
    title: "Market Research",
    description: "AI-powered TAM/SAM/SOM analysis, trends, and target demographics generated in seconds.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20"
  },
  {
    icon: Users,
    title: "Competitor Analysis",
    description: "Identify competitors, map their strengths and weaknesses, and find your unique advantage.",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20"
  },
  {
    icon: BarChart3,
    title: "Financial Forecasts",
    description: "Generate revenue projections, cost structures, break-even analysis, and funding requirements.",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/20"
  },
  {
    icon: Palette,
    title: "Brand Identity",
    description: "AI generates brand names, taglines, color palettes, and visual identity guidelines.",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    borderColor: "border-pink-400/20"
  },
  {
    icon: Megaphone,
    title: "Marketing Strategy",
    description: "Get a complete go-to-market plan with channel strategies, content calendar, and growth hacks.",
    color: "text-violet-400",
    bgColor: "bg-violet-400/10",
    borderColor: "border-violet-400/20"
  },
  {
    icon: PresentationIcon,
    title: "Pitch Deck Generator",
    description: "Create investor-ready slide decks with compelling narratives and data visualization.",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20"
  },
  {
    icon: Bot,
    title: "AI Startup Mentor",
    description: "Chat with an AI mentor who understands your project and gives tailored strategic advice.",
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    borderColor: "border-indigo-400/20"
  },
  {
    icon: FileText,
    title: "Document Export",
    description: "Export business plans, reports, and pitch decks as professional PDF and PPTX files.",
    color: "text-teal-400",
    bgColor: "bg-teal-400/10",
    borderColor: "border-teal-400/20"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

const Features = () => {
  return (
    <section id="features" className="py-32 relative">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20 text-primary mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">9 Powerful AI Modules</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything you need to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">launch with confidence</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From ideation to investor pitch — our AI handles the heavy lifting so you can focus on building something great.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`group glass-card rounded-2xl p-8 border ${feature.borderColor} hover:border-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 cursor-default`}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
