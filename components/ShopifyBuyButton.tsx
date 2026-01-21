"use client";
// ShopifyBuy types for window
declare global {
  interface Window {
    ShopifyBuy?: any;
  }
}
import { useEffect } from "react";

export default function ShopifyBuyButton() {
  useEffect(() => {
    const node = document.getElementById("collection-component-1768959071335");
    if (node) {
      // Prevent double-initialization
      if (
        window.ShopifyBuy &&
        window.ShopifyBuy.UI &&
        node.children.length > 0
      ) {
        return;
      }
      const scriptURL =
        "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
      function ShopifyBuyInit() {
        const client = window.ShopifyBuy.buildClient({
          domain: "1mafdc-0h.myshopify.com",
          storefrontAccessToken: "fae673b5ab6be2a942f5440c83332d4d",
        });
        window.ShopifyBuy.UI.onReady(client).then(function (ui: any) {
          ui.createComponent("collection", {
            id: "319596986529",
            node,
            moneyFormat: "%24%7B%7Bamount%7D%7D",
            options: {
              product: {
                styles: {
                  product: {
                    "@media (min-width: 601px)": {
                      "max-width": "calc(25% - 20px)",
                      "margin-left": "20px",
                      "margin-bottom": "50px",
                      width: "calc(25% - 20px)",
                    },
                    img: {
                      height: "calc(100% - 15px)",
                      position: "absolute",
                      left: "0",
                      right: "0",
                      top: "0",
                    },
                    imgWrapper: {
                      "padding-top": "calc(75% + 15px)",
                      position: "relative",
                      height: "0",
                    },
                  },
                  button: {
                    "font-family": "Avant Garde, sans-serif",
                    "font-size": "13px",
                    "padding-top": "14.5px",
                    "padding-bottom": "14.5px",
                    color: "#09bc8a",
                    ":hover": {
                      color: "#09bc8a",
                      "background-color": "#003c3f",
                    },
                    "background-color": "#004346",
                    ":focus": {
                      "background-color": "#003c3f",
                    },
                    "border-radius": "15px",
                  },
                  quantityInput: {
                    "font-size": "13px",
                    "padding-top": "14.5px",
                    "padding-bottom": "14.5px",
                  },
                },
                text: {
                  button: "Add to cart",
                },
              },
              productSet: {
                styles: {
                  products: {
                    "@media (min-width: 601px)": {
                      "margin-left": "-20px",
                    },
                  },
                },
              },
              modalProduct: {
                contents: {
                  img: false,
                  imgWithCarousel: true,
                  button: false,
                  buttonWithQuantity: true,
                },
                styles: {
                  product: {
                    "@media (min-width: 601px)": {
                      "max-width": "100%",
                      "margin-left": "0px",
                      "margin-bottom": "0px",
                    },
                  },
                  button: {
                    "font-family": "Avant Garde, sans-serif",
                    "font-size": "13px",
                    "padding-top": "14.5px",
                    "padding-bottom": "14.5px",
                    color: "#09bc8a",
                    ":hover": {
                      color: "#09bc8a",
                      "background-color": "#003c3f",
                    },
                    "background-color": "#004346",
                    ":focus": {
                      "background-color": "#003c3f",
                    },
                    "border-radius": "15px",
                  },
                  quantityInput: {
                    "font-size": "13px",
                    "padding-top": "14.5px",
                    "padding-bottom": "14.5px",
                  },
                },
                text: {
                  button: "Add to cart",
                },
              },
              option: {},
              cart: {
                styles: {
                  button: {
                    "font-family": "Avant Garde, sans-serif",
                    "font-size": "13px",
                    "padding-top": "14.5px",
                    "padding-bottom": "14.5px",
                    color: "#09bc8a",
                    ":hover": {
                      color: "#09bc8a",
                      "background-color": "#003c3f",
                    },
                    "background-color": "#004346",
                    ":focus": {
                      "background-color": "#003c3f",
                    },
                    "border-radius": "15px",
                  },
                },
                text: {
                  total: "Subtotal",
                  button: "Checkout",
                },
              },
              toggle: {
                styles: {
                  toggle: {
                    "font-family": "Avant Garde, sans-serif",
                    "background-color": "#004346",
                    ":hover": {
                      "background-color": "#003c3f",
                    },
                    ":focus": {
                      "background-color": "#003c3f",
                    },
                  },
                  count: {
                    "font-size": "13px",
                    color: "#09bc8a",
                    ":hover": {
                      color: "#09bc8a",
                    },
                  },
                  iconPath: {
                    fill: "#09bc8a",
                  },
                },
              },
            },
          });
        });
      }
      function loadScript() {
        const script = document.createElement("script");
        script.async = true;
        script.src = scriptURL;
        (document.head || document.body).appendChild(script);
        script.onload = ShopifyBuyInit;
      }
      if (window.ShopifyBuy) {
        if (window.ShopifyBuy.UI) {
          ShopifyBuyInit();
        } else {
          loadScript();
        }
      } else {
        loadScript();
      }
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 dark:bg-white">
      <div id="collection-component-1768959071335" />
    </div>
  );
}
