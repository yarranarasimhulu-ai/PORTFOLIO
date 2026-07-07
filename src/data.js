// ─────────────────────────────────────────────────────────────
// ALL portfolio content lives in this file. Edit here to update
// the site — no component changes needed.
// TODO(you): replace every URL containing "your-" below.
// ─────────────────────────────────────────────────────────────

export const player = {
  name: 'YERRA NARASIMHULU',
  initials: 'YN',
  title: 'AI ENGINEER',
  tagline: 'LLM apps · RAG pipelines · AI agents · Full-stack AI',
  location: 'Nellore, Andhra Pradesh, India',
  status: 'OPEN TO OPPORTUNITIES',
  email: 'yarranarasimhulu@gmail.com',
  phone: '+91 8008632510',
  github: 'https://github.com/your-github-username', // TODO: real URL
  linkedin: 'https://www.linkedin.com/in/your-linkedin-id', // TODO: real URL
  resumeFile: '/resume.pdf', // served from public/resume.pdf
  summary:
    'AI Engineer with hands-on experience building LLM-powered applications, intelligent agent systems and full-stack AI products. Skilled in RAG pipelines, prompt engineering, LangChain workflows and AI agent development. Currently delivering production-grade AI solutions at The Energy Lab.',
  education: {
    degree: 'B.Tech — Information Technology',
    college: 'NBKR Institute of Science and Technology, Vidyanagar',
    years: '2022 – 2026',
    cgpa: '7.5 / 10.0',
  },
}

export const menu = [
  { id: 'profile', label: 'PROFILE', hint: 'About me & education' },
  { id: 'projects', label: 'PROJECTS', hint: '3 built · 1 live demo' },
  { id: 'techstack', label: 'TECH STACK', hint: 'Tools I work with' },
  { id: 'experience', label: 'EXPERIENCE', hint: 'Work history' },
  { id: 'certifications', label: 'CERTIFICATIONS', hint: '6 earned' },
  { id: 'contact', label: 'CONTACT', hint: 'Hire me · get in touch' },
]

export const skills = [
  {
    tab: 'AI / ML',
    subtitle: 'Core AI engineering',
    items: [
      { name: 'Prompt Engineering', value: 92 },
      { name: 'RAG Pipelines', value: 90 },
      { name: 'AI Agents', value: 88 },
      { name: 'LLM Integration', value: 87 },
      { name: 'Context Engineering', value: 84 },
      { name: 'LLMOps', value: 78 },
      { name: 'LoRA Fine-tuning', value: 74 },
    ],
  },
  {
    tab: 'FRAMEWORKS',
    subtitle: 'Languages & frameworks',
    items: [
      { name: 'Python', value: 92 },
      { name: 'LangChain', value: 90 },
      { name: 'FastAPI', value: 86 },
      { name: 'LangGraph', value: 84 },
      { name: 'Streamlit', value: 82 },
      { name: 'HuggingFace', value: 80 },
      { name: 'React', value: 76 },
      { name: 'PyTorch', value: 72 },
    ],
  },
  {
    tab: 'TOOLS',
    subtitle: 'Tools & platforms',
    items: [
      { name: 'Git / GitHub', value: 88 },
      { name: 'SQL / MySQL', value: 86 },
      { name: 'Groq API', value: 85 },
      { name: 'Java', value: 82 },
      { name: 'Railway', value: 80 },
      { name: 'Docker', value: 74 },
    ],
  },
]

