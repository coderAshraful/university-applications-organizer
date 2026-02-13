import { NextRequest, NextResponse } from 'next/server';

interface CollegeScoreCardResult {
  id: string;
  'school.name': string;
  'school.city': string;
  'school.state': string;
  'school.school_url': string;
}

interface HipolabsUniversity {
  name: string;
  country: string;
  web_pages: string[];
  domains: string[];
  alpha_two_code: string;
  'state-province': string | null;
}

interface UniversityResult {
  id: string;
  name: string;
  city: string;
  state: string;
  website: string;
  country?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({
        data: [],
      });
    }

    // Fetch from both APIs in parallel
    const [usResults, internationalResults] = await Promise.allSettled([
      fetchUSUniversities(query),
      fetchInternationalUniversities(query),
    ]);

    // Combine results
    const results: UniversityResult[] = [];

    // Add US results
    if (usResults.status === 'fulfilled') {
      results.push(...usResults.value);
    }

    // Add international results
    if (internationalResults.status === 'fulfilled') {
      results.push(...internationalResults.value);
    }

    // Deduplicate by name (case-insensitive)
    const seen = new Set<string>();
    const uniqueResults = results.filter((result) => {
      const normalizedName = result.name.toLowerCase().trim();
      if (seen.has(normalizedName)) {
        return false;
      }
      seen.add(normalizedName);
      return true;
    });

    // Limit to top 15 results
    return NextResponse.json({
      data: uniqueResults.slice(0, 15),
    });
  } catch (error) {
    console.error('Error searching universities:', error);

    // Return empty array on error to allow manual entry
    return NextResponse.json({
      data: [],
    });
  }
}

// Fetch US universities from College Scorecard API
async function fetchUSUniversities(query: string): Promise<UniversityResult[]> {
  try {
    const API_KEY = process.env.COLLEGE_SCORECARD_API_KEY || 'DEMO_KEY';
    const url = `https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name=${encodeURIComponent(query)}&fields=id,school.name,school.city,school.state,school.school_url&per_page=8&api_key=${API_KEY}`;

    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      throw new Error('Failed to fetch from College Scorecard API');
    }

    const data = await response.json();

    return (data.results || []).map((school: CollegeScoreCardResult) => ({
      id: `us-${school.id}`,
      name: school['school.name'],
      city: school['school.city'] || '',
      state: school['school.state'] || '',
      website: school['school.school_url'] || '',
      country: 'United States',
    }));
  } catch (error) {
    console.error('Error fetching US universities:', error);
    return [];
  }
}

// Fetch international universities from Hipolabs University API
async function fetchInternationalUniversities(query: string): Promise<UniversityResult[]> {
  try {
    // This free API covers universities worldwide
    const url = `http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`;

    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
      throw new Error('Failed to fetch from Hipolabs API');
    }

    const data: HipolabsUniversity[] = await response.json();

    return data.slice(0, 10).map((uni, index) => {
      // Extract city/region from state-province or use country
      const location = uni['state-province'] || uni.country;

      return {
        id: `intl-${uni.alpha_two_code}-${index}`,
        name: uni.name,
        city: location,
        state: uni.country,
        website: uni.web_pages[0] || '',
        country: uni.country,
      };
    });
  } catch (error) {
    console.error('Error fetching international universities:', error);
    return [];
  }
}
