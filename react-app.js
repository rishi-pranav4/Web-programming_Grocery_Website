const { useMemo, useState } = React;
const items = {
    Fruits: [
        { name: "Apple", icon: "🍎", price: 1.5, category: "Fruits" },
        { name: "Banana", icon: "🍌", price: 0.8, category: "Fruits" },
        { name: "Orange", icon: "🍊", price: 1.1, category: "Fruits" },
        {name:"Mango",icon:"🥭",price:2.0,category:"Fruits"},
        {name:"Grape",icon:"🍇",price:0.5,category:"Fruits"},
        {name:"Watermelon",icon:"🍉",price:0.9,category:"Fruits"},
        {name:"Pineapple",icon:"🍍",price:1.7,category:"Fruits"},
        {name:"Green Apple",icon:"🍏",price:0.7,category:"Fruits"},
        {name:"Pear",icon:"🍐",price:1.2,category:"Fruits"},
        {name:"Melon",icon:"🍈",price:2.5,category:"Fruits"}
    ],
    Vegetables: [
        { name: "Potato", icon: "🥔", price: 0.9, category: "Vegetables" },
        { name: "Carrot", icon: "🥕", price: 0.7, category: "Vegetables" },
        { name: "Onion", icon: "🧅", price: 0.6, category: "Vegetables" },
        { name: "Cucumber", icon:"🥒",price: 0.5,category:"Vegetables"},
        {name:"Tomato",icon:"🍅",price:0.7,category:"Vegetables"},
        {name:"Peas",icon:"🫛",price:0.3,category:"Vegetables"},
        {name:"EggPlant",icon:"🍆",price:0.6,category:"Vegetables"},
        {name:"Capsicum",icon:"🫑",price:1.2,category:"Vegetables"},
        {name:"Mushroom",icon:"🍄‍🟫",price:1.0,category:"Vegetables"}
    ],
    Dairy: [
        { name: "Milk", icon: "🥛", price: 2.4, category: "Dairy" },
        { name: "Cheese", icon: "🧀", price: 3.5, category: "Dairy" },
        { name: "Butter", icon: "🧈", price: 2.8, category: "Dairy" }
        
    ],
    "Meat&Eggs": [
        {name:"Chicken",icon:"🍗",price:2.0,category:"Meat&Eggs"},
        {name:"Egg",icon:"🥚",price:5.0,category:"Meat&Eggs"},
        {name:"Mutton",icon:"🍖",price:2.5,category:"Meat&Eggs"},
        {name:"Bacon",icon:"🥓",price:1.8,category:"Meat&Eggs"},
        {name:"Pork",icon:"🥩",price:2.8,category:"Meat&Eggs"}
    ]


};

const recipes = [
    { name: "Fruit Salad", needs: ["Apple", "Banana", "Orange"] },
    { name: "Mashed Potato", needs: ["Potato", "Milk", "Butter"] },
    { name: "Cheesy Veg Mix", needs: ["Onion", "Carrot", "Cheese"] }
];

