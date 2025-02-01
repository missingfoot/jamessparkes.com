import { defineSchema } from '@instantdb/admin';

export default defineSchema({
  portfolio_items: {
    id: 'string',
    logo: 'string',
    title: 'string',
    company: 'string',
    location: 'string',
    backgroundColor: 'string',
    caseStudyFile: 'string',
    description: 'string',
    images: [{
      src: 'string',
      alt: 'string'
    }]
  }
});
