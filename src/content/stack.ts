import type { TimelineTone } from "./timeline";

export interface StackGroup {
  code: string;
  tone: TimelineTone;
  title: string;
  items: string[];
}

export const stackGroups: StackGroup[] = [
  { code: "FE", tone: "gold", title: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"] },
  { code: "BE", tone: "steel", title: "Backend", items: ["Laravel", "FastAPI", "Supabase", "PostgreSQL", "Railway"] },
  { code: "MB", tone: "lilac", title: "Mobile", items: ["Flutter", "Dart", "REST API"] },
  { code: "3D", tone: "sky", title: "AI & 3D", items: ["Gemini API", "Claude API", "Python", "Three.js", "Blender"] },
];