function App() {
    const [view, setView] = useState("shop");
    const [category, setCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
    const [cart, setCart] = useState({});

    const allItems = useMemo(function () {
        return Object.values(items).flat();
    }, []);

    const cartNames = Object.keys(cart);
    const uniqueCount = cartNames.length;
    const totalCount = cartNames.reduce(function (total, name) {
        return total + cart[name];
    }, 0);

    function openFullMenu() {
        setView("shop");
        setCategory("All");
    }

    function openMenu(nextView, nextCategory) {
        setView(nextView);
        if (nextCategory) {
            setCategory(nextCategory);
        }
    }

    function addItem(name) {
        setCart(function (currentCart) {
            const newCart = { ...currentCart };
            newCart[name] = (newCart[name] || 0) + 1;
            return newCart;
        });
    }

    function removeOne(name) {
        setCart(function (currentCart) {
            if (!currentCart[name]) {
                return currentCart;
            }

            const newCart = { ...currentCart };
            newCart[name] -= 1;

            if (newCart[name] <= 0) {
                delete newCart[name];
            }

            return newCart;
        });
    }

    function removeAll(name) {
        setCart(function (currentCart) {
            const newCart = { ...currentCart };
            delete newCart[name];
            return newCart;
        });
    }

    function clearBasket() {
        setCart({});
    }

    function getShopItems() {
        let list = category === "All" ? allItems : items[category];

        if (search.trim() !== "") {
            list = list.filter(function (item) {
                return item.name.toLowerCase().includes(search.toLowerCase());
            });
        }

        if (sort === "az") {
            list = list.slice().sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });
        }

        return list;
    }

    function getRecipeCards() {
        return recipes.filter(function (recipe) {
            if (search.trim() === "") {
                return true;
            }
            return recipe.name.toLowerCase().includes(search.toLowerCase());
        });
    }

    function getPageTitle() {
        if (view === "cart") {
            return "Cart";
        }

        if (view === "checkout") {
            return "Checkout";
        }

        if (view === "recipes") {
            return "Recipes";
        }

        if (category === "All") {
            return "Full Menu";
        }

        return category;
    }

    function renderMainCards() {
        if (view === "shop") {
            const list = getShopItems();

            if (list.length === 0) {
                return <p>No items found.</p>;
            }

            return list.map(function (item) {
                const quantity = cart[item.name] || 0;

                return (
                    <div className="card" key={item.category + item.name}>
                        <div className="icon">{item.icon}</div>
                        <h3>{item.name}</h3>
                        <p>Category: {item.category}</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
                        <p>Quantity: {quantity}</p>
                        {quantity === 0 ? (
                            <button onClick={function () { addItem(item.name); }}>Add to Basket</button>
                        ) : (
                            <div className="quantity-actions">
                                <button className="small-btn" onClick={function () { removeOne(item.name); }}>-</button>
                                <button onClick={function () { addItem(item.name); }}>+</button>
                            </div>
                        )}
                    </div>
                );
            });
        }

        if (view === "cart") {
            if (cartNames.length === 0) {
                return <p>Your basket is empty.</p>;
            }

            return cartNames.map(function (name) {
                return (
                    <div className="card" key={name}>
                        <h3>{name}</h3>
                        <p>Quantity: {cart[name]}</p>
                        <button onClick={function () { addItem(name); }}>Add One</button>
                        <br />
                        <button className="small-btn" onClick={function () { removeOne(name); }}>Remove One</button>
                    </div>
                );
            });
        }

        if (view === "checkout") {
            return (
                <React.Fragment>
                    <div className="checkout-panel">
                        <h3>Order Summary</h3>
                        <p><strong>Unique items:</strong> {uniqueCount}</p>
                        <p><strong>Total quantity:</strong> {totalCount}</p>
                    </div>

                    <div className="checkout-panel">
                        <h3>Basket Details</h3>
                        {cartNames.length === 0 ? (
                            <p>Basket is empty.</p>
                        ) : (
                            cartNames.map(function (name) {
                                return (
                                    <div className="cart-item" key={name}>
                                        <span>{name} ({cart[name]})</span>
                                        <button className="small-btn" onClick={function () { removeAll(name); }}>
                                            Remove
                                        </button>
                                    </div>
                                );
                            })
                        )}
                        <button className="clear-btn" onClick={clearBasket}>Clear Basket</button>
                    </div>
                </React.Fragment>
            );
        }

        const recipeCards = getRecipeCards();

        if (recipeCards.length === 0) {
            return <p>No recipes found.</p>;
        }

        return recipeCards.map(function (recipe) {
            return (
                <div className="card" key={recipe.name}>
                    <h3>{recipe.name}</h3>
                    <p>Ingredients: {recipe.needs.join(", ")}</p>
                </div>
            );
        });
    }

    return (
        <React.Fragment>
            <div className="topbar">
                <div className="site-title">
                    <h1>Urban Pantry</h1>
                    <p>Fresh groceries, simple shopping, quick recipe ideas</p>
                </div>
            </div>

            <div className="container">
                <div className="box">
                    <h2 className="menu-title" onClick={openFullMenu}>Menu</h2>
                    <div className="menu">
                        <button
                            className={"menu-btn" + (view === "shop" && category === "Fruits" ? " active" : "")}
                            onClick={function () { openMenu("shop", "Fruits"); }}
                        >
                            Fruits
                        </button>
                        <button
                            className={"menu-btn" + (view === "shop" && category === "Vegetables" ? " active" : "")}
                            onClick={function () { openMenu("shop", "Vegetables"); }}
                        >
                            Vegetables
                        </button>
                        <button
                            className={"menu-btn" + (view === "shop" && category === "Dairy" ? " active" : "")}
                            onClick={function () { openMenu("shop", "Dairy"); }}
                        >
                            Dairy
                        </button>
                        <button
                            className={"menu-btn" + (view === "shop" && category === "Meat&Eggs" ? " active" : "")}
                            onClick={function () { openMenu("shop", "Meat&Eggs"); }}
                        >
                            Meat&Eggs
                        </button>
                        <button
                            className={"menu-btn" + (view === "cart" ? " active" : "")}
                            onClick={function () { openMenu("cart"); }}
                        >
                            Cart
                        </button>
                        <button
                            className={"menu-btn" + (view === "recipes" ? " active" : "")}
                            onClick={function () { openMenu("recipes"); }}
                        >
                            Recipes
                        </button>
                        <button
                            className={"menu-btn" + (view === "checkout" ? " active" : "")}
                            onClick={function () { openMenu("checkout"); }}
                        >
                            Checkout
                        </button>
                    </div>
                </div>

                <div className="box">
                    <h1>{getPageTitle()}</h1>

                    {view !== "checkout" ? (
                        <div className="tools">
                            <input
                                type="text"
                                placeholder={view === "recipes" ? "Search recipes" : "Search items"}
                                value={search}
                                onChange={function (event) { setSearch(event.target.value); }}
                            />
                            {view === "shop" ? (
                                <select value={sort} onChange={function (event) { setSort(event.target.value); }}>
                                    <option value="default">Default</option>
                                    <option value="az">A to Z</option>
                                </select>
                            ) : null}
                        </div>
                    ) : null}

                    <div className={view === "checkout" ? "checkout-layout" : "cards"}>
                        {renderMainCards()}
                    </div>
                </div>

                <div className="box">
                    <div className="profile">
                        <h2>User Profile</h2>
                        <p><strong>Name:</strong> User 1</p>
                        <p><strong>Email:</strong> user1@gmail.com</p>
                        <p><strong>Status:</strong> Active</p>
                    </div>

                    <p>Open Checkout to view your basket totals and order details.</p>
                </div>
            </div>
        </React.Fragment>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
