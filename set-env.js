const fs = require('fs');
require('dotenv').config();

try {
  const content = `export const environment = {
  production: true,
  apiURl: '${process.env.API_URL || ''}',
  coachesImg: '${process.env.COACHES_IMG || ''}',
  closingImg: '${process.env.CLOSING_IMG || ''}',
  introVideo: '${process.env.INTRO_VIDEO || ''}'
};
`;

  fs.writeFileSync('src/environments/environment.ts', content);
  console.log('environment.ts generated');
} catch (error) {
  console.error('Error generating environment.ts:', error);
}