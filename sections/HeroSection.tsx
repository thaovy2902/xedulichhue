'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background to-muted">
      {/* Background decoration */}
      <div
        className="absolute inset-0 -z-10 opacity-40 dark:opacity-20"
        aria-hidden="true"
      >
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <Container className="py-20 md:py-32">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Tourism Transportation</span>
          </motion.div>

          {/* Heading - fill in your copy */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {/* Placeholder - replace with actual headline */}
            <span className="block">Travel Further,</span>
            <span className="block text-primary">Arrive Comfortably</span>
          </motion.h1>

          {/* Subheading - placeholder */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg text-muted-foreground max-w-xl"
          >
            {/* Replace with actual description */}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Button size="xl" asChild>
              <Link href="/book">
                Book a Trip
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/services">Our Services</Link>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
