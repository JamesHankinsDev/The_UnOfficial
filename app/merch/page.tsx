import Head from "next/head";
import ShopifyBuyButton from "../../components/ShopifyBuyButton";
import SubscribeForm from "../../components/SubscribeForm";

export default function MerchPage() {
  return (
    <>
      <Head>
        <title>Merch | The UnOfficial</title>
        <meta
          name="description"
          content="Shop official The UnOfficial NBA fan merch. Rep your favorite fan community with exclusive gear and apparel."
        />
      </Head>
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-4xl font-bold text-primary dark:text-tertiary mb-6 text-center">
          Merch
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">
          Rep The UnOfficial! Check out our latest merch below. All purchases
          are securely processed via our Shopify store.
        </p>
        {/* Shopify Buy Button product grid embed */}
        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            <ShopifyBuyButton />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Questions? Contact us for support or sizing info.
        </p>
        <div className="mt-10">
          <SubscribeForm />
        </div>
      </div>
    </>
  );
}
