'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const UserButton = ({ user }: Session) => {
  const { setTheme, theme } = useTheme()
  const [checked, setChecked] = useState(false)
  const router = useRouter()

  function setSwitchState() {
    switch (theme) {
      case "dark":
        return setChecked(true)
      case "light":
        return setChecked(false)
      case "system":
        return setChecked(false)
    }
  }

  useEffect(() => {
    setSwitchState()
  }, [])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="w-9 h-9">
          {user?.image && (
            <Image
              src={user.image}
              alt={user.name!}
              fill={true}
              objectFit={"cover"}
            />
          )}
          {!user?.image && (
            <AvatarFallback className="bg-primary/25">
              <div className="font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={"w-64 p-6"} align={"end"}>
        <div className={"mb-4 p-4 flex flex-col gap-1 items-center rounded-lg bg-primary/10"}>
          {user?.image && (
            <Avatar className={"w-7 h-7"}>
              <Image
                src={user.image}
                alt={user.name!}
                fill={true}/>
            </Avatar>

          )}
          <p className={"font-bold text-xs"}>{user?.name}</p>
          <span className={"text-xs font-medium text-secondary-foreground"}>
            {user?.email}
          </span>
        </div>
        <DropdownMenuSeparator/>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/orders")}
          className={"group py-2 font-medium cursor-pointer transition-all duration-500"}>
          <TruckIcon className={"group-hover:translate-x-1 transition-all duration-300 ease-in-out"}/>
          Orders
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/dashboard/settings")}
          className={"group py-2 font-medium cursor-pointer transition-all duration-500"}>
          <Settings className={"group-hover:rotate-180 transition-all duration-300 ease-in-out"}/> Settings
        </DropdownMenuItem>
        <DropdownMenuItem className={"py-2 font-medium cursor-pointer transition-all duration-500"}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={"flex items-center group"}>
            <div className={"relative flex mr-2.5"}>
              <Sun size={"14"}
                   className={"dark:scale-0 absolute dark:-rotate-90 group-hover:text-yellow-600 group-hover:rotate-180 transition-all duration-500 ease-in-out"}/>
              <Moon size={"14"}
                    className={"dark:scale-100 scale-0 group-hover:text-blue-400"}/>
            </div>
            <p>
              <span
                className={"dark:text-blue-400 text-yellow-500 text-secondary-foreground/75 text-xs font-bold"}>
                {theme != null ? theme[0].toUpperCase() + theme.slice(1) : ""} Mode
              </span>
            </p>
            <Switch
              className={"scale-75 ml-2"}
              checked={checked}
              onCheckedChange={(e) => {
                setChecked((prev) => !prev)
                console.log(e)
                if (e) {
                  setTheme("dark")
                }
                if (!e) {
                  setTheme("light")
                }
              }}/>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut()}
          className={"group focus:bg-destructive/25 py-2 font-medium cursor-pointer transition-all duration-500"}>
          <LogOut className={"group-hover:scale-90 transition-all duration-300 ease-in-out"}/>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}
