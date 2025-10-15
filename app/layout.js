import "./globals.css";

export const metadata = {
  title: "Super Mario Game",
  description: "Classic Mario game built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: "hidden", touchAction: "manipulation" }}>
        {children}
      </body>
    </html>
  );
}