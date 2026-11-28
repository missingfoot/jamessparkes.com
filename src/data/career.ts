// Years of experience, counted from my first design job (QD Design, March 2009).
// Worked out at build time, so it goes up by itself whenever the site is rebuilt.
const careerStart = new Date(Date.UTC(2009, 2, 1));
const now = new Date();
const anniversaryPassed =
  now.getUTCMonth() > careerStart.getUTCMonth() ||
  (now.getUTCMonth() === careerStart.getUTCMonth() && now.getUTCDate() >= careerStart.getUTCDate());
export const yearsExperience = now.getUTCFullYear() - careerStart.getUTCFullYear() - (anniversaryPassed ? 0 : 1);
