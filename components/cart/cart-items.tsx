"use client"

import { Button } from "@/components/ui/button";
import { DrawerTitle } from "@/components/ui/drawer";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useCartStore } from "@/lib/client-store";
import formatPrice from "@/lib/format-price";
import { AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { MinusCircle, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useMemo } from "react";
import emptyCart from "@/public/empty-box.json"
import { createId } from "@paralleldrive/cuid2"

export default function CartItems() {
  const { cart, addToCart, setCheckoutProgress } = useCartStore()

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.variant.quantity, 0)
  }, [cart])

  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map(
      (letter) => ({ letter, id: createId() })
    )
  }, [totalPrice])

  return (

    <motion.div className={"flex flex-col items-center"}>
      <motion.div className={"flex items-center justify-center mb-4"}>
        <span className={"text-md"}>Total: $</span>
        <AnimatePresence mode={"popLayout"}>
          {priceInLetters.map(
            (letter, i) => (
              <motion.div key={letter.id} className={""}>
                <motion.span
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  exit={{ y: -10 }}
                  transition={{ delay: i * 0.1 }}
                  className={"text-md inline-block"}
                >
                  {letter.letter}
                </motion.span>

              </motion.div>
            )
          )}
        </AnimatePresence>
      </motion.div>

      {cart.length === 0
        ? (
          <div className={"flex-col w-full flex items-center justify-center"}>
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Lottie className={"h-64"} animationData={emptyCart}/>
            </motion.div>
          </div>
        )
        : (
          <div className={"h-88 w-full overflow-y-auto"}>
            <Table className={"max-w-2xl mx-auto"}>
              <TableHeader>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {cart.map(
                  (item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{formatPrice(item.price)}</TableCell>
                      <TableCell>
                        <Image
                          className={"rounded-md"}
                          priority
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                        />
                      </TableCell>
                      <TableCell>
                        <div className={"flex items-center justify-between"}>
                          <MinusCircle
                            size={14}
                            className={"cursor-pointer hover:text-muted-foreground"}
                            onClick={() => addToCart({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                              variant: {
                                variantID: item.variant.variantID,
                                quantity: -1,
                              },
                            })}
                          />
                          <p className={"text-md font-bold"}>{item.variant.quantity}</p>
                          <PlusCircle
                            size={14}
                            className={"cursor-pointer hover:text-muted-foreground"}
                            onClick={() => addToCart({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                              variant: {
                                variantID: item.variant.variantID,
                                quantity: 1,
                              },
                            })}
                          />
                        </div>
                      </TableCell>

                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        )
      }

      {cart.length > 0 && (
        <Button
          className={"mt-6 max-w-md w-full"}
          onClick={() => setCheckoutProgress("payment-page")}
        >
          Checkout
        </Button>
      )}
    </motion.div>
  )
}
