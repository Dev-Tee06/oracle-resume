import anniversary1 from '../assets/anniversary1.jpg'
import anniversary2 from '../assets/anniversary2.jpg'
import anniversary3 from '../assets/anniversary3.jpg'
import anniversary4 from '../assets/anniversary4.jpg'
import anniversary5 from '../assets/anniversary5.jpg'
import birthday1 from '../assets/birthday1.jpg'
import birthday2 from '../assets/birthday2.jpg'
import birthday3 from '../assets/birthday3.jpg'
import birthday4 from '../assets/birthday4.jpg'
import birthday5 from '../assets/birthday5.jpg'
import birthday6 from '../assets/birthday6.jpg'
import birthday7 from '../assets/birthday7.jpg'
import flyer1 from '../assets/flyer1.jpg'
import flyer2 from '../assets/flyer2.jpg'
import flyer3 from '../assets/flyer3.jpg'
import flyer4 from '../assets/flyer4.jpg'
import flyer5 from '../assets/flyer5.jpg'
import flyer6 from '../assets/flyer6.jpg'
import flyer7 from '../assets/flyer7.jpg'
import flyer8 from '../assets/flyer8.jpg'
import logo1 from '../assets/logo1.jpg'
import logo2 from '../assets/logo2.jpg'
import logo3 from '../assets/logo3.jpg'
import logo4 from '../assets/logo4.jpg'
import logo5 from '../assets/logo5.jpg'
import logo6 from '../assets/logo6.jpg'

export const LEGACY_PORTFOLIO_PROJECTS = [
  {
    title: 'Anniversary Designs', slug: 'anniversary-designs', category: 'Anniversary',
    short_description: 'Elegant and heartfelt anniversary graphic designs celebrating love and milestones.',
    files: [anniversary1, anniversary2, anniversary3, anniversary4, anniversary5],
  },
  {
    title: 'Birthday Designs', slug: 'birthday-designs', category: 'Birthday',
    short_description: 'Creative and vibrant birthday celebration graphics that make every occasion memorable.',
    files: [birthday1, birthday2, birthday3, birthday4, birthday5, birthday6, birthday7],
  },
  {
    title: 'Flyer Designs', slug: 'flyer-designs', category: 'Flyer',
    short_description: 'Bold and attention-commanding promotional flyers designed to capture your audience.',
    files: [flyer1, flyer2, flyer3, flyer4, flyer5, flyer6, flyer7, flyer8],
  },
  {
    title: 'Logo & Brand Identity', slug: 'logo-brand-identity', category: 'Logo',
    short_description: 'Distinctive and versatile logo designs built for brand recognition and lasting impressions.',
    files: [logo1, logo2, logo3, logo4, logo5, logo6],
  },
]

export const STATIC_PORTFOLIO_PROJECTS = LEGACY_PORTFOLIO_PROJECTS.map((project, index) => ({
  id: `static-${project.category.toLowerCase()}`,
  ...project,
  cover_image: { public_url: project.files[0], alt_text: `${project.category} design` },
  gallery: project.files,
  sort_order: index,
}))
