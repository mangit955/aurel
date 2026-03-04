import HeroBackground from "./components/landing_page/Hero";
import LandingMain from "./components/landing_page/main";
import LandingFooter from "./components/landing_page/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-black pb-14">
      <HeroBackground />
      <div className="relative z-20 mx-auto -mt-14 w-full md:-mt-20">
        <LandingMain />
      </div>
      <div className="relative z-20">
        <LandingFooter />
      </div>
    </div>
  );
}
