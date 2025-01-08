"use client"

import {UploadButton} from "@/app/api/uploadthing/upload";
import {FormError} from "@/components/auth/form-error";
import {FormSuccess} from "@/components/auth/form-success";
import { Avatar } from "@/components/ui/avatar";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {settings} from "@/server/actions/settings";
import {SettingsSchema} from "@/types/settings-schema";
import {Session} from "next-auth";
import {zodResolver} from "@hookform/resolvers/zod"
import {useAction} from "next-safe-action/hooks";
import Image from "next/image";
import {useState} from "react";
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Switch} from "@/components/ui/switch";


type SettingsForm = {
  session: Session
}

export default function SettingsCard(session: SettingsForm) {

  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [avatarUploading, setAvatarUploading] = useState(false)

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: session.session.user?.name || undefined,
      password: undefined,
      newPassword: undefined,
      image: session.session.user?.image || undefined,
      isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || undefined,
    }
  })

  const {execute, status} = useAction(settings, {
    onSuccess: (data) => {
      if (data?.success) {
        setSuccess(data.success)
      }
      if (data?.error) {
        setError(data.error)
      }
    },
    onError: (error) => {
      console.log(error)
      setError("Something went wrong")
    }
  })

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    execute(values)
  }

  console.log(session)
  return (
    <Card className={"mb-10"}>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John/Jane Doe" disabled={status === "executing"} {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className={"flex items-center gap-4"}>
                    {!form.getValues("image") && (
                      <div className={"font-bold"}>
                        {session.session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Avatar className={"w-7 h-7"}>
                        <Image
                          src={form.getValues("image")!}
                          fill={true}
                          alt={"User Image"}
                        />
                      </Avatar>
                    )}
                    <UploadButton
                      className={"scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"}
                      endpoint={"avatarUploader"}
                      onUploadBegin={() => setAvatarUploading(true)}
                      onUploadError={(error) => {
                        form.setError("image", {
                          type: "validate",
                          message: error.message,
                        })
                        setAvatarUploading(false)
                        return
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue("image", res[0].url!)
                        setAvatarUploading(false)
                        return
                      }}
                      content={{
                        button({ready}) {
                          if (ready) {
                            return <div>Change Avatar</div>
                          }
                          return <div>Uploading...</div>
                        },
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input type={"hidden"} placeholder="User Image"
                           disabled={status === "executing"} {...field} />

                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******"
                           disabled={status === "executing" || session.session.user.isOAuth} {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******"
                           disabled={status === "executing" || session.session.user.isOAuth} {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="abc@gmail.com" disabled={status === "executing"} {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account.
                  </FormDescription>
                  <FormControl>
                    <Switch
                      disabled={status === "executing" || session.session.user.isOAuth}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormError message={error}/>
            <FormSuccess message={success}/>
            <Button disabled={status === "executing" || avatarUploading} type="submit">Update</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>

  )
}
