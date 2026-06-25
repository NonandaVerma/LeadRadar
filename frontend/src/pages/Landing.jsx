import Navbar     from '../components/Navbar'
import Hero       from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Footer     from '../components/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-black-base">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Footer />
    </div>
  )
}