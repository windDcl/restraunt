import { Restaurant, MenuItem, UserProfile, Order, Address } from "./types";

export const CUISINES = [
  {
    name: "Pizza",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFDRTmksr6oXWpfTDFyIZm4Wi5u3IHvc3Jd7H93qknN3hHqanbpwux0GjvVnjrOaiYyD0pm_jsVWp3g-KcTvuNbgc-tXq3wZLR4piFCkhQUfZ448kAfFIJwqtUpcjnRppFNXQ0fwy0KdtjjWrN_BAKK_ca1Au5E_CVxbPNIu_h9hM-QjmbZjcF3KRHUenLMZksd5xI5okX9de9JR9dEgUpDwwLeKiRhcx81-LqfwZkMJN66FlU2sp9h3PNlO5OuTxK4T6RG3dpFiE"
  },
  {
    name: "Sushi",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeC9L6EuyQlLplTRns6L51v2PDMu_6bJN5-Oa-CMgWJGuH0bkQVtka6-oANy4N3gKeQQ4nOgI4YHOR9_GH2yvi7TK760sE714QWpP5p98UISBVigktI3ILeJIczLjcycIqjPhX8iq-CPPpAOlCzDcE9EF8B8LooYeuSwqqpyzHZrL6K_15K3cCocypt_ICa1LDxoggNBfDP5v0ACzEzmu4VqijYfXobZkaY2KBIRYnCN8gN9oEWjUuYL6KxSZlD0I9r5mnuKfVfag"
  },
  {
    name: "Burgers",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjBXYKg6ev0rCQIoY6v8Vmv9QZKdmbLJCBSBfEzzpQLJX_wfSauoMUgZd82dYZFyQEO0Fx6kj_wWzq5zS0rDDI7u3_d06x_BPD-OFSSVPWLLV4gaIX_f-FMAcAsHoNLUiZ0tnTYz1Kqa6KR9jQjt2Faux9VOTRJIXk-3KSKWNCn2ShnsodU2qr8-xt38pDsRleDdfjUjg_YXoNsI9qB3OWoK4CQR7h5TvO5sFln7Dd5Ylgo0B7_LJ4BjLfUnqNlmPIIaagBF6Cxg0"
  },
  {
    name: "Grill",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvnQZh8fjbxcyIy0YuFkmk13JiNl0CuX5ACy_sFHjgf5hPzQgtehGtCxekoVBx5QENrrUjvOTpNVfO_mqECZp9_Q8RU5pSbfSabJ4T14rXO2725PO71tzqq90heMRhDHBy6ygEb7EQ4t5CPgyBwznwSTRmwriG9ltCMeh1dE5hqPzvoBB0UM8gpynnt7AngqwWOHTaSwHfsSUeYG-2wdVDN07A-6dFAFM3RdlRh51SEjX2Ds9Nar9tSX9_LYrpw2hvOmoZtngalPU"
  },
  {
    name: "Desserts",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQH4uk2fJBJbNvZ0i1qVAbFAUW8OdkWEvTYk1DDJtX4PlTIr2pW115itchxCqDwEFXOvrngHzjuvmb7H6ywN6sqCSFypv6EVmjk4hx0F2a3cXyVJhlfDxn-p3f-tc5t4aZLJYBl9dRY6RKxiGQrahqHdzDtAAyjBtigGGteZEq11c2qafmWSRYLHwXwhQXpuQDiLRqSiSeiPc-hFTe5qeOww5Sflbhq9EdFqDZFWcFkoAwKuPCNm0fjQwM5Z6ehqBFIioCdaH8Io8"
  },
  {
    name: "Healthy",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAarVG3PgoHudwJ8yOZQcdyN38wLnhhTlCs42oeQe8ACTFsQES3-miBrrt0LRzGepz0nEZXzChSpJWGwjpY_T6ZeCdJzkXPR9RzxV_XNjYyYxJavJH4Wa-4ha8YZyZJF7nQ1RevCdC3IBbXci3nAlZ7i7LQ5JXdexaT3V6LscQPft3mwXnLFVMdlRf5NtFVHHug9h24y9uPnocBD2IvuegpefFQubK2019dJCy21k9ivmSUObR1h1Dc0UkRKOwWuZat6QOg6-W3BGo"
  }
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "sizzling-grill",
    name: "The Sizzling Grill",
    cuisine: "American • Burgers • Gourmet Sides",
    tags: ["American", "Burgers", "Gourmet Sides"],
    rating: 4.8,
    reviewsCount: "2k+",
    bannerTag: "Popular Choice",
    deliveryTime: "20-35 min",
    deliveryFee: 2.99,
    distance: "1.4 mi",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQSBsMJCyqyDukwoq-QggxL0jO-D6ybuHzcBx8cD0IfMgcl-OPzDPD-R57Eq7BFQ1Ndn_urwJSW7H2Y9YVwHQPbTSSc_lT6_BdZ_kr5ALQc_m591EmB489BjIfd2_ogU45X6OYT5P2shbNpE6UMlAlGQl2JhcYVI8fmHQ9Q5c7Yq9FuuN3oUm3AIN9laJoHIczwppzXoTQKBz7TyhjSMtoDlM6ZqUFS55PoOHqFpS9JNN0ADp5rvxW2lMbx_hMO8Vlzmft7cLKhFI",
    menu: [
      {
        id: "classic-king",
        name: "Classic King Combo",
        description: "Signature burger, large fries, and choice of soft drink.",
        price: 15.99,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnJ6gp-XYGhAxwJ_WcZNELGrcqEggeAAYRYUDVzCBTAg0ndj6gv2QnDcj0q7cmcb8isfOpHb3ltyFg-3MHpn0wRGZ8InaNKdIhqUd5B50l4Hj_aRUoRwzjTugBxbXq3bkN-3LDVulc52Wr1uFhtFUUBGyuxnNi0U4OHcGM5FxRSUINKq1E6BCU7dq2smZQZe-zoI4BVNSCl3UMA8hOn0I5s6rUKEbZxQFHribf6_QYEKo7_mek0vpq9jvwo9GPdZL3NbPm9cZX9K8",
        category: "Combos"
      },
      {
        id: "monster-feast",
        name: "The Monster Feast",
        description: "Triple patty burger with extra bacon, onions, and spicy mayo.",
        price: 21.50,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAimCkySj3ujD1tR69m6j0f9sSP4NIA5TAdoNqctuO4i7vPbhIQE93TECJTyrHi2oqXBHl9EBOIUcEuhPC1Ig6FKbmAElUwJRxzqmotR9OsQipA-7qP67rwElfRKW6qFaNiN6HuDZ6ks4gOxw8J11nQiZRVZ1wUpcp7B4QMmUT0GBR_Yy-cP9xHhrlCfHVG4pCwj1Yir0d2ZKe7gD_thrCBjSlOzDxXlrX0sSgZA4TLRnEJs-HtIkr2v8_R3xuVoN8oOoQckCn6xS8",
        category: "Combos"
      },
      {
        id: "swiss-mushroom",
        name: "Swiss Mushroom",
        description: "Sautéed mushrooms, melted swiss cheese, and garlic aioli.",
        price: 12.99,
        image: "https://lh3.googleusercontent.com/AB6AXuDzqrocZptrO9nqAIX0XyU1z2JDnWsiKTRpWXr-ztnjX8v31eshH6RMZ8R3SKPYFQOF2KeeHpEsu2Vk9R_XdF9GYt6tmpoxPOwXJ-9XcVVoZ8Q4aPHGyer6pRZ2CPuc1hP2mAj_BdyRaszmxXCCthgVZF2BL2Xa4jCuXv_C_Nez0ud-pjHjlHwcYIV2k3fwOOtzjMvAjkXnHFzPamr804drYP6PFAMsV2P09faRco2r1-PZMX_4iji88qx-Hoq4_xVFp8V9HkOc7XM",
        category: "Burgers"
      },
      {
        id: "spicy-inferno",
        name: "Spicy Inferno Chicken",
        description: "Crispy chicken breast, buffalo hot sauce, and jalapeños.",
        price: 11.50,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpHhos6BBwYE0admme8Hqy6vcwxPIdZDsfOtG69-W_JNq7KwCntADeIYpz5aHLpnILM8QDjRLkjR7KR19NKVEes_xdo9BT_10rnhIsPTlfB-zcfsL0ul8S35FTKBqVkoMsv4ckJlk-kNNJn0We42AhvaZ7GotYvZbCgA-4kmj9dhBhzIMftVRsgiyEjU0oZGZ0f1fD3uvqmeMF6NJ_SSx_3kp81W4z36PjT3MHCm9FcOfBU2geuxyDsMfNxPs7YEgtxURUn2_I8ME",
        category: "Burgers"
      },
      {
        id: "truffle-wagyu-burger",
        name: "Truffle Wagyu Burger",
        description: "Medium rare, extra truffle aioli.",
        price: 18.50,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfBawwkXO03x0VeXjl2DucP0nXtYdFB6EeYr5iZWXD-grYagB_Ny6yWA5LVVAMPbZbsV7lbo_K2vFdbkVFlTgIP_JUJQxxBtZkWpYv57GbiIKI6cbXdjY3OY1J5qhJNXke9aQkSChlbQnmNQkZQmiemWXTnygaMDccigo0i2Pr61Y2qqB8usylX2Ppd0cWLS9jR94YH4WysXQQh_IdWDDZY4fpjn1W-NSe-FTv-A-9jWvToCW2XQPS4gsuIGeSaARCNb1acolDfmA",
        category: "Burgers"
      },
      {
        id: "crispy-buffalo-wings",
        name: "Crispy Buffalo Wings",
        description: "Spicy, Blue cheese dip.",
        price: 12.00,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDL0lC8sYKa5R_gCib95xe9eg8jQN-Z33JnPsC3_mUe7jvSvjLUtUg41VUPsp8vTRhrdDZ8jxU375-LF_6RH0gE7iS5zyZc0-5FiMEgnQnY5n5z0KvtkBC0_kGXF8yGUwCT6hu9Y3jtOdjMh6-kBQ3UNcABKpYSExkh67E1JZa9-J3a_lTPvDsbg5PqN19iHu4N9Zws82oVdJn7tMU2q4BdM0gw0S8PSRs7oCOX8mXUq7mieOHUgeJMKSaLKuhPyIdAc3avUCkcWXM",
        category: "Sides"
      },
      {
        id: "loaded-garlic-fries-sizzling",
        name: "Loaded Garlic Fries",
        description: "Tossed with real dynamic herb butter and parmesan dust.",
        price: 6.99,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1myuJxTyedXTolRkvXN6C31pWjfy-u3H-WM1sWCg-IVRdQSB4JixHI4TMivHmPP9Y5rA22-q_zXpyqzlAbZVf19XfWfOsmtqRBtUs4PPLPo7S1xP90aogRTuZ6mp8FVT_xOvDPGmzJxY06Y99ilZHrmIjrIc04AjtOLGoZmX326EjDd80PmBYkN8kcDQW7uSQqDCXUjCFeDbQ7FDrRfmrPyXV2_DxqFGI_PeEzm8VwNNlW7Gl0nMLVYAcf2i_7MSgxSEUTI3Aeoo",
        category: "Sides"
      },
      {
        id: "crafted-cola",
        name: "Gourmet Craft Cola",
        description: "Organic cane sugar base infused with orange peel essence.",
        price: 3.50,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmBtFA9y2CjXjaAU_0zLPb76veYWS7Q_mVSgnGrPOzHgGYbgciz5ygpFkprMvEhwnNA8_vNUk_QDfbMjOLq8mpDIXvEsMEpQQKv6AFtm7gGTUut5AN1XnBXGeRwY01_GNE1hoILP9KY133hdNAuoAKPNXKPkHM2ln32dUMv-oZoXkaLnG6VphUaigJhEY9RmqF3x7QhGzhwGAb-oIgaSrFpn5D665jvCd1FZM7nUFV2WIsrpeipfA-glNbAruE-ZKcTrcNBgcMLqo",
        category: "Drinks"
      },
      {
        id: "lava-fudge-cake",
        name: "Hot Fudge Molten Cake",
        description: "Signature gold standard chocolate volcano cake served hot.",
        price: 7.99,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQH4uk2fJBJbNvZ0i1qVAbFAUW8OdkWEvTYk1DDJtX4PlTIr2pW115itchxCqDwEFXOvrngHzjuvmb7H6ywN6sqCSFypv6EVmjk4hx0F2a3cXyVJhlfDxn-p3f-tc5t4aZLJYBl9dRY6RKxiGQrahqHdzDtAAyjBtigGGteZEq11c2qafmWSRYLHwXwhQXpuQDiLRqSiSeiPc-hFTe5qeOww5Sflbhq9EdFqDZFWcFkoAwKuPCNm0fjQwM5Z6ehqBFIioCdaH8Io8",
        category: "Desserts"
      }
    ]
  },
  {
    id: "golden-whisk",
    name: "The Golden Whisk",
    cuisine: "Italian • Pasta • Seafood",
    tags: ["Italian", "Pasta", "Seafood"],
    rating: 4.8,
    reviewsCount: "1.2k+",
    bannerTag: "Free Delivery",
    deliveryTime: "20-30 min",
    deliveryFee: 0,
    distance: "2.4 miles away",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8Fyu5gaH4XMEFqKI_zFczo5FXeaTbH-n5hhKDr6FouI4Prayv_vZR2z0wnk94UiSirBVKYoTn05g_GYa4h73nVc6uP2899q4B_BQRDjmL6VMxscNZFaoaIqIh5urTR8Xe2n3WYTv3ObB8rOXjRBXyPai3_ChoU8N-a84X8Og-5dnprXjdD0pGl6hqgDTWJRXCl8TFNKBep_gn6iANRio040Xdi2B_pXYTJ0RHKSPZgmxLTFNoGYX7cJngSz0NWQdqJ1KNevGTBHw",
    menu: [
      {
        id: "lasagna-classico",
        name: "Lasagna Classico",
        description: "Baked sheets of housemade pasta layered with premium beef bolognese and creamy béchamel sauce.",
        price: 18.99,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8Fyu5gaH4XMEFqKI_zFczo5FXeaTbH-n5hhKDr6FouI4Prayv_vZR2z0wnk94UiSirBVKYoTn05g_GYa4h73nVc6uP2899q4B_BQRDjmL6VMxscNZFaoaIqIh5urTR8Xe2n3WYTv3ObB8rOXjRBXyPai3_ChoU8N-a84X8Og-5dnprXjdD0pGl6hqgDTWJRXCl8TFNKBep_gn6iANRio040Xdi2B_pXYTJ0RHKSPZgmxLTFNoGYX7cJngSz0NWQdqJ1KNevGTBHw",
        category: "Combos"
      },
      {
        id: "seafood-tagliatelle",
        name: "Seafood Tagliatelle",
        description: "Mussels, wild tiger prawns, and baby squid tossed in a white wine or marinara sauce.",
        price: 24.50,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8Fyu5gaH4XMEFqKI_zFczo5FXeaTbH-n5hhKDr6FouI4Prayv_vZR2z0wnk94UiSirBVKYoTn05g_GYa4h73nVc6uP2899q4B_BQRDjmL6VMxscNZFaoaIqIh5urTR8Xe2n3WYTv3ObB8rOXjRBXyPai3_ChoU8N-a84X8Og-5dnprXjdD0pGl6hqgDTWJRXCl8TFNKBep_gn6iANRio040Xdi2B_pXYTJ0RHKSPZgmxLTFNoGYX7cJngSz0NWQdqJ1KNevGTBHw",
        category: "Combos"
      },
      {
        id: "baked-truffle-mac",
        name: "Baked Truffle Mac & Cheese",
        description: "Gourmet cheddar, swiss and gruyere cheese blend baked with cellantani pasta.",
        price: 15.00,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8Fyu5gaH4XMEFqKI_zFczo5FXeaTbH-n5hhKDr6FouI4Prayv_vZR2z0wnk94UiSirBVKYoTn05g_GYa4h73nVc6uP2899q4B_BQRDjmL6VMxscNZFaoaIqIh5urTR8Xe2n3WYTv3ObB8rOXjRBXyPai3_ChoU8N-a84X8Og-5dnprXjdD0pGl6hqgDTWJRXCl8TFNKBep_gn6iANRio040Xdi2B_pXYTJ0RHKSPZgmxLTFNoGYX7cJngSz0NWQdqJ1KNevGTBHw",
        category: "Sides"
      }
    ]
  },
  {
    id: "sakura-zen",
    name: "Sakura Zen",
    cuisine: "Japanese • Sushi • Ramen",
    tags: ["Japanese", "Sushi", "Ramen"],
    rating: 4.9,
    reviewsCount: "3k+",
    bannerTag: "Premium Selection",
    deliveryTime: "35-45 min",
    deliveryFee: 1.80,
    distance: "1.8 miles away",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1IqCiMlyeiYtRi41Bpg4ChA5rW777kbDmX-HCNhubgjrWioUHkE8Ieti1roElVPEvQoNdrH22BEpHyv4OqkRe1VZuGspAUcsATStnXR5BgP5XSI954Gi68z-pn6HOvZC4svdJpOVE9vGnSXYtvvTM_pWdWD9kbAfFszCxHvYYHQbyXSJmSihBPsTdbEe-W8xJXZDqbLrLurbCDyUMQ4t7yaZEnps3xg5vKISI4JYF1ZcljmWKx8zCyw4A6JsNjJOxgz3hfdFpTD4",
    menu: [
      {
        id: "zen-maki-combo",
        name: "Maki Dream Platter",
        description: "Assorted salmon, tuna rolls, spicy crab california roll with picked ginger.",
        price: 26.50,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeC9L6EuyQlLplTRns6L51v2PDMu_6bJN5-Oa-CMgWJGuH0bkQVtka6-oANy4N3gKeQQ4nOgI4YHOR9_GH2yvi7TK760sE714QWpP5p98UISBVigktI3ILeJIczLjcycIqjPhX8iq-CPPpAOlCzDcE9EF8B8LooYeuSwqqpyzHZrL6K_15K3cCocypt_ICa1LDxoggNBfDP5v0ACzEzmu4VqijYfXobZkaY2KBIRYnCN8gN9oEWjUuYL6KxSZlD0I9r5mnuKfVfag",
        category: "Combos"
      },
      {
        id: "black-garlic-tonkotsu",
        name: "Black Garlic Tonkotsu",
        description: "Thick savory bone broth topped with roasted dynamic black garlic oil, ajitama egg and slow braised pork chashu slices.",
        price: 19.99,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1IqCiMlyeiYtRi41Bpg4ChA5rW777kbDmX-HCNhubgjrWioUHkE8Ieti1roElVPEvQoNdrH22BEpHyv4OqkRe1VZuGspAUcsATStnXR5BgP5XSI954Gi68z-pn6HOvZC4svdJpOVE9vGnSXYtvvTM_pWdWD9kbAfFszCxHvYYHQbyXSJmSihBPsTdbEe-W8xJXZDqbLrLurbCDyUMQ4t7yaZEnps3xg5vKISI4JYF1ZcljmWKx8zCyw4A6JsNjJOxgz3hfdFpTD4",
        category: "Burgers"
      }
    ]
  },
  {
    id: "urban-grill",
    name: "Urban Grill",
    cuisine: "American • Grill",
    tags: ["American", "Grill"],
    rating: 4.5,
    reviewsCount: "820",
    deliveryTime: "15 min",
    deliveryFee: 1.99,
    distance: "3.1 mi",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1myuJxTyedXTolRkvXN6C31pWjfy-u3H-WM1sWCg-IVRdQSB4JixHI4TMivHmPP9Y5rA22-q_zXpyqzlAbZVf19XfWfOsmtqRBtUs4PPLPo7S1xP90aogRTuZ6mp8FVT_xOvDPGmzJxY06Y99ilZHrmIjrIc04AjtOLGoZmX326EjDd80PmBYkN8kcDQW7uSQqDCXUjCFeDbQ7FDrRfmrPyXV2_DxqFGI_PeEzm8VwNNlW7Gl0nMLVYAcf2i_7MSgxSEUTI3Aeoo",
    menu: [
      {
        id: "classic-cheeseburger",
        name: "Urban Cheeseburger",
        description: "Single custom patty with layered lettuce, ripe tomato, and melting cheddar cheese on brioche.",
        price: 9.99,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjBXYKg6ev0rCQIoY6v8Vmv9QZKdmbLJCBSBfEzzpQLJX_wfSauoMUgZd82dYZFyQEO0Fx6kj_wWzq5zS0rDDI7u3_d06x_BPD-OFSSVPWLLV4gaIX_f-FMAcAsHoNLUiZ0tnTYz1Kqa6KR9jQjt2Faux9VOTRJIXk-3KSKWNCn2ShnsodU2qr8-xt38pDsRleDdfjUjg_YXoNsI9qB3OWoK4CQR7h5TvO5sFln7Dd5Ylgo0B7_LJ4BjLfUnqNlmPIIaagBF6Cxg0",
        category: "Burgers"
      }
    ]
  },
  {
    id: "thai-spice",
    name: "Thai Spice",
    cuisine: "Thai • Curry • Healthy",
    tags: ["Thai", "Curry", "Healthy"],
    rating: 4.7,
    reviewsCount: "940",
    deliveryTime: "25 min",
    deliveryFee: 2.99,
    distance: "1.9 mi",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOcE1z6ynEQkEFvOjZQO8WKAQ48c3nWsf6hJLaj9kMFrNE_oyykeWOkQzrHzGOi07A-0515DPhSnvxtVrk2PU71lBgWR-LxGIROoYaH5M_Xlgzf8haVW1uTx3L_AmbEcEb0_4zrNyfESOQiL5gmREyP9cH4oYr3Ots1gdquQtaIRyjVnI8bSjABfAr-Xbb5BmIJxosRV52CfOL3dC0l9verwDhpciVCgV_PuyGowovfyHnqk_Q8LM9CYmuO97LmL6wBsuuPi5kEo4",
    menu: [
      {
        id: "thai-green-curry",
        name: "Thai Green Curry",
        description: "Spicy and aromatic green curry, bamboo shoots, fresh basil and chicken slices.",
        price: 15.50,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOcE1z6ynEQkEFvOjZQO8WKAQ48c3nWsf6hJLaj9kMFrNE_oyykeWOkQzrHzGOi07A-0515DPhSnvxtVrk2PU71lBgWR-LxGIROoYaH5M_Xlgzf8haVW1uTx3L_AmbEcEb0_4zrNyfESOQiL5gmREyP9cH4oYr3Ots1gdquQtaIRyjVnI8bSjABfAr-Xbb5BmIJxosRV52CfOL3dC0l9verwDhpciVCgV_PuyGowovfyHnqk_Q8LM9CYmuO97LmL6wBsuuPi5kEo4",
        category: "Combos"
      }
    ]
  }
];

