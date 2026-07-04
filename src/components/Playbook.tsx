import { motion } from "motion/react"

const STAGES = [
  {
    title: "Probe",
    body: "Automatically find your competitors, effortlessly keeping tabs on their actions, marketing campaigns, budgets, social media presence, engagement, and sentiment from customers. Constant updates on Slack or WhatsApp keep you up to date with their every move. You'll know their next move before they do.",
  },
  {
    title: "Analyze",
    body: "Dissect their strategy, competitor reviews, posting patterns, and engagement on every post. Create detailed strategies, find the patterns of their weak spots, and know exactly where to hit for it to hurt.",
  },
  {
    title: "Orchestrate",
    body: "Autonomous posting, captions generated with relevant keywords and hashtags—all based on extensive, proven training data. We know what works. Who knew the secret to scaling was this close? Launch marketing campaigns with the push of a button, and watch your dashboard light up with green signals.",
  },
  {
    title: "Debrief",
    body: "Comprehensive reports. So you can see exactly how great you've been this past month.",
  },
  {
    title: "Dominate",
    body: "Leave them guessing, turn insights into action, and claim the top spot in your market. Become untouchable. Join the waitlist.",
  },
]

export default function Playbook() {
  return (
    <section className="relative flex flex-col items-center px-6 py-32 sm:py-40">
      {/* cele 5 stagii */}
      <div className="flex max-w-2xl flex-col gap-20">
        {STAGES.map((s) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-highlight sm:text-3xl">
              {s.title}.
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-muted">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
