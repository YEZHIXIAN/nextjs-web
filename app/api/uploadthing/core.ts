import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {

  avatarUploader: f({
    image: {

      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .onUploadComplete(
      async () => {}
    ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
