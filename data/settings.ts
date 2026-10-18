export const navItems = [
  { title: 'About', url: '/about' },
  { title: 'Quick Help', url: '/faq' },
  { title: 'Shrimps', url: '/shrimp' },
  { title: 'Blog', url: '/blog' },
  { title: 'Contact Us', url: '/contact' },
] as const;

export const socialLinks = {
  instagram: 'https://instagram.com/ebiyasg',
  email: 'mailto:bennyyuen@consultant.com',
  contact: '/contact',
  map: 'https://www.google.com/search?sca_esv=64ac0ab895c5266b&rlz=1CDGOYI_enSG1089SG1090&hl=en-GB&sxsrf=ANbL-n42cWd0W-PF_g4aC4ESjU_6QmgK_w:1769312886159&kgmid=/g/11p654bwpf&q=Millage&shem=bdslc,ptotple,shrtsdl&shndl=30&source=sh/x/loc/act/m1/3&kgs=2aeb6603ed0d6828&utm_source=bdslc,ptotple,shrtsdl,sh/x/loc/act/m1/3',
} as const;

export const siteConfig = {
  name: 'Ebiya.sg',
  url: 'https://ebiya.sg',
  description: 'Singapore\'s premier Caridina shrimp specialist — custom tank systems, premium shrimp, and expert guidance.',
  whatsapp: {
    enabled: true,
    phone: '6560425590',
    message: 'Hi, I\'m interested in Caridina shrimp / tank setup.',
  },
  business: {
    address: '55 Changi Road #B1-01, Singapore 419709',
    telephone: '+65 6042 5590',
    email: 'bennyyuen@consultant.com',
    openingHours: 'Mon-Fri 9am-6pm',
  },
} as const;
