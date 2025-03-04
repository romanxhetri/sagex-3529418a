
import React, { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { MagicalUniverseScene } from "@/components/MagicalUniverseScene";
import { motion } from "framer-motion";
import { 
  SendHorizontal, 
  Code, 
  Play, 
  Sparkles, 
  Copy, 
  Download, 
  Zap,
  RefreshCcw,
  Settings,
  Terminal,
  FileCode,
  Bug,
  Mic,
  Braces
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CodeEditor } from "@/components/updates/CodeEditor";
import { ReasoningProcess } from "@/components/updates/ReasoningProcess";
import { LivePreview } from "@/components/updates/LivePreview";
import { VoiceCommandListener } from "@/components/updates/VoiceCommandListener";

const Updates = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isReasoningMinimized, setIsReasoningMinimized] = useState(false);
  const [currentThought, setCurrentThought] = useState("");
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [generatedReasoning, setGeneratedReasoning] = useState("");
  const { toast } = useToast();
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    console.log("Voice command received:", command);
    
    // Handle different commands
    if (command.includes("generate") || command.includes("create")) {
      // Extract what to generate
      const featureMatch = command.match(/generate (.*?)( for| to| with|$)/i);
      if (featureMatch) {
        const feature = featureMatch[1];
        setPrompt(`Create a ${feature} component or feature for the SageX app`);
        setTimeout(() => handleGenerate(), 500);
      }
    } 
    else if (command.includes("show code")) {
      setShowCode(true);
      setShowPreview(false);
    }
    else if (command.includes("show preview")) {
      setShowCode(false);
      setShowPreview(true);
    }
    else if (command.includes("clear")) {
      setPrompt("");
      if (promptInputRef.current) {
        promptInputRef.current.focus();
      }
    }
    else if (command.includes("debug") || command.includes("fix")) {
      setPrompt(`Debug and fix issues in the SageX app: ${command}`);
      setTimeout(() => handleGenerate(), 500);
    }
    else if (command.includes("update") || command.includes("improve")) {
      const featureMatch = command.match(/(update|improve) (.*?)( for| to| with|$)/i);
      if (featureMatch) {
        const feature = featureMatch[2];
        setPrompt(`Update or improve the ${feature} functionality in the SageX app`);
        setTimeout(() => handleGenerate(), 500);
      }
    }
    else {
      // Use the command as a prompt
      setPrompt(command);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description of what you want to build.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedCode("");
    setGeneratedReasoning("");
    setIsReasoningMinimized(false);
    
    try {
      // Generate reasoning process first
      const reasoning = `## SageX AI Reasoning Process

### 1. 🧠 Understanding the Request
**Input Analysis:** "${prompt}"

- **Request Type:** ${prompt.includes("create") ? "Feature Creation" : prompt.includes("fix") ? "Bug Fix" : prompt.includes("update") ? "Feature Update" : "General Development"}
- **Complexity Assessment:** ${prompt.length > 100 ? "High (detailed request)" : prompt.length > 50 ? "Medium (moderate detail)" : "Low (simple request)"}
- **Domain Knowledge Required:** ${prompt.includes("react") || prompt.includes("component") ? "React Component Development" : prompt.includes("server") || prompt.includes("api") ? "Backend/API Development" : "General Web Development"}

### 2. 🔍 Technical Analysis
- **Key Technologies Needed:** React, Tailwind CSS, ${prompt.includes("animation") ? "Framer Motion" : prompt.includes("3d") ? "Three.js" : prompt.includes("data") ? "Context API/State Management" : "Standard React patterns"}
- **Potential Challenges:** ${prompt.includes("performance") ? "Performance optimization required" : prompt.includes("complex") ? "Complex state management needed" : prompt.includes("responsive") ? "Cross-device compatibility" : "Standard implementation challenges"}
- **Implementation Approach:** ${prompt.includes("component") ? "Modular component architecture" : prompt.includes("page") ? "Full page implementation" : prompt.includes("feature") ? "Feature integration" : "Targeted code modification"}

### 3. 💡 Solution Design
- **Architecture Design:** ${prompt.includes("component") ? "Standalone component with props interface" : prompt.includes("integration") ? "Integration with existing components" : "Isolated feature implementation"}
- **State Management:** ${prompt.includes("state") || prompt.includes("data") ? "React useState/useContext" : "Minimal state, mostly UI focused"}
- **UI/UX Considerations:** Following SageX design system with purple/blue gradients and glass morphism

### 4. ⚙️ Implementation Planning
- **File Structure:** Creating appropriate component hierarchy
- **Coding Approach:** Beginning with component skeleton, then adding logic, then styling
- **Performance Considerations:** Optimizing renders, memoizing where appropriate

### 5. 🧪 Testing & Quality Assurance
- **Testability:** Ensuring components are testable
- **Edge Cases:** Handling null states, loading states, and error conditions
- **Accessibility:** Ensuring keyboard navigation and screen reader compatibility

### 6. 📝 Documentation
- **Code Comments:** Adding explanatory comments for complex logic
- **README Updates:** Noting any API changes or new components
- **Usage Examples:** Providing example usage where appropriate`;

      setGeneratedReasoning(reasoning);

      // Display reasoning with typewriter effect
      for (let i = 0; i < reasoning.length; i += 5) {
        setCurrentThought(reasoning.substring(0, i));
        await new Promise(r => setTimeout(r, 1));
      }
      
      setCurrentThought(reasoning);
      
      // Wait a bit to simulate the AI thinking
      await new Promise(r => setTimeout(r, 1000));

      // Generate code based on the prompt
      let sampleCode = "";
      
      if (prompt.toLowerCase().includes("button") || prompt.toLowerCase().includes("ui element")) {
        sampleCode = `// Animated Button Component with Hover Effects
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const EnhancedButton = ({ 
  children, 
  onClick,
  variant = 'primary',
  size = 'medium',
  icon,
  className = '',
  ...props
}) => {
  // Define variants
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600',
    secondary: 'bg-gray-800 hover:bg-gray-700 border border-gray-700',
    ghost: 'bg-transparent hover:bg-gray-800 border border-gray-700',
    danger: 'bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600',
  };
  
  // Define sizes
  const sizes = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4',
    large: 'py-3 px-6 text-lg',
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={\`\${variants[variant]} \${sizes[size]} rounded-lg text-white font-medium 
                 shadow-lg transition-all duration-300 flex items-center justify-center \${className}\`}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
      
      {variant === 'primary' && (
        <motion.span 
          className="ml-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles size={16} className="text-yellow-300" />
        </motion.span>
      )}
    </motion.button>
  );
};

// Usage Example
const ButtonExample = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center p-8 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Enhanced Button Component</h2>
      
      <div className="flex gap-4 flex-wrap justify-center">
        <EnhancedButton variant="primary" size="medium">
          Primary Button
        </EnhancedButton>
        
        <EnhancedButton variant="secondary" size="medium">
          Secondary Button
        </EnhancedButton>
        
        <EnhancedButton variant="ghost" size="medium">
          Ghost Button
        </EnhancedButton>
        
        <EnhancedButton variant="danger" size="medium">
          Danger Button
        </EnhancedButton>
      </div>
      
      <div className="flex gap-4 mt-4 flex-wrap justify-center">
        <EnhancedButton variant="primary" size="small">
          Small Button
        </EnhancedButton>
        
        <EnhancedButton variant="primary" size="medium">
          Medium Button
        </EnhancedButton>
        
        <EnhancedButton variant="primary" size="large">
          Large Button
        </EnhancedButton>
      </div>
    </div>
  );
};

return <ButtonExample />;`;
      } 
      else if (prompt.toLowerCase().includes("card") || prompt.toLowerCase().includes("profile")) {
        sampleCode = `// User Profile Card with Animation and Glass Morphism
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Share2, User } from 'lucide-react';

export const ProfileCard = ({ 
  user = {
    name: 'Aiko Yamamoto',
    role: 'AI Research Scientist',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    stats: {
      followers: 12480,
      following: 267,
      likes: 8934
    },
    isOnline: true
  }
}) => {
  return (
    <div className="flex justify-center items-center p-8 bg-gray-900 rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-80 rounded-xl overflow-hidden bg-gradient-to-br from-gray-900/80 to-purple-900/20 backdrop-blur-xl border border-purple-500/30 shadow-xl"
      >
        {/* Card Header with Background */}
        <div className="h-24 bg-gradient-to-r from-purple-600 to-blue-500 relative">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.4, 0.2, 0.4, 0.2],
              background: [
                'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 60% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>
        
        {/* Avatar */}
        <div className="flex justify-center">
          <motion.div 
            className="w-24 h-24 rounded-full border-4 border-gray-900 overflow-hidden -mt-12 relative"
            whileHover={{ scale: 1.05 }}
          >
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <User size={40} className="text-gray-400" />
              </div>
            )}
            
            {user.isOnline && (
              <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-900" />
            )}
          </motion.div>
        </div>
        
        {/* User Info */}
        <div className="text-center px-6 py-4">
          <motion.h3 
            className="text-xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {user.name}
          </motion.h3>
          <motion.p 
            className="text-purple-400 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {user.role}
          </motion.p>
        </div>
        
        {/* Stats */}
        <motion.div 
          className="flex justify-between px-6 py-4 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center">
            <p className="text-gray-400 text-xs">Followers</p>
            <p className="text-white font-bold">
              {user.stats.followers.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Following</p>
            <p className="text-white font-bold">
              {user.stats.following.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Likes</p>
            <p className="text-white font-bold">
              {user.stats.likes.toLocaleString()}
            </p>
          </div>
        </motion.div>
        
        {/* Actions */}
        <div className="flex justify-around px-6 py-4 border-t border-gray-800">
          <motion.button 
            className="text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={20} />
          </motion.button>
          <motion.button 
            className="text-gray-400 hover:text-pink-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={20} />
          </motion.button>
          <motion.button 
            className="text-gray-400 hover:text-blue-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={20} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Render the component
return <ProfileCard />;`;
      }
      else if (prompt.toLowerCase().includes("chart") || prompt.toLowerCase().includes("analytics")) {
        sampleCode = `// Animated Analytics Dashboard Component
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Activity, DollarSign } from 'lucide-react';

// Sample data
const generateRandomData = () => {
  const data = [];
  for (let i = 0; i < 7; i++) {
    data.push({
      name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      users: Math.floor(Math.random() * 1000) + 500,
      revenue: Math.floor(Math.random() * 5000) + 1000,
      sessions: Math.floor(Math.random() * 2000) + 800,
    });
  }
  return data;
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export const AnalyticsDashboard = () => {
  const [data, setData] = useState(generateRandomData());
  const [hoverInfo, setHoverInfo] = useState(null);
  
  // Refresh data every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateRandomData());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Stats cards data
  const stats = [
    { title: 'Total Users', value: '32,489', icon: <Users size={24} />, color: 'from-blue-500 to-indigo-600' },
    { title: 'Revenue', value: '$126,800', icon: <DollarSign size={24} />, color: 'from-green-500 to-emerald-600' },
    { title: 'Growth', value: '+28.4%', icon: <TrendingUp size={24} />, color: 'from-purple-500 to-pink-600' },
    { title: 'Engagement', value: '18.2 min', icon: <Activity size={24} />, color: 'from-yellow-500 to-orange-600' },
  ];
  
  // Pie chart data
  const pieData = [
    { name: 'Mobile', value: 55 },
    { name: 'Desktop', value: 30 },
    { name: 'Tablet', value: 15 },
  ];
  
  return (
    <div className="p-6 bg-gray-900 rounded-xl">
      <motion.h2 
        className="text-2xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Analytics Dashboard
      </motion.h2>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className={\`p-4 rounded-lg bg-gradient-to-r \${stat.color} shadow-lg\`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <motion.div 
          className="lg:col-span-2 bg-gray-800 p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-medium text-white mb-4">User Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '4px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="sessions" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSessions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Pie Chart */}
        <motion.div 
          className="bg-gray-800 p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-medium text-white mb-4">Device Distribution</h3>
          <div className="h-80 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => \`\${name} \${(percent * 100).toFixed(0)}%\`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '4px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs text-gray-300">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Bar Chart */}
        <motion.div 
          className="lg:col-span-3 bg-gray-800 p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-medium text-white mb-4">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '4px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={\`#\${Math.floor(Math.random() * 0x7fffff + 0x800000).toString(16)}\`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Render the component
return <AnalyticsDashboard />;`;
      }
      else {
        // Default code example
        sampleCode = `// Auto-generated component based on your prompt: "${prompt}"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Star, Heart } from 'lucide-react';

export const MagicalFeature = () => {
  const [activeEffect, setActiveEffect] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Cycle through effects
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEffect(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  // Effect icons
  const effects = [
    <Sparkles key="sparkles" size={24} className="text-yellow-400" />,
    <Zap key="zap" size={24} className="text-blue-400" />,
    <Star key="star" size={24} className="text-purple-400" />,
    <Heart key="heart" size={24} className="text-pink-400" />
  ];
  
  return (
    <div className="p-8 bg-gray-900 rounded-lg">
      <motion.div
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="inline-block p-4 bg-gray-800 rounded-full mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            {effects[activeEffect]}
          </motion.div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            SageX Magical Feature
          </h2>
          <p className="text-gray-300 mb-4">
            Experience the power of AI-driven development with SageX
          </p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          variants={containerVariants}
        >
          {['Ultra-fast Rendering', 'Voice Command Integration', 'Magical UI Effects', 'Intelligent Debugging'].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 rounded-lg p-6 border border-purple-500/20"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03,
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
                borderColor: 'rgba(147, 51, 234, 0.5)'
              }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <div className="flex items-center mb-4">
                {effects[index]}
                <h3 className="ml-2 text-xl font-semibold text-white">{feature}</h3>
              </div>
              <p className="text-gray-300">
                Leverage the power of AI to enhance your development workflow with {feature.toLowerCase()} capabilities.
              </p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          className="text-center"
          variants={itemVariants}
        >
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white shadow-lg"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 25px rgba(147, 51, 234, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            Activate Magical Features
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Render the component
return <MagicalFeature />;`;
      }

      // Display code with typewriter effect (faster)
      const codeSections = sampleCode.split('\n');
      let displayedCode = '';
      
      for (let i = 0; i < codeSections.length; i++) {
        displayedCode += codeSections[i] + '\n';
        // Update every 2 lines to make it faster
        if (i % 2 === 0 || i === codeSections.length - 1) {
          setGeneratedCode(displayedCode);
          await new Promise(r => setTimeout(r, 5)); // Very small delay
        }
      }
      
      setGeneratedCode(sampleCode);
      setIsGenerating(false);
      setShowPreview(true);
      
      toast({
        title: "Generation complete",
        description: "Your code has been generated successfully!",
      });
      
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <MagicalUniverseScene />
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden"
        >
          <div className="p-4 border-b border-glass-border flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="text-purple-400 mr-2" size={20} />
              <h2 className="text-xl font-semibold text-white">SageX AI Engine</h2>
            </div>
            <div className="flex items-center space-x-2">
              <VoiceCommandListener 
                onCommand={handleVoiceCommand}
                isListening={isVoiceListening}
                setIsListening={setIsVoiceListening}
              />
              
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium ${showCode ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => {
                  setShowCode(true);
                  setShowPreview(false);
                }}
              >
                <Code size={16} className="inline mr-1" />
                Code
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium ${showPreview ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => {
                  setShowCode(false);
                  setShowPreview(true);
                }}
                disabled={!generatedCode}
              >
                <Play size={16} className="inline mr-1" />
                Preview
              </button>
            </div>
          </div>
          
          {generatedReasoning && (
            <ReasoningProcess 
              reasoning={generatedReasoning}
              isMinimized={isReasoningMinimized}
              onToggle={() => setIsReasoningMinimized(!isReasoningMinimized)}
            />
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            <div className="flex flex-col">
              <textarea
                ref={promptInputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the feature you want to add to SageX..."
                className="w-full h-32 bg-glass rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isGenerating}
              />
              
              <div className="mt-4 text-sm text-gray-400">
                <p className="font-medium text-purple-400">Pro Tips:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Be specific in your description</li>
                  <li>Include details about UI elements and functionality</li>
                  <li>Try commands like "create a button component"</li>
                  <li>Or use voice commands by clicking the mic button</li>
                </ul>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <motion.button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="mr-2" />
                      Generate Code
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={() => setPrompt("")}
                  disabled={isGenerating || !prompt.trim()}
                  className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Clear prompt"
                >
                  <RefreshCcw size={18} />
                </motion.button>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Create button', 'Add card component', 'Chart visualization', 'User profile'].map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="py-1 px-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm text-gray-300 hover:text-white transition-colors text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-6 space-y-2 text-gray-200">
                <h3 className="text-lg font-semibold flex items-center">
                  <Settings className="mr-2 text-purple-400" size={18} />
                  <span>Development Tools</span>
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <motion.div
                    className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center justify-center"
                    whileHover={{ scale: 1.03, borderColor: 'rgba(147, 51, 234, 0.5)' }}
                  >
                    <Terminal size={24} className="text-purple-400 mb-2" />
                    <span className="text-sm">Terminal</span>
                  </motion.div>
                  <motion.div
                    className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center justify-center"
                    whileHover={{ scale: 1.03, borderColor: 'rgba(147, 51, 234, 0.5)' }}
                  >
                    <FileCode size={24} className="text-purple-400 mb-2" />
                    <span className="text-sm">Editor</span>
                  </motion.div>
                  <motion.div
                    className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center justify-center"
                    whileHover={{ scale: 1.03, borderColor: 'rgba(147, 51, 234, 0.5)' }}
                  >
                    <Bug size={24} className="text-purple-400 mb-2" />
                    <span className="text-sm">Debugger</span>
                  </motion.div>
                  <motion.div
                    className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center justify-center"
                    whileHover={{ scale: 1.03, borderColor: 'rgba(147, 51, 234, 0.5)' }}
                  >
                    <Braces size={24} className="text-purple-400 mb-2" />
                    <span className="text-sm">Linter</span>
                  </motion.div>
                  <motion.div
                    className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center justify-center"
                    whileHover={{ scale: 1.03, borderColor: 'rgba(147, 51, 234, 0.5)' }}
                  >
                    <RefreshCcw size={24} className="text-purple-400 mb-2" />
                    <span className="text-sm">Auto-fix</span>
                  </motion.div>
                  <motion.div
                    className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center justify-center"
                    whileHover={{ scale: 1.03, borderColor: 'rgba(147, 51, 234, 0.5)' }}
                  >
                    <Download size={24} className="text-purple-400 mb-2" />
                    <span className="text-sm">Deploy</span>
                  </motion.div>
                </div>
              </div>
            </div>
            
            <div>
              {showCode && (
                <CodeEditor code={generatedCode} language="jsx" onCopy={handleCopyCode} />
              )}
              
              {showPreview && generatedCode && (
                <LivePreview code={generatedCode} isLoading={isGenerating} />
              )}
              
              {!generatedCode && (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-900 rounded-lg border border-gray-800">
                  <Sparkles size={48} className="text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Development</h3>
                  <p className="text-gray-400 max-w-md mb-6">
                    Describe what you want to build, and the SageX AI Engine will generate the code for you.
                  </p>
                  <p className="text-purple-400 text-sm">
                    Try voice commands or type a prompt to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Updates;
