import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ReactNode } from "react";
import { getHostUrl } from "@/utils/getHostUrl";

export async function generateMetadata(): Promise<Metadata> {
  const hostUrl = await getHostUrl();
  return {
    title: "Cửa hàng hoa",
    description: "Danh sách cửa hàng hoa",
    openGraph: {
      title: "Cửa hàng hoa",
      description: "Danh sách cửa hàng hoa",
      url: hostUrl,
      siteName: "Cửa hàng hoa",
      images: [
        {
          url: `${hostUrl}/1200x630.jpg`,
          width: 1200,
          height: 630,
          alt: "Cửa hàng hoa",
        },
      ],
      locale: "vi",
      type: "website",
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
