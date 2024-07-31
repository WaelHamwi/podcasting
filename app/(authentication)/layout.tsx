import Image from "next/image";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full h-screen items-center justify-center">
      <div className="absolute w-full h-full">
        <Image
          src="/images/bg-auth.webp"
          alt="bg"
          fill
          className="object-cover"
        />
      </div>
      <main className="relative z-10">{children}</main>
    </div>
  );
}
