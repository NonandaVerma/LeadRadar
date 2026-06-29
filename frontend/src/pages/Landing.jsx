import Navbar     from '../components/Navbar'
import Hero       from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import RadarInAction from '../components/RadarInAction'
import MetricsStrip from '../components/MetricsStrip'
import Features from '../components/Features'
import GlobalReach from '../components/GlobalReach'
import Footer     from '../components/Footer'
import WhoItsFor from '../components/WhoItsFor'
import FeatureShowcase from '../components/FeatureShowcase'
import FAQ from '../components/FAQ'


export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0E0E10]">
      <Navbar />
      <Hero />
      <Features />
      <FeatureShowcase />
      <RadarInAction />
      <GlobalReach />
      <MetricsStrip />
      <HowItWorks />
      <WhoItsFor />
      <FAQ />
      <Footer />
    </div>
  )
}