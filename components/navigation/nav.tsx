import CartDrawer from "@/components/cart/cart-drawer";
import {UserButton} from "@/components/navigation/user-button";
import {Button} from "@/components/ui/button";
import {auth} from "@/server/auth"
import { HomeIcon, LogIn } from "lucide-react";
import Link from "next/link";

export default async function Nav() {
  const session = await auth()

  return (
    <header className={"py-8"}>
      <nav>
        <ul className={"flex justify-between items-center"}>
          <li className={"flex flex-row"}>
            <Link href={"/"} aria-label={"logo"}>
              <Button variant={"ghost"} className={"group flex items-center"}>
                <HomeIcon className={"group-hover:scale-90 transition-all duration-300 ease-in-out"}/>
                <p className={"text-sm"}>Home</p>
                <p className={"text-xs"}>(≧▽≦)</p>
              </Button>
            </Link>
            <CartDrawer/>

          </li>
          {!session ? (
            <li>
              <Button asChild>
                <Link className={"flex gap-2"} href={"/auth/login"}>
                  <LogIn/>
                  Log In
                </Link>
              </Button>
            </li>
          ) : (
            <li className={"flex items-center gap-3"}>
              <UserButton expires={session?.expires} user={session?.user}/>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