export const INITIAL_USER: UserProfile = {
  name: "Alex Thompson",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGP2z7xTumpCXz5N10PJ7pXvWEDHJQZyB8SJ0cBq1Sb8Jch61UI0qDNmXPVlrqkUmg3Pwyip03qULfcULmflcoZAsW3XGRLrMn0IPZJskUOsf3wUyJ4plp-jO3Gy1XEc-AajHO8UGxKxh3Lx0yuRQAu48nhmyGSkIw3Ky7vSMQ57X6fbCA8vsKSnT9QaIQdJFuOi_jGulgD2-AjvLseSa7QUTM55WAxFMwtnf1jpAu6JsmEQ0l2fY0Pa2D8ALTBIpjvAhOuiAP6Zo",
  tier: "Gold Member",
  points: 1240,
  totalSaved: 124.50,
  ordersCount: 42,
  email: "1341021684dxq@gmail.com"
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: "GP-8832",
    restaurantName: "Artisan Pizza Co.",
    restaurantImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDw832XVTiSwxx68VonjdtfdOagiWf4vUmybB-Q9HHOQ4oJxMiOpDMrVZ4N-MvO2cGeSs4RhHXhgk-wEkVM_1M3ON8ykiTQOTR4CklUaGcE2icM2dvtORfZobDIC_n6GHb1eTVNji6_W7qmjdjAJ9b8Y2OFZrausQDO837UPThKTVWfJ8pIpkUiGU4D7qtD0w03KReU_fPff0ZB9xIKtyr7iJ0jqkn5pBojLIXdHBfweh9sEGkCxWYt_9aliCdgyVd5tZs6NNfZN9Y",
    date: "Today",
    time: "12:45 PM",
    status: "Delivering",
    itemsCount: 2,
    total: 34.20,
    itemsSummary: "2 items • #GP-8832"
  },
  {
    id: "GP-7411",
    restaurantName: "The Green Bowl",
    restaurantImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgRQALIiFFhBOOjsT8WYZxTMeIkv1UFXtddXgRU4b6eYGvVr1VWhAT-jgQDfYqMJkFGmO2BdoIUP1EDbIxbwMEDBMXmwAMNx4YRGDiDgjm4RAAnUeEGiIlZxImV0FAd8ZF_o2_d2rTLM0FgQtokq2UJxXIXfcnXGLzLn4X-AJUcDDzJfTmC2K6O_IZ90zwRhCEjrSEdqsKl-cqSxaMjYjN8VJOVURj1uAMdaAbj-jaNDW8jsxY9lLBze_YuN4ZjiqGQAkUT9F9UeQ",
    date: "Oct 24",
    time: "7:20 PM",
    status: "Completed",
    itemsCount: 1,
    total: 18.90,
    itemsSummary: "1 item • #GP-7411"
  },
  {
    id: "GP-6902",
    restaurantName: "Burger Elite",
    restaurantImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuATU1ju5WOKHBJ9dQuFQPcE0Fx6-C9_6Ws066CcRXrO03AoBk4oVZ6MBq4appvjgszVZ7ocWhLV3IrJAHcHl226v4UycyNXs7-hIy1fAh9Li2UxT8CN7nqS7Z5yAK67S4LbeUNPsShi_2TnVqgCosRb3dQ5IkHBG4355qrYR8rbsUBgPjFDIvloN1v0tqBXJhPYTcf16J0NM8bWi85bufQnPdCgf4rap08AKKnrnfKoNxRmgR7KKrccpp4hhSQEwwz8ODQHoP5xV_0",
    date: "Oct 22",
    time: "1:15 PM",
    status: "Completed",
    itemsCount: 3,
    total: 56.45,
    itemsSummary: "3 items • #GP-6902"
  }
];

export const DEFAULT_ADDRESS: Address = {
  name: "Home",
  line1: "4521 Westview Avenue, Suite 102",
  line2: "Beverly Hills, CA 90210"
};
