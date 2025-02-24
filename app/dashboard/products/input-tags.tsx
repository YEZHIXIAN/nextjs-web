"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import * as React from "react";
import { Dispatch, forwardRef, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";

type InputTagsProps = React.ComponentProps<"input"> & {
  value: string[],
  onChange: Dispatch<SetStateAction<string[]>>
}

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(({ onChange, value, ...props }, ref) => {

  console.log(ref)
  const [pendingDataPoint, setPendingDataPoint] = useState("")
  const [focused, setFocused] = useState(false)

  function addPendingDataPoint() {
    if (pendingDataPoint) {
      const newDataPoints = new Set([...value, pendingDataPoint])
      onChange(Array.from(newDataPoints))
      setPendingDataPoint("")
    }
  }

  const { setFocus } = useFormContext()

  return (
    <div
      className={cn(
        "min-h-[80px] h-9" +
        "w-full rounded-md border-transparent " +
        "bg-transparent px-2 py-2 text-base shadow-sm " +
        "transition-colors file:border-0 file:bg-transparent " +
        "file:text-sm file:font-medium file:text-foreground " +
        "placeholder:text-muted-foreground focus-visible:outline-none " +
        "focus-visible:ring-1 focus-visible:ring-ring " +
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        ,
        focused
          ? "ring-offset-2 outline-none ring-ring ring-2"
          : "ring-offset-0 outline-none ring-ring ring-0"
      )}
      onClick={() => setFocus("tags")}
    >
      <motion.div
        className={"rounded-md min-h-[2.5rem] p-2 flex gap-2 flex-wrap items-center"}
      >
        <AnimatePresence>
          {value.map((tag, index) => (
            <motion.div
              animate={{ scale: 1 }}
              initial={{ scale: 0 }}
              key={index}
              exit={{ scale: 0 }}
              className={"flex items-center"}
            >
              <Badge>{tag}</Badge>
              <Button
                className={"h-5 w-0"}
                onClick={() => onChange(value.filter((i) => i !== tag))}>
                <XIcon/>
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className={"flex"}>
          <Input
            className="border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 "
            placeholder={"Add tags"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addPendingDataPoint()
              }
              if (e.key === "Backspace" && !pendingDataPoint && value.length > 0) {
                e.preventDefault()
                const newValue = [...value]
                newValue.pop()
                onChange(newValue)
              }
            }}
            value={pendingDataPoint}
            onFocus={() => setFocused(true)}
            onBlurCapture={() => setFocused(false)}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            {...props}
          />
        </div>
      </motion.div>

    </div>
  )
})

InputTags.displayName = "InputTags"
