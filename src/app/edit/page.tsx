import type { Metadata } from "next";
import HomePage from "../page";

/** The home page with the pastor's editor switched on (src/edit). Kept out of search. */
export const metadata: Metadata = {
  title: "Edit the website",
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
};

/** Same hourly re-render as the home page, so the events list it shows is the live one. */
export const revalidate = 3600;

export default HomePage;