export const projects = [
  {
    category: 'AI TREND ANALYSIS PLATFORM',
    name: 'TrendPulse AI',
    period: 'May 2026 – Jun 2026',
    complexity: 4,
    status: 'COMPLETED',
    live: null,
    repo: 'https://github.com/your-github-username/trendpulse-ai', // TODO
    briefing:
      'AI-driven trend analysis platform that identifies and summarizes emerging topics from live online data sources.',
    intel: [
      'LLM-powered pipelines detect and summarize emerging trends in real time',
      'Interactive React dashboard with live trend visualization and actionable insights',
    ],
    loadout: ['Python', 'FastAPI', 'React', 'LLMs', 'AI Agents'],
  },
  {
    category: 'AI AGENT · DEPLOYED APP',
    name: 'Weather Agent',
    period: 'Mar 2026 – Apr 2026',
    complexity: 3,
    status: 'LIVE',
    live: 'https://your-weather-agent.up.railway.app', // TODO
    repo: 'https://github.com/your-github-username/weather-agent', // TODO
    briefing:
      'AI weather intelligence agent giving real-time forecasts and location-based climate insights through natural conversation.',
    intel: [
      'Agent-based workflows wired to external weather APIs',
      'Deployed on Railway with a responsive React frontend — publicly accessible',
    ],
    loadout: ['Python', 'FastAPI', 'React', 'Weather APIs', 'Railway'],
  },
  {
    category: 'RAG CHATBOT',
    name: 'AI Chatbot',
    period: 'Jan 2026 – Feb 2026',
    complexity: 3,
    status: 'COMPLETED',
    live: null,
    repo: 'https://github.com/your-github-username/ai-chatbot', // TODO
    briefing:
      'LangChain + Groq API chatbot for project-planning queries with document-aware answers.',
    intel: [
      'Document-aware RAG workflows with persistent conversation memory',
      'Context-aware responses that boost user productivity',
    ],
    loadout: ['Python', 'LangChain', 'Groq API', 'Streamlit', 'FastAPI'],
  },
]

export const techStack = [
  { name: 'Python', level: 'expert', type: 'Language' },
  { name: 'LangChain', level: 'expert', type: 'AI Framework' },
  { name: 'RAG Pipelines', level: 'expert', type: 'AI Technique' },
  { name: 'FastAPI', level: 'advanced', type: 'Backend Framework' },
  { name: 'LangGraph', level: 'advanced', type: 'Agent Framework' },
  { name: 'React', level: 'advanced', type: 'Frontend Library' },
  { name: 'LangSmith', level: 'advanced', type: 'LLM Observability' },
  { name: 'Groq API', level: 'advanced', type: 'LLM Inference' },
  { name: 'Git / GitHub', level: 'advanced', type: 'Version Control' },
  { name: 'HuggingFace', level: 'proficient', type: 'ML Platform' },
  { name: 'PyTorch', level: 'proficient', type: 'Deep Learning' },
  { name: 'Streamlit', level: 'proficient', type: 'UI Framework' },
  { name: 'Docker', level: 'proficient', type: 'Containers' },
  { name: 'MySQL', level: 'proficient', type: 'Database' },
  { name: 'Railway', level: 'proficient', type: 'Deployment' },
  { name: 'Scikit-learn', level: 'familiar', type: 'ML Library' },
]

export const experience = [
  {
    status: 'CURRENT',
    role: 'Artificial Intelligence Engineer',
    org: 'The Energy Lab',
    mode: 'On-site · Warangal, Telangana',
    period: 'Feb 2026 – Present',
    highlights: [
      'Designing and shipping production LLM solutions — prompt engineering, RAG, AI agents and LangChain pipelines that improve real business workflows',
      'Applying context engineering, LLMOps and LoRA fine-tuning to deliver scalable AI systems in a fast-paced startup',
    ],
  },
  {
    status: 'COMPLETED',
    role: 'SQL Intern',
    org: 'Slash Mark IT Solutions Pvt. Ltd.',
    mode: 'Remote',
    period: 'Dec 2025 – Apr 2026',
    highlights: [
      'Strengthened database design, querying and optimization at an ISO 9001:2015, DPIIT-recognized organization',
      'Solved real-world structured-data problems for reporting and analysis use cases',
    ],
  },
]

export const certifications = [
  {
    icon: '🏅',
    title: 'GfG 160 Days',
    desc: '160 Days of Problem Solving — DSA & algorithmic thinking',
    tier: 'gold',
  },
  {
    icon: '⭐',
    title: 'HackerRank 5★ Java',
    desc: 'Five-star rating in Java problem solving',
    tier: 'gold',
  },
  {
    icon: '⭐',
    title: 'HackerRank 5★ SQL',
    desc: 'Five-star rating in SQL & database skills',
    tier: 'gold',
  },
  {
    icon: '🤖',
    title: 'IBM SkillsBuild AI',
    desc: 'Artificial Intelligence Fundamentals — AI, ML & NLP basics',
    tier: 'silver',
  },
  {
    icon: '🔗',
    title: 'LangChain Academy',
    desc: 'Foundation: Introduction to LangChain — Python (Apr 2026)',
    tier: 'silver',
  },
  {
    icon: '🛰️',
    title: 'LangSmith Fleet',
    desc: 'Quickstart: LangSmith Fleet — LangChain Academy (Apr 2026)',
    tier: 'silver',
  },
]
