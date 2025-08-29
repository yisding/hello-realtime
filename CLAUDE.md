# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

Hello Realtime is an OpenAI Realtime API demo application supporting WebRTC
users. It's built on Val Town's Deno runtime with TypeScript and uses the Hono
framework for routing.

## Commands

### Development

- **Run locally**: Deploy to Val Town platform - no local dev server
- **Test deployment**: Visit https://hello-realtime.val.run for WebRTC
- **Format** Run `deno fmt`

## Architecture

### Core Components

1. **Main Entry Point** (`main.tsx`)
   - Hono app with route mounting
   - Routes: `/rtc`, `/sip`, `/observer`
   - Serves frontend from `/frontend/index.html`

2. **WebRTC Route** (`routes/rtc.ts`)
   - Creates OpenAI Realtime calls via POST to `/rtc`
   - Handles SDP offer/answer exchange
   - Triggers observer WebSocket connection

3. **SIP Route** (`routes/sip.ts`)
   - Webhook endpoint for incoming phone calls
   - Verifies signatures using Svix
   - Accepts calls and triggers observer

4. **Observer Route** (`routes/observer.ts`)
   - Establishes WebSocket connection to OpenAI
   - Monitors call events and transcripts
   - Auto-sends `response.create` after connection

5. **Utilities** (`routes/utils.ts`)
   - `makeHeaders()`: Adds OpenAI API authentication
   - `makeSession()`: Configures Realtime session with model, instructions, and
     voice settings

### Frontend

- Single-page vanilla JavaScript application (`frontend/index.html`)
- WebRTC peer connection management
- Real-time status indicators and logging
- No external dependencies or build process

## Environment Variables

Required:

- `OPENAI_API_KEY`: For all OpenAI API calls
- `OPENAI_SIGNING_SECRET`: Required for SIP webhook verification (optional if
  only using WebRTC)

## Val Town Specifics

- Uses Val Town's file reading utilities from
  `https://esm.town/v/std/utils@85-main/index.ts`
- Deno runtime with TypeScript support
- No local development server - deploy directly to Val Town
- Import npm packages via `npm:` prefix (e.g., `npm:hono`)

## Key Implementation Details

- OpenAI Realtime model: `gpt-realtime`
- Voice: `marin` (configurable in utils.ts)
- Audio configuration includes noise reduction for near-field devices
- WebSocket messages are logged except for audio transcript deltas
- Observer automatically triggers 250ms after connection
