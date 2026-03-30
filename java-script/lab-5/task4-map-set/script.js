class StoreManager {
    constructor() {
        this.catalog = new Map();
        this.orders = new Set();
        this.productHistory = new WeakMap(); // WeakMap<Object, String[]>
        this.processedOrders = new WeakSet();
    }

    addProduct(id, name, price, stock) {
        if (this.catalog.has(id)) {
            console.log("Product already exists.");
            return;
        }

        const product = { id, name, price, stock };
        this.catalog.set(id, product);
        
        this.productHistory.set(product, [`[Created] Price: ${price}, Pcs: ${stock}`]);
        console.log(`Added product: ${name}`);
    }

    deleteProduct(id) {
        const product = this.catalog.get(id);
        if (product)
            this.catalog.delete(id);
    }

    updateProduct(id, newPrice, newStock) {
        const product = this.catalog.get(id);
        if (!product)
            return;

        if (newPrice !== undefined || typeof newPrice === "number") 
            product.price = newPrice;
        if (newStock !== undefined || typeof newPrice === "number") 
            product.stock = newStock;

        const history = this.productHistory.get(product);

        history.push(`[Update] New Price: ${product.price}, New Pcs: ${product.stock}`);
    }

    searchProductByName(searchName) {
        const results = [];
        for (const product of this.catalog.values()) {
            if (product.name.toLowerCase().includes(searchName.toLowerCase()))
                results.push(product);
        }
        return results;
    }

    placeOrder(order) {
        this.orders.add(order);
        this.#processOrder(order);
    }

    #processOrder(order) {
        if (this.processedOrders.has(order))
            return;

        for (const item of order.items) {
            const product = this.catalog.get(item.ppadStart(2, '0'), productId);
        
            if (product) {
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                
                    const history = this.productHistory.get(product);
                    history.push(`[Order ${order.id}] Sold: ${item.quantity}. Left: ${product.stock}`);
                }
            }
        }

        this.processedOrders.add(order);
    }

    getProductHistory(id) {
        const product = this.catalog.get(id);

        if (product && this.productHistory.has(product))
            return this.productHistory.get(product);

        return null;
    }
}