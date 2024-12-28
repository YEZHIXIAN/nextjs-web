'use client'

import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";
import {FaGithub} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";


export default function Socials() {
  return (
    <div className={"flex flex-col items-center w-full gap-4"}>
      <Button
        variant={"outline"}
        className={"flex w-full gap-4"}
        onClick={() =>
          signIn(
            "google",
            {redirect: false}
          )
        }
      >
        <p>Sign in with Google</p>
        <FcGoogle className={"w-5 h-5"}/>
      </Button>

      <Button
        variant={"outline"}
        className={"flex w-full gap-4"}
        onClick={() =>
          signIn(
            "github",
            {
              redirect: false
            }
          )
        }
      >
        <p>Sign in with GitHub</p>
        <FaGithub className={"w-5 h-5"}/>
      </Button>
    </div>
  )
}
