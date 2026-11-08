import { createFileRoute, Link } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ContactFooter } from "@/components/ContactFooter";
import { usePosts } from "@/hooks/use-posts";
import { formatDate } from "@/lib/posts";
import { SITE } from "@/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daanish Sharma" },
      { name: "description", content: SITE.description },
      { property: "og:title", content: "Daanish Sharma" },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Daanish Sharma",
          jobTitle: "Solutions Engineer (Applied AI Engineering)",
          worksFor: { "@type": "Organization", name: "TELUS Digital AI" },
          email: "mailto:daanish1sharma@gmail.com",
          address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
          alumniOf: "Thapar Institute",
          sameAs: ["https://github.com/daanishsharma", "https://linkedin.com/in/daanish-sharma-a7a828196"],
        }),
      },
    ],
  }),
  component: Index,
});

const experience = [
  {
    company: "TELUS Digital AI (Playment)",
    title: "Solutions Engineer (Applied AI Engineering)",
    dates: "Nov 2024 to Present",
    bullets: [
      "Designed and deployed a FastAPI-based AI coding-problem evaluation service on AWS EKS, screening submissions for validity, answer leakage, and duplicates before scheduling isolated AWS Batch evaluation jobs.",
      "Integrated Claude Code with Harbour sandbox environments to run five independent solver attempts graded against rubrics, plus a sixth judge-only run assessing the human-submitted solution directly. Reported pass@5, pass/fail outcomes, and 0 to 10 rubric scores.",
      "Built an end-to-end GenAI data pipeline processing 40K plus hours of conversational audio using Python, the OpenAI SDK for metadata extraction, PGVector for retrieval, and BigQuery and Cloud Storage on GCP. Coordinated containerized workers with PostgreSQL advisory locks to prevent duplicate processing.",
      "Built reusable Python and FastAPI ingestion integrations using REST APIs and Bright Data proxy infrastructure.",
    ],
  },
  {
    company: "Tredence Inc.",
    title: "Software Engineer",
    dates: "Jun 2023 to Nov 2024",
    bullets: [
      "Built production data pipelines using PySpark, Azure Databricks, Azure Data Factory, and HDFS, including cluster provisioning via API, job scheduling, and performance tuning.",
      "Built cloud data integration infrastructure using Terraform and Azure DevOps.",
      "Contributed reusable validation and monitoring components to an internal data quality tool.",
    ],
  },
  {
    company: "Samsung SDS",
    title: "SDE Intern",
    dates: "Mar 2023 to Jun 2023",
    bullets: [
      "Built full-stack features with React (TypeScript), Java Spring Boot, and MySQL, including REST APIs, reusable UI components, and unit tests.",
    ],
  },
];

const projects = [
  {
    title: "Micrograd from scratch",
    desc: "Scalar autograd engine with reverse-mode differentiation. Trained a small MLP on MNIST to understand backprop end to end.",
    tags: ["Python", "NumPy"],
    url: "https://github.com/DaanishSharma/micrograd/blob/main/micrograd-mnist.ipynb",
  },
  {
    title: "Game Playing AIs",
    desc: "Minimax, A star, Q-learning, and backtracking implementations across several game environments.",
    tags: ["Python"],
    url: "https://github.com/DaanishSharma/Game-playing-AIs",
  },
];

const skills: [string, string[]][] = [
  ["Languages", ["Python", "TypeScript", "SQL", "C++", "Java"]],
  ["Applied AI", ["LLM evaluation", "rubric-based grading", "agentic workflows", "RAG", "vector search", "OpenAI SDK", "Claude Code"]],
  ["Backend", ["FastAPI", "Flask", "REST", "React", "Spring Boot"]],
  ["Cloud", ["AWS (EKS, Batch)", "GCP", "Azure", "Docker", "Kubernetes", "Terraform"]],
  ["Data and ML", ["PostgreSQL", "PGVector", "PySpark", "Databricks", "BigQuery", "PyTorch", "scikit-learn", "MLflow"]],
];

function Index() {
  const { data: posts, isLoading } = usePosts();
  return (
    <div className="fade-in">
      <SiteHeader />
      <main className="mx-auto max-w-[960px] px-6">
        <section className="py-16 sm:py-24">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Daanish Sharma</h1>
          <p className="mt-4 text-lg text-foreground/90">
            Applied AI engineer. Building LLM evaluation and data infrastructure at TELUS Digital AI.
          </p>
          <p className="mt-6 max-w-[680px] leading-relaxed text-muted-foreground">
            I work on applied AI systems: evaluation harnesses for LLM coding agents, data pipelines for large-scale
            conversational audio, and the infrastructure around both. Previously I built production data pipelines on
            Azure Databricks at Tredence.
          </p>
        </section>

        <section className="py-10">
          <h2 className="section-label">01 / Experience</h2>
          <div className="space-y-12">
            {experience.map((e) => (
              <article key={e.company}>
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <h3 className="font-medium">
                    {e.company} <span className="text-muted-foreground">· {e.title}</span>
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">{e.dates}</span>
                </div>
                <ul className="mt-3 max-w-[760px] list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-accent">
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-12 font-mono text-xs text-muted-foreground">
            B.E. Computer Engineering, Thapar Institute, 2019 to 2023. CGPA 8.29.
          </p>
        </section>

        <section className="py-10">
          <h2 className="section-label">02 / Projects</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <a key={p.title} href={p.url} target="_blank" rel="noreferrer" className="group rounded-md border border-border p-5 transition-colors hover:border-accent/60">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{p.title}</h3>
                  <Github className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <div className="mt-4 flex gap-2 font-mono text-[11px] text-muted-foreground">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded border border-border px-1.5 py-0.5">{t}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="py-10">
          <h2 className="section-label">03 / Skills</h2>
          <dl className="space-y-3 text-sm">
            {skills.map(([k, v]) => (
              <div key={k} className="grid gap-1 sm:grid-cols-[140px_1fr]">
                <dt className="font-mono text-xs leading-6 text-muted-foreground">{k}</dt>
                <dd className="leading-6">{v.join("  ·  ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="py-10">
          <h2 className="section-label">04 / Writing</h2>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading posts.</p>
          ) : !posts?.length ? (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            <ul className="space-y-5">
              {posts.slice(0, 3).map((p) => (
                <li key={p.slug}>
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                    <span className="font-mono text-xs text-muted-foreground">{formatDate(p.date)}</span>
                    <h3 className="font-medium group-hover:text-accent">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link to="/blog" className="mt-6 inline-block font-mono text-xs text-accent hover:underline">
            See all posts →
          </Link>
        </section>
      </main>
      <div className="pt-10">
        <ContactFooter />
      </div>
    </div>
  );
}
