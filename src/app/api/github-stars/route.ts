import { NextResponse } from 'next/server';

interface GitHubCache {
  stargazers_count: number;
  timestamp: number;
}

let cache: GitHubCache | null = null;
const CACHE_TTL = 3600000; // 1 hour in milliseconds

export async function GET() {
  try {
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(
        { stargazers_count: cache.stargazers_count },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
          },
        }
      );
    }

    const response = await fetch('https://api.github.com/repos/ATHman3/ANAE', {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'ANAE-Website',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (cache) {
        return NextResponse.json(
          { stargazers_count: cache.stargazers_count },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { stargazers_count: 0 },
        { status: 200 }
      );
    }

    const data = await response.json();
    const stargazers_count = data.stargazers_count ?? 0;

    cache = {
      stargazers_count,
      timestamp: Date.now(),
    };

    return NextResponse.json(
      { stargazers_count },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
        },
      }
    );
  } catch {
    if (cache) {
      return NextResponse.json(
        { stargazers_count: cache.stargazers_count },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { stargazers_count: 0 },
      { status: 200 }
    );
  }
}
