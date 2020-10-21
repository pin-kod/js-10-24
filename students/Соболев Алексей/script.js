const goods = [
    { title: 'Мышка', price: 500 },
    { title: 'Ноутбук', price: 50000 },
    { title: 'Клавиатура', price: 5000 },
    { title: 'Монитор', price: 10000 },
    {},
    {},
];

const getGoodsItemLayout = (title = "More info soon", price = "More info soon") => {
    return `
        <div class="item">
            <h4>${title}</h4>
            <div class="product_img_div"></div>
            <p>${price}</p>
            <button>Добавить в корзину</button>
        </div>
    `;
}

const render = (list = [{},{}]) => {
    let goodsItems = list.map(item => getGoodsItemLayout(item.title, item.price));
    goodsItems.forEach(function(item){
        document.querySelector('.goods').innerHTML += item;
    })
};

render(goods);
