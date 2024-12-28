import Logo from "@/components/navigation/logo";
import {UserButton} from "@/components/navigation/user-button";
import {Button} from "@/components/ui/button";
import {auth} from "@/server/auth"
import {LogIn} from "lucide-react";
import Link from "next/link";

export default async function Nav() {
  const session = await auth();
  return (
    <header className={"py-8"}>
      <nav>
        <ul className={"flex justify-between"}>
          <li>
              <Link href={"/"}>
                <Logo />
              </Link>
          </li>
          {
            !session
              ? (
                <li>
                  <Button asChild>
                    <Link className={"flex gap-2"} href={"/auth/login"}>
                      <LogIn/>
                      Log In
                    </Link>
                  </Button>
                </li>
              )
              : (
                <li>
                  <UserButton expires={session?.expires} user={session?.user}/>
                </li>
              )
          }
        </ul>
      </nav>
    </header>
  )
}
