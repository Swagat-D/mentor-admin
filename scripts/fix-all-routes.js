const fs = require('fs');
const path = require('path');

const routes = [
  'app/api/admin/analytics/route.ts',
  'app/api/admin/auth/login/route.ts', 
  'app/api/admin/auth/logout/route.ts',
  'app/api/admin/auth/me/route.ts',
  'app/api/admin/auth/refresh/route.ts',
  'app/api/admin/files/download/[...path]/route.ts',
  'app/api/admin/messages/send/route.ts',
  'app/api/admin/overview/route.ts',
  'app/api/admin/sessions/route.ts',
  'app/api/admin/stats/route.ts',
  'app/api/admin/users/route.ts',
  'app/api/admin/users/[id]/route.ts',
  'app/api/admin/users/export/route.ts',
  'app/api/admin/verifications/route.ts',
  'app/api/admin/verifications/[id]/route.ts',
  'app/api/admin/verifications/[id]/action/route.ts',
  'app/api/mentors/search/route.ts',
  'app/api/mentors/verification/update/route.ts',
  'app/api/notifications/route.ts'
];

routes.forEach(routePath => {
  const fullPath = path.join(__dirname, '..', routePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if already has dynamic export
    if (!content.includes('export const dynamic')) {
      // Add at the top after imports
      const lines = content.split('\n');
      const insertIndex = lines.findIndex(line => line.startsWith('export')) || 0;
      
      lines.splice(insertIndex, 0, '// Force dynamic rendering', 'export const dynamic = \'force-dynamic\';', '');
      
      fs.writeFileSync(fullPath, lines.join('\n'));
      console.log(`✅ Fixed ${routePath}`);
    }
  }
});

console.log('🎉 All routes fixed!');