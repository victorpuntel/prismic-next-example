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

interface ProductProps {
    product: Document;
}

export default function Product({ product }: ProductProps) {
    const router = useRouter();

    if(router.isFallback){
        return <p>Loading...</p>
    }

    return (
        <div>
            <SEO 
                title={PrismicDOM.RichText.asText(product.data.title)}
                image="og.png"
                shouldExcludeTitleSuffix
            />
            <section>
                <Title>
                    {PrismicDOM.RichText.asText(product.data.title)}
                </Title>

                <img src={product.data.thumbnail.url} width="300" alt="image"/>

                <div dangerouslySetInnerHTML={{ __html: PrismicDOM.RichText.asHtml(product.data.description)}}></div>
                
                <p>Price: $ {product.data.price}</p>
            </section>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {

    return {
        paths: [],
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
    const { slug } = context.params;

    const product = await client().getByUID('product', String(slug), {});

    return {
        props: {
            product
        },
        revalidate: 10
    }

}