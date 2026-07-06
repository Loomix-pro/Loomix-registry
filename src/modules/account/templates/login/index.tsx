import { notFound } from "next/navigation"

export type LoginMethods = "email" | "phone" | "both"

export default async function LoginTemplateSwitcher({
  loginMethods = "email",
  style = "style-1",
  images = [],
}: {
  loginMethods?: LoginMethods
  style?: string
  images?: string[]
}) {
  try {
    const Component = (await import(`./styles/${style}/index`)).default
    return <Component loginMethods={loginMethods} images={images} />
  } catch (e) {
    console.error(`Failed to load Login style: ${style}`, e)
    return notFound()
  }
}

