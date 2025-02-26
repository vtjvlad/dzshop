
const mongoose = require("mongoose");
const sendNotification = require("./sendTg");
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    orderStatus: { type: String, default: 'Новый' },
    oStatusCode: { type: Number, default: 1 }
});



// Модель для заказа
const Order = mongoose.model('Order', orderSchema);



async function watchChanges() {
    console.log("Начинаем отслеживание изменений в MongoDB...");


    const changeStream = Order.watch();

    changeStream.on("change", (change) => {
        console.log("Изменение в БД:", change);

        const documentKey = change.documentKey;
        const orderId = documentKey._id;
        const fullDocument = change.fullDocument;
        const { _id, userId, name, phone, email, address, paymentMethod, items, totalAmount, orderDate, orderStatus, oStatusCode } = fullDocument;
        const { productId, quantity } = items[0]; 
        const users = User.find();




        sendNotification(
            `🔔 Новый заказ!\n\n` +
            `📌 ID заказа: ${_id}\n` +
            `👤 Покупатель: ${name}\n` +
            `📞 Телефон: ${phone}\n` +
            `✉️ Email: ${email}\n` +
            `📍 Адрес: ${address}\n` +
            `💳 Оплата: ${totalAmount}\n\n` +
            `🛒 Товары:\n` +
            items.map(item => `- ${item.productId} (x${item.quantity})`).join("\n")   
);
        // sendNotification(`🔔 Обновление в БД:\n\n${JSON.stringify(orderId, null, 2)}`);
    });
}

watchChanges();
