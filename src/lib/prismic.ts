import Prismic from 'prismic-javascript';

export const client = (req = null) => {
    const options = req ? { req } : null;

    return Prismic.client(process.env.NEXT_PUBLIC_API_URL, options);
} 