'use client'

import {Button} from "@/components/ui/button";
import Link from "next/link";

export const BackButton = (
  {
    href,
    label
  }: {
    href: string;
    label: string;
  }
) => {
  return (
    <Button
      asChild
      variant={"link"}
      className={"flex w-full gap-4"}
    >
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  )
}
