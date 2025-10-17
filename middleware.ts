import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  const referer = request.headers.get('referer')
  
  const scraperPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /requests/i,
    /scrapy/i,
    /beautifulsoup/i,
    /selenium/i,
    /phantomjs/i,
    /headless/i
  ]
  
  const allowedBots = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /discordbot/i,
    /telegrambot/i
  ]
  
  const isScraper = scraperPatterns.some(pattern => pattern.test(userAgent))
  const isAllowedBot = allowedBots.some(pattern => pattern.test(userAgent))
  
  if (isScraper && !isAllowedBot) {
    return new NextResponse('Access Denied', { status: 403 })
  }
  
  const response = NextResponse.next()
  
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}