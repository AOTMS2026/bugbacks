"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.",
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "hsl(var(--primary))",
          "hsl(var(--accent))",
          "hsl(var(--secondary))",
          "hsl(var(--muted))",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className="container py-20 mx-auto px-4 md:px-8">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-black dark:text-white">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg whitespace-pre-line text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="flex justify-center mb-10 text-black dark:text-white">
        <label className="relative inline-flex items-center cursor-pointer">
          <Label>
            <Switch
              ref={switchRef as any}
              checked={!isMonthly}
              onCheckedChange={handleToggle}
              className="relative"
            />
          </Label>
        </label>
        <span className="ml-2 font-semibold">
          Annual billing <span className="text-primary text-indigo-500">(Save 20%)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 1 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -30 : index === 0 ? 30 : 0,
                    scale: index === 0 || index === 2 ? 0.94 : 1.0,
                  }
                : {}
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: 0.4,
              opacity: { duration: 0.5 },
            }}
            className={cn(
              `rounded-2xl border-[1px] p-6 bg-white dark:bg-[#1a1a1a] text-center lg:flex lg:flex-col lg:justify-center relative shadow-xl`,
              plan.isPopular ? "border-indigo-500 border-2" : "border-black/10 dark:border-white/10",
              "flex flex-col",
              !plan.isPopular && "mt-5",
              index === 0 || index === 2
                ? "z-0 transform translate-x-0 translate-y-0 -translate-z-[50px] rotate-y-[10deg]"
                : "z-10",
              index === 0 && "origin-right",
              index === 2 && "origin-left"
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-indigo-500 py-0.5 px-3 rounded-bl-xl rounded-tr-xl flex items-center">
                <Star className="text-white h-4 w-4 fill-current" />
                <span className="text-white ml-1 font-sans font-semibold text-sm">
                  Popular
                </span>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <p className="text-base font-semibold text-gray-500 dark:text-gray-400">
                {plan.name}
              </p>
              <div className="mt-6 flex items-center justify-center gap-x-2 text-black dark:text-white">
                <span className="text-5xl font-bold tracking-tight">
                  <NumberFlow
                    value={
                      isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                    }
                    format={{
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }}
                    transformTiming={{
                      duration: 500,
                      easing: "ease-out",
                    }}
                    willChange
                    className="font-variant-numeric: tabular-nums"
                  />
                </span>
                {plan.period !== "Next 3 months" && (
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-500 dark:text-gray-400">
                    / {plan.period}
                  </span>
                )}
              </div>

              <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                {isMonthly ? "billed monthly" : "billed annually"}
              </p>

              <ul className="mt-5 gap-2 flex flex-col text-black dark:text-white">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-indigo-500 mt-1 flex-shrink-0" />
                    <span className="text-left">{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="w-full my-4 border-black/10 dark:border-white/10" />

              <Link
                to={plan.href}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter mt-auto rounded-full py-6",
                  "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-indigo-500 hover:ring-offset-1 hover:bg-indigo-500 hover:text-white",
                  plan.isPopular
                    ? "bg-indigo-500 text-white border-transparent"
                    : "bg-transparent text-black dark:text-white border-black/20 dark:border-white/20"
                )}
              >
                {plan.buttonText}
              </Link>
              <p className="mt-6 text-xs leading-5 text-gray-500 dark:text-gray-400">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
