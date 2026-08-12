import Hero from '../Components/hero/Hero'
import TrustBar from '../Components/sections/TrustBar'
import ProblemSection from '../Components/sections/ProblemSection'
import SolutionSection from '../Components/sections/SolutionSection'
import UserTypesSection from '../Components/sections/UserTypesSection'
import FeaturesSection from '../Components/sections/FeaturesSection'
import FraudSection from '../Components/sections/FraudSection'
import BlockchainSection from '../Components/sections/BlockchainSection'
import SecuritySection from '../Components/sections/SecuritySection'
import HowItWorksSection from '../Components/sections/HowItWorksSection'
import PrivacySection from '../Components/sections/PrivacySection'
import TestimonialsSection from '../Components/sections/TestimonialsSection'
import FAQSection from '../Components/sections/FAQSection'
import CTASection from '../Components/sections/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ProblemSection />
      <SolutionSection />
      <UserTypesSection />
      <FeaturesSection />
      <FraudSection />
      <BlockchainSection />
      <SecuritySection />
      <HowItWorksSection />
      <PrivacySection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
