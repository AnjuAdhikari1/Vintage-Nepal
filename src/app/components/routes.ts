import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { ItemDetails } from "./components/ItemDetails";
import { SellItem } from "./components/SellItem";
import { MyListings } from "./components/MyListings";
import { Profile } from "./components/Profile";
import { Category } from "./components/Category";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { Login } from "./components/Auth/Login";
import { Signup } from "./components/Auth/Signup";
import { SellerVerification } from "./components/Auth/SellerVerification";
import { Favorites } from "./components/Favorites";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "item/:id", Component: ItemDetails },
      { path: "sell", Component: SellItem },
      { path: "my-listings", Component: MyListings },
      { path: "profile/:userId", Component: Profile },
      { path: "category/:categoryName", Component: Category },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "seller-verification", Component: SellerVerification },
      { path: "favorites", Component: Favorites },
      { path: "*", Component: NotFound },
    ],
  },
]);