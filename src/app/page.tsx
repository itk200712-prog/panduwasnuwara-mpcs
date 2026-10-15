import { Hero } from "@/components/home/hero";
import {
  AboutPreview,
  BusinessPreview,
  CtaBanner,
  NewsPreview,
  ServicesPreview,
  Testimonials,
} from "@/components/home/sections";
import { getBusinessUnits, getNews, getServices, getStats } from "@/lib/data";

export default async function HomePage() {
  const [stats, services, units, news] = await Promise.all([
    getStats(),
    getServices(),
    getBusinessUnits(),
    getNews(3),
  ]);

  return (
    <>
      <Hero stats={stats} />
      <AboutPreview />
      <ServicesPreview services={services} />
      <BusinessPreview units={units} />
      <NewsPreview news={news} />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
