'use client'

import {AuthCard} from "@/components/auth/auth-card";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {LoginSchema} from "@/server/types/login-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import * as z from "zod"

export const LoginForm = () => {

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log(values);
  }

  return (
    <AuthCard
      cardTitle={"Welcome back!"}
      backButtonHref={"/auth/register"}
      backButtonLabel={"Create a new account"}
      showSocials
    >
      <div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name={"email"}
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={"email"}
                        placeholder={"abc@gmail.com"}
                        autoComplete={"email"}
                      />
                    </FormControl>
                    <FormDescription/>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"password"}
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={"********"}
                        type={"password"}
                        autoComplete={"current-password"}
                      />
                    </FormControl>
                    <FormDescription/>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <Button size={"sm"} variant={"link"} asChild>
                <Link href={"/auth/reset"}>Forgot your password</Link>
              </Button>
            </div>
            <Button type={"submit"} className={"w-full my-2"}>
              {"Login"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  )
}
