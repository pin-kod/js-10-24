const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const request = (url, method = 'GET') => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, `${API}/${url}`);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else if(xhr.status === 404) {
                    reject('Not Found error');
                } else {
                    reject('Unknown error');
                }
            }
        }

        xhr.send();
    });
}

class GoodsItem {
    constructor({ id_product, product_name = 'Нет данных', price }) {
        this.id = id_product;
        this.title = product_name;
        this.price = price;
    }

    render() {
        return `
            <div class="item" data-id="${this.id}">
                <h4>${this.title}</h4>
                <p>${this.price}</p>
                <button name="add-to-basket">Add to basket</button>
            </div>
        `;
    }
}

class GoodsList {
    constructor(basket) {
        this.goods = [];
        this.filteredGoods = [];
        this.basket = basket;
        this.fetchData();

        document.querySelector('.search').addEventListener('input', (event) => {
            this.filterGoods(event.target.value);
        });
    }

    filterGoods(searchValue) {
        const regexp = new RegExp(searchValue, 'i');
        this.filteredGoods = this.goods.filter((goodsItem) => regexp.test(goodsItem.product_name));
        this.render();
    }

    fetchData() {
        return new Promise((resolve, reject) => {
            request('catalogData.json')
                .then((goodsFromServer) => {
                    this.goods = goodsFromServer;
                    this.filteredGoods = goodsFromServer;
                    this.render();
                    resolve();
                })
                .catch((err) => {
                    console.error(err);
                });
        })
    }

    render() {
        let goodsItems = this.filteredGoods.map(item => {
            const goodsItem = new GoodsItem(item);
            return goodsItem.render();
        });
        document.querySelector('.goods').innerHTML = goodsItems.join('');

        document.querySelector('.goods').addEventListener('click', (event) => {
            if (event.target.name === 'add-to-basket') {
                const id = event.target.parentElement.dataset.id;
                const item = this.goods.find((goodsItem) => goodsItem.id_product === parseInt(id));
                if (item) {
                    this.basket.addItem(item);
                } else {
                    console.error(`Can't find element with id ${id}`);
                }
            }
        });
    }

    calculateQuantity() {

    }

    calculatePrice() {
        return this.goods.reduce((acc, curr) => acc + curr.price, 0);
    }
}

class Basket {
    constructor() {
        this.basketGoods = [];
        this.totalPrice = 0;
        this.countGoods = 0;
        this.fetchBasket();
    }

    fetchBasket() {
        return new Promise((resolve, reject) => {
            request('getBasket.json')
                .then((basketGoodsFromServer) => {
                    this.basketGoods = basketGoodsFromServer.contents;
                    this.totalPrice = basketGoodsFromServer.amount;
                    this.countGoods = basketGoodsFromServer.countGoods;
                    resolve();
                })
                .catch((err) => {
                    console.error(err);
                });
        })
    }

    addItem(item) {
        return new Promise((resolve, reject) => {
            request('addToBasket.json', 'GET')
                .then((data) => {
                    if (data.result === 1) {
                        this.basketGoods.push(item);
                    } else {
                        console.error('addItem result != 1');
                    }
                    resolve();
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    }

    removeItem(id) {
        return new Promise((resolve, reject) => {
            request('deleteFromBasket.json', 'GET')
                .then((data) => {
                    if (data.result === 1) {
                        this.basketGoods = this.basketGoods.filter((product) => product.id_product !== id);
                    } else {
                        console.error('removeItem result != 1');
                    }
                    resolve();
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    }

    render() {

    }

    changeQuantity() {

    }

    calculatePrice() {

    }
}

class BasketItem {
    render() {

    }

    changeQuantity() {

    }

    removeItem() {

    }
}

const list = new GoodsList(new Basket());
