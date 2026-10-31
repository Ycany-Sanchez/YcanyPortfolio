export interface ProjectRecognition {
  title: string;
  event: string;
}

export interface ProjectMedia {
  src: string;
  alt: string;
  caption: string;
}

export interface Project {
  slug: string;
  name: string;
  number: string;
  category: string;
  tagline: string;
  summary: string;
  roles: string[];
  stack: string[];
  recognition: ProjectRecognition[];
  sourceUrl?: string;
  sourceLabel?: string;
  media: ProjectMedia[];
  featured: boolean;
  color: "blue" | "dark" | "sage" | "sand" | "slate";
  status: string;
}

export const profile = {
  name: "Ycany Ashra T. Sanchez",
  shortName: "Ycany",
  email: "ycanyashra.sanchez2006@gmail.com",
  github: "https://github.com/Ycany-Sanchez",
  linkedin: "https://www.linkedin.com/in/ycany-ashra-sanchez-bb987937a/",
  leetcode: "https://leetcode.com/u/Ikanida/",
  resumeHref: "/media/resume.pdf",
  location: "Cebu City, Philippines",
  school: "Cebu Institute of Technology – University",
  program: "Bachelor of Science in Computer Science",
  educationDates: "2024–2028",
} as const;

export const projects: Project[] = [
  {
    slug: "parola",
    name: "Parola",
    number: "01",
    category: "AI & fisheries",
    tagline: "Ocean data. Practical direction.",
    summary:
      "A Team TIKI project connecting ocean and satellite data with fishing advisories, designed to reach Filipino fisherfolk through SMS.",
    roles: ["Ideator", "API integrator", "Backend developer", "Workflow developer"],
    stack: ["Python", "Machine learning", "Ocean & satellite data", "REST APIs", "n8n", "SMS integration"],
    recognition: [
      { title: "Top 25 qualifier", event: "Philippine Startup Challenge 11 — Central Visayas" },
      { title: "Special Awardee — Best Logo", event: "Philippine Startup Challenge 11 — Central Visayas" },
      { title: "Top 5 finalist", event: "Iloilo AI Fest Hackathon Championship 2026" },
    ],
    sourceUrl: "https://www.linkedin.com/feed/update/urn:li:activity:7515284028795625472/",
    sourceLabel: "Project background",
    media: [
      {
        src: "/media/parola-psc-xi.webp",
        alt: "Philippine Startup Challenge announcement naming Parola and Team TIKI a Central Visayas Top 25 qualifier.",
        caption: "Team TIKI · Central Visayas Top 25 qualifier, Philippine Startup Challenge 11.",
      },
      {
        src: "/media/parola-iloilo-2026.webp",
        alt: "CIT-U announcement showing the Parola team and its Top 5 finalist result at AI Fest Hackathon Championship 2026 in Iloilo.",
        caption: "CIT-U announcement, 7 August 2026 · Top 5 finalist, AI Fest Hackathon Championship 2026, Iloilo.",
      },
    ],
    featured: true,
    color: "blue",
    status: "Competition project · Team TIKI",
  },
  {
    slug: "bantai-buddy",
    name: "BantAI Buddy",
    number: "02",
    category: "AI & online safety",
    tagline: "Screen the message. Explain the concern.",
    summary:
      "A browser extension pairing AI-assisted message screening with educational explanations, supported by a Node.js orchestration backend.",
    roles: ["Ideator", "Backend developer", "API integrator"],
    stack: ["Node.js", "Express", "JavaScript", "Chrome Manifest V3", "LLM APIs", "Python regression testing"],
    recognition: [
      { title: "Top 2 · among 28 teams", event: "IBPAP Can You HackIt? Challenge 2025" },
    ],
    sourceUrl: profile.linkedin,
    sourceLabel: "Project background",
    media: [
      {
        src: "/media/bantai-hackit-2025.webp",
        alt: "CIT-U College of Computer Studies announcement showing O1 Developers and its Top 2 result at the IBPAP challenge in July 2025.",
        caption: "16 July 2025 · O1 Developers, CIT-U · Top 2, Can You HackIT? The IBPAP Challenge 2025.",
      },
    ],
    featured: true,
    color: "dark",
    status: "Hackathon project · 1.0.0 architecture",
  },
  {
    slug: "tinhealth",
    name: "+inHealth",
    number: "03",
    category: "Desktop & application architecture",
    tagline: "Everyday health, connected.",
    summary:
      "A JavaFX desktop health tracker bringing meal logging, activity records, nutrition lookups, and movement prompts into one application.",
    roles: ["Backend developer", "API integrator", "Database developer"],
    stack: ["Java", "JavaFX", "MySQL", "Nutrition API", "Gson", "Maven", "JUnit"],
    recognition: [],
    sourceUrl: "https://github.com/Gianne818/tinHealth",
    sourceLabel: "Explore source code",
    media: [],
    featured: true,
    color: "sage",
    status: "Course project · CSIT228 · 2026",
  },
  {
    slug: "imentia",
    name: "IMentia",
    number: "04",
    category: "Computer vision & desktop",
    tagline: "A familiar face. A remembered connection.",
    summary:
      "A Java application exploring face recognition, saved profiles, and meeting notes for people with dementia and their caregivers.",
    roles: ["Backend developer"],
    stack: ["Java", "OpenCV", "Maven", "Local file storage"],
    recognition: [],
    sourceUrl: "https://github.com/Ycany-Sanchez/IMentia",
    sourceLabel: "Explore source code",
    media: [],
    featured: false,
    color: "slate",
    status: "Application project · Source available",
  },
  {
    slug: "foodpantry",
    name: "FoodPantry",
    number: "05",
    category: "Android & API integration",
    tagline: "Start with what you have.",
    summary:
      "An ingredient-first Android recipe app connecting pantry ingredients with recipe suggestions through the Spoonacular API.",
    roles: ["Full-stack developer"],
    stack: ["Kotlin", "Android", "Retrofit", "Spoonacular API"],
    recognition: [],
    sourceUrl: "https://github.com/Ycany-Sanchez/FoodPantry",
    sourceLabel: "Explore source code",
    media: [],
    featured: false,
    color: "sand",
    status: "Mobile development project · Source available",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
