"use client"

import { cn } from "@/lib/utils";
import { motion } from "motion/react"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { JSX } from "react";

export default function DashboardNav({ allLinks }:
{
    allLinks: {
      label: string,
      path: string,
      icon: JSX.Element
    }[]
  }
) {

  const pathname = usePathname()

  return (
    <nav className={"pb-6 flex mb-4"}>
      <ul className={"flex gap-6 text-xs font-semibold"}>
        {allLinks.map((link, index) => (
          <motion.li whileTap={{ scale: 0.95 }} key={index}>
            <Link
              className={cn("flex gap-1 items-center flex-col relative", pathname === link.path && "text-primary")}
              href={link.path}
            >
              {link.icon}
              {link.label}
              {pathname === link.path ? (
                <motion.div
                  className="h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                />
              ) : null}
            </Link>
          </motion.li>
        ))}
      </ul>
    </nav>
  )
}
