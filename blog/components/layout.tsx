import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const pageStyle = {
  maxWidth: 768,
  marginLeft: "auto",
  marginRight: "auto",
  backgroundColor: "#FFFFFF",
  paddingLeft: '1rem',
  paddingRight: '1rem',
  ...inter.style,
};

export default function MDXLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return <section style={pageStyle}>{children}</section>;
}
