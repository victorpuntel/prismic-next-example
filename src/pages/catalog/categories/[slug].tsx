import React from 'react';
import SEO from '@/components/SEO';
import { client } from '@/lib/prismic';
import { Title } from '@/styles/pages/Home';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

interface CategoryProps {
    category: Document;
    products: Document[];
}

export default function Category({ category, products }: CategoryProps){
    const router = useRouter();

    if(router.isFallback){
        return <p>Loading...</p>
    }

    return (
        <div>
            <SEO 
                title={PrismicDOM.RichText.asText(category.data.title)}
                image="og.png"
            />

            <section>
                <Title>{PrismicDOM.RichText.asText(category.data.title)}</Title>

                <ul>
                {
                    products.map(product => {
                        return (
                            <li key={product.id}>
                                <Link href={`/catalog/products/${product.uid}`}>
                                    <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
                                </Link>
                            </li>
                        )
                    })
                }
                </ul>
            </section>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const categories = await client().query([
        Prismic.Predicates.at('document.type', 'category')
    ]);

    const paths = categories.results.map(category => {
        return {
            params: { slug: category.uid }
        }
    })

    return {
        paths,
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
    const { slug } = context.params;

    const category = await client().getByUID('category', String(slug), {});

    const products = await client().query([
        Prismic.Predicates.at('document.type', 'product'),
        Prismic.Predicates.at('my.product.category', category.id)
    ]);

    return {
        props: {
            category,
            products: products.results
        },
        revalidate: 60
    }

}