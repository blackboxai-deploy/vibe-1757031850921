import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AndroidBuilder AI - Build Android Apps with AI",
  description: "Create professional Android applications without coding using our AI-powered drag-and-drop builder. Build, customize, and export complete Android projects in minutes.",
  keywords: ["Android", "App Builder", "AI", "Drag Drop", "Mobile Development", "No Code"],
  authors: [{ name: "AndroidBuilder AI" }],
  creator: "AndroidBuilder AI",
  publisher: "AndroidBuilder AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "AndroidBuilder AI - Build Android Apps with AI",
    description: "Create professional Android applications without coding using our AI-powered drag-and-drop builder.",
    url: "https://androidbuilder.ai",
    siteName: "AndroidBuilder AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AndroidBuilder AI - AI-Powered Android App Development",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AndroidBuilder AI - Build Android Apps with AI",
    description: "Create professional Android applications without coding using our AI-powered drag-and-drop builder.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AndroidBuilder AI" />
        <meta name="application-name" content="AndroidBuilder AI" />
        <meta name="msapplication-TileColor" content="#2196F3" />
        <meta name="theme-color" content="#2196F3" />
      </head>
      <body className="font-inter antialiased">
        <div id="root" className="min-h-screen">
          {children}
        </div>
        
        {/* Analytics and tracking scripts can be added here */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Basic analytics tracking
              if (typeof window !== 'undefined') {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                // Add your analytics ID here
                // gtag('config', 'GA_MEASUREMENT_ID');
              }
            `,
          }}
        />
      </body>
    </html>
  );
}