// Utility to load and access KeMU content from JSON
import kemuContent from '../kemu_content.json';

export interface ContentItem {
  title: string;
  url: string;
  summary: string;
  details?: string[];
}

export const getContentByCategory = (category: keyof typeof kemuContent): ContentItem[] => {
  const content = kemuContent[category];
  if (Array.isArray(content)) {
    return content as ContentItem[];
  }
  return [];
};

export const getProgrammesByType = (type: 'certificate' | 'diploma' | 'degree' | 'masters' | 'postgraduate_diploma' | 'doctorate' | 'professional_courses' | 'tvet'): ContentItem[] => {
  return kemuContent.programmes[type] || [];
};

export const getProfessionalCourses = (): ContentItem[] => {
  return getProgrammesByType('professional_courses');
};

export const getTVETProgrammes = (): ContentItem[] => {
  return getProgrammesByType('tvet');
};

export const findContentByUrl = (url: string): ContentItem | undefined => {
  const allCategories = Object.values(kemuContent);
  
  for (const category of allCategories) {
    if (Array.isArray(category)) {
      const found = category.find((item: ContentItem) => item.url === url);
      if (found) return found;
    } else if (typeof category === 'object' && category !== null) {
      // Handle nested programme structure
      const programmeTypes = Object.values(category);
      for (const programmes of programmeTypes) {
        if (Array.isArray(programmes)) {
          const found = programmes.find((item: ContentItem) => item.url === url);
          if (found) return found;
        }
      }
    }
  }
  
  return undefined;
};

export const getAboutContent = (): ContentItem[] => {
  return getContentByCategory('about');
};

export const getContactInfo = (): ContentItem | undefined => {
  const contacts = getContentByCategory('contacts');
  return contacts.find(c => c.title === 'Contact');
};

export const getSchools = (): ContentItem[] => {
  return getContentByCategory('schools');
};

export const getGovernance = (): ContentItem[] => {
  return getContentByCategory('governance');
};

export const getDirectorates = (): ContentItem[] => {
  return getContentByCategory('directorates');
};

export const getStudentServices = (): ContentItem[] => {
  return getContentByCategory('student_services');
};

export const getAdmissions = (): ContentItem[] => {
  return getContentByCategory('admissions');
};

export const getEvents = (): ContentItem[] => {
  return getContentByCategory('events');
};

export const getNews = (): ContentItem[] => {
  return getContentByCategory('news');
};

export const getPublications = (): ContentItem[] => {
  return getContentByCategory('publications');
};

export const getPortals = (): ContentItem[] => {
  return getContentByCategory('portals');
};

export default kemuContent;

