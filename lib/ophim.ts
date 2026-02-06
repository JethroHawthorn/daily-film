import { Movie, MovieDetail } from "@/types/movie";

export const OPHIM_BASE_URL = process.env.NEXT_PUBLIC_OPHIM_BASE_URL;
export const OPHIM_IMAGE_URL = process.env.NEXT_PUBLIC_OPHIM_IMAGE_URL;

// Re-export constants
export const MOVIE_LIST_REVALIDATE = 60; // 1 minute
export const MOVIE_DETAIL_REVALIDATE = 3600; // 1 hour

export async function getLatestMovies(page = 1) {
  try {
    const res = await fetch(`${OPHIM_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`, {
      next: { revalidate: MOVIE_LIST_REVALIDATE },
    });
    
    if (!res.ok) throw new Error('Failed to fetch movies');
    
    const data = await res.json();
    return {
      items: (data.items || []) as Movie[],
      pagination: data.pagination,
    };
  } catch (error) {
    console.error('getLatestMovies error:', error);
    return { items: [], pagination: null };
  }
}

export async function getMovieDetail(slug: string) {
  try {
    const res = await fetch(`${OPHIM_BASE_URL}/phim/${slug}`, {
      next: { revalidate: MOVIE_DETAIL_REVALIDATE },
    });

    if (!res.ok) throw new Error('Failed to fetch movie detail');
    
    const data = await res.json();
    
    if (!data.status || !data.movie) {
      return null;
    }

    const movie = data.movie as MovieDetail;
    const episodes = (data.episodes || []) as MovieDetail['episodes'];
    
    return {
      movie: { ...movie, episodes }, // Ensure episodes are attached to movie object
      episodes,
    };
  } catch (error) {
    console.error('getMovieDetail error:', error);
    return null;
  }
}

export async function searchMovies(keyword: string, page = 1) {
    try {
      const res = await fetch(`${OPHIM_BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) throw new Error('Failed to fetch search results');
      const data = await res.json();
      
      const items = data?.data?.items || [];
      const apiPagination = data?.data?.params?.pagination;

      const pagination = apiPagination ? {
        totalItems: apiPagination.totalItems,
        totalItemsPerPage: apiPagination.totalItemsPerPage,
        currentPage: apiPagination.currentPage,
        totalPages: Math.ceil(apiPagination.totalItems / apiPagination.totalItemsPerPage),
      } : null;
  
      return {
        items: items as Movie[],
        pagination,
      };
    } catch (error) {
      console.error('searchMovies error:', error);
      return { items: [], pagination: null };
    }
  }

export async function getMoviesByCategory(slug: string, page = 1) {
  try {
    const res = await fetch(`${OPHIM_BASE_URL}/v1/api/the-loai/${slug}?page=${page}`, {
      next: { revalidate: MOVIE_LIST_REVALIDATE },
    });
    
    if (!res.ok) throw new Error('Failed to fetch movies by category');
    
    const data = await res.json();
    const items = data?.data?.items || [];
    const apiPagination = data?.data?.params?.pagination;

     const pagination = apiPagination ? {
        totalItems: apiPagination.totalItems,
        totalItemsPerPage: apiPagination.totalItemsPerPage,
        currentPage: apiPagination.currentPage,
        totalPages: Math.ceil(apiPagination.totalItems / apiPagination.totalItemsPerPage),
      } : null;

    return {
      items: items as Movie[],
      pagination,
    };
  } catch (error) {
    console.error('getMoviesByCategory error:', error);
    return { items: [], pagination: null };
  }
}

