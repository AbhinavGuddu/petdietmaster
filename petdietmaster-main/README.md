# Pet Diet Master

A web application for analyzing pet food safety using AI.

## Production Deployment

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Environment variables in `.env.local`

### Deployment Steps

1. **Build**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm run start
   ```

### Environment Variables
Make sure your `.env.local` contains:
- `NEXT_PUBLIC_GEMINI_API_KEY`: Your Google Gemini API key
- `NEXT_PUBLIC_ADMIN_TOKEN`: Admin authentication token
- `ADMIN_TOKEN`: Server-side admin token

### Production Considerations
- Use HTTPS in production
- Keep environment variables secure
- Monitor API usage and limits
- Set up proper error logging
- Configure proper CORS settings if needed

### Security Notes
- Change admin tokens in production
- Use proper authentication in production
- Keep API keys secure
- Monitor for suspicious activity

## Development
```bash
npm run dev
``` 