import { Title } from '@/styles/pages/Home';
import Link from 'next/link';
import SEO from '@/components/SEO';
import { client } from '@/lib/prismic';
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';
import { GetServerSideProps } from 'next';

interface HomeProps {
  categories: Document[]
  recommendedProducts: Document[]
}

export default function Home({ categories, recommendedProducts }: HomeProps) {
  return (
    <div>
      <SEO 
        title="DevCommerce, your best e-commerce"
        image="og.png"
        shouldExcludeTitleSuffix
      />

      <section>
        <Title>Recommended Products</Title>

        <ul>
          {
            recommendedProducts.map(product => {
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
        <br/><br/>
        <Title>Categories</Title>

        <ul>
          {
            categories.map(category => {
              return (
                <li key={category.id}>
                  <Link href={`/catalog/categories/${category.uid}`}>
                    <a>{PrismicDOM.RichText.asText(category.data.title)}</a>
                  </Link>
                </li>
              )
            })
          }
        </ul>

        <br/><br/>
        <Title>Search</Title>
        <Link href="/search">
          <a>Go to</a>
        </Link>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ]);

  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category')
  ])

  return {
    props: {
      categories: categories.results,
      recommendedProducts: recommendedProducts.results
    }
  }
}