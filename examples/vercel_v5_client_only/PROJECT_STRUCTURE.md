# Project Structure

```
vercel_v5_client_only/
├── app/
│   ├── components/
│   │   ├── local-query.tsx      # DuckDB query result renderer
│   │   ├── parts.tsx            # Message parts handler
│   │   └── tools.tsx            # Tool invocation handler
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main page with useChat + transport
├── .gitignore                   # Git ignore rules
├── next-env.d.ts               # Next.js TypeScript types
├── next.config.js              # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── PROJECT_STRUCTURE.md         # This file
├── README.md                    # Project documentation
├── setup.sh                     # Setup script
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Key Differences from API Route Approach

### Before (API Route)
```
Client → API Route (/api/chat) → AI Service → Response
```

### After (Client-Only Transport)
```
Client → Local AI Processing → Response
```

## Files Explained

- **`page.tsx`**: Main component using `useChat` with `DefaultChatTransport`
- **`customFetch`**: Function that processes AI requests locally instead of making HTTP calls
- **`components/`**: Reusable UI components for rendering chat messages and tool results
- **`setup.sh`**: Automated setup script for quick project initialization

## Transport Pattern

The key innovation is using the `transport` parameter in `useChat`:

```typescript
const { error, messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    fetch: customFetch,  // Custom function instead of API endpoint
  }),
});
```

This eliminates the need for `app/api/chat/route.ts` while maintaining all the functionality.
