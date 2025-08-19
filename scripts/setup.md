# Gaming Log Setup Instructions

## 1. Install Dependencies
```bash
npm install
```

## 2. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Optional: Open Prisma Studio to manage data
npx prisma studio
```

## 3. Environment Variables
Make sure `.env.local` contains:
```
DATABASE_URL="your_neon_db_connection_string"
ADMIN_PASSWORD="your_secure_password"
```

## 4. Run Development Server
```bash
npm run dev
```

## 5. Initial Setup
1. Visit `/admin` and login with your admin password
2. Create your first gaming post
3. Add some quick rants
4. Test media uploads with YouTube videos

## Features Ready for Launch:
✅ Personal gaming log with mood tracking
✅ Quick rants system  
✅ YouTube video embeds
✅ Screenshot galleries
✅ Auth-protected admin panel
✅ Responsive design with cobalt.tools styling
✅ Dark/light theme support
✅ Database integration with NeonDB

## Admin Access:
- Route: `/admin`
- Default password: Set in `.env.local`
- Session-based auth (resets on browser close)

## Media Support:
- Screenshots: Direct image URLs
- Game clips: YouTube video embeds
- Automatic YouTube ID extraction

Your personal gaming log is ready to launch! 🎮