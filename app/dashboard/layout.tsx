import DashboardNav from "@/components/navigation/dashboard-nav";
import { auth } from "@/server/auth";
import { BarChart, Package, PenSquare, Settings, Truck } from "lucide-react";
import React from "react";


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

  const session = await auth()

  const userLinks = [
    {
      label: "Orders",
      path: "/dashboard/orders",
      icon: <Truck/>,
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings/>,
    }
  ] as const

  const adminLinks = session?.user.role === "admin" ? [
    {
      label: "Analytics",
      path: "/dashboard/analytics",
      icon: <BarChart/>,
    },
    {
      label: "Create",
      path: "/dashboard/add-product",
      icon: <PenSquare/>,
    },
    {
      label: "Products",
      path: "/dashboard/products",
      icon: <Package/>,
    }
  ] : []

  const allLinks = [...userLinks, ...adminLinks]

  return (
    <div>
      <DashboardNav allLinks={allLinks}/>
      { children }
    </div>
  )
}
