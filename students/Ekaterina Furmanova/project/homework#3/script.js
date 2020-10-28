const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const request = (url, callback) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `${API}/${url}`);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(callback(JSON.parse(xhr.responseText)));
                } else if (xhr.status === 404) {
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
    constructor({ product_name = 'Нет данных', price }) {
        this.title = product_name;
        this.price = price;
    }

    render() {
        return `
        <div class="item card p-4" style="width: 16rem;">
        
            <h4 class="card-title">${this.title}</h4>
            <p class="card-text">${this.price} руб.</p>
            <button>Купить</button>
        </div>
        `;
    }
}

class GoodsList {
    constructor() {
        this.goods = [];
    }

    fetchData(callback) {
        request('catalogData.json', (goodsFromServer) => {
            this.goods = goodsFromServer;
            callback();
        });
    }

    render() {
        let goodsItems = this.goods.map(item => {
            const goodsItem = new GoodsItem(item);
            return goodsItem.render();
        });
        document.querySelector('.goods').innerHTML = goodsItems.join('');
    }

    calculateQuantity() {

    }

    calculatePrice() {
        return this.goods.reduce((acc, curr) => acc + curr.price, 0);
    }
}

class Basket {
    fetchBasket(callback) {
        request('getBasket.json', (goodsFromBasket) => {
            this.goods = goodsFromBasket;
            callback();
        });
    }

    render() {
        let basketItems = this.goods.map(item => {
            const basketItem = new BasketItem(item);
            return basketItem.render();
        });
        document.querySelector('.basket').innerHTML = basketItems.join('');
    }

    addItem(item) {

    }

    changeQuantity() {

    }

    removeItem() {

    }

    calculatePrice() {
         return this.goods.reduce((acc, curr) => acc + curr.price, 0);
        
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

const list = new GoodsList();
list.fetchData(() => list.render());
