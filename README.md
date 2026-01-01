# LMS Writing Prototype (v0)

A browser-based Learning Management System prototype where students write assessments in a rich text editor with an integrated AI chat assistant. The system tracks all AI interactions and text insertions for assessment integrity.

## Features

- **Rich Text Editor**: Word/Google-Docs-like editor powered by TipTap
  - Bold, italic, underline formatting
  - Headings (H1/H2)
  - Bullet and numbered lists
  - Undo/redo functionality
  - **Paste blocking**: All paste operations are disabled to prevent copying content

- **AI Chat Assistant**: Right-side panel for AI-powered assistance
  - Chat with AI assistant
  - Insert AI responses directly into the document
  - AI-inserted text is visually marked and tracked

- **Session Persistence**: Automatic saving to localStorage (debounced)

- **Submission System**: 
  - Submit assessment (freezes editor and chat)
  - Download submission JSON containing:
    - Full document content
    - Complete chat history
    - All insertion events mapping AI messages to inserted text

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm

### Install Dependencies

```bash
npm install
```

### TailwindCSS Setup

TailwindCSS is already configured. The configuration files are:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `src/index.css` - Contains Tailwind directives

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns).

## Gemini API Key Configuration

The application supports two modes:

1. **Gemini AI Mode** (with API key)
2. **Mock AI Mode** (fallback, no API key required)

### Setting Up Gemini API Key

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the project root:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
3. Restart the dev server

**Note**: If no API key is provided, the app automatically uses mock AI responses and displays a banner indicating "Mock AI mode (no API key configured)."

**Important**: Never commit your `.env` file. The `.env.example` file shows the required format.

## Paste Blocking Design

Paste functionality is completely blocked through multiple mechanisms:

1. **Paste Event**: `paste` event listener prevents default behavior
2. **BeforeInput Event**: Blocks `insertFromPaste` and `insertFromDrop` input types
3. **Keyboard Shortcuts**: Intercepts Cmd/Ctrl+V key combinations
4. **Drag & Drop**: Blocks `drop` events to prevent text dragging

When a paste attempt is detected, a toast notification appears: "Paste is disabled for this assessment."

Copy functionality remains enabled for students to copy their own work.

## Project Structure

```
src/
├── components/
│   ├── Editor/
│   │   └── EditorPane.tsx       # Rich text editor with paste blocking
│   ├── Chat/
│   │   └── ChatPane.tsx         # AI chat interface
│   └── SubmissionModal/
│       └── SubmissionModal.tsx  # Submission review modal
├── lib/
│   ├── ai/
│   │   ├── types.ts             # AI provider interface
│   │   ├── gemini.ts            # Gemini AI provider
│   │   ├── mock.ts              # Mock AI provider
│   │   └── index.ts             # Provider factory
│   └── storage/
│       └── sessionStorage.ts    # localStorage persistence
├── types/
│   └── assessment.ts            # TypeScript type definitions
├── App.tsx                      # Main application component
└── main.tsx                     # Application entry point
```

## Known Limitations

1. **Context Menu Paste**: While paste events are blocked, right-click context menu paste may work in some browsers. The primary enforcement is through the paste event, which is the standard approach.

2. **Browser Extensions**: Browser extensions that modify paste behavior may bypass restrictions. This is a limitation of client-side enforcement.

3. **No Authentication**: This is a prototype without user authentication. All data is stored locally in the browser.

4. **Single Session**: The app manages one assessment session at a time, stored in localStorage.

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Reset Development Data

In development mode, a "Reset" button is available in the header to clear the current session and start fresh.

## Acceptance Criteria

✅ `npm run dev` works  
✅ Editor + chat panel render correctly  
✅ Paste is blocked (Cmd/Ctrl+V, paste event, drop)  
✅ AI responses can be inserted at cursor and are marked/persisted  
✅ Submission JSON includes document + chat + insertions  
✅ No authentication required  
✅ Mock AI mode works without API key  
✅ Session persists across page reloads  

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **TipTap** - Rich text editor
- **Google Generative AI** - Gemini API integration
